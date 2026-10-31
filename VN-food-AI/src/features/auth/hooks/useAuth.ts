import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
  HTTPValidationError,
} from "@/api/generated/model";
import {
  clearAuthSession,
  getStoredTokens,
  saveAuthSession,
} from "@/api/session/session";

import { LogoutApiV1AuthLogoutPostMutationVariables } from "@/api/generated";
import { APIMutatorOptions } from "@/api/types/api";
import { ErrorType } from "@/api/mutator/axios-instance";
import { useQueryClient } from "@tanstack/react-query";
import {
  authQueryKeys,
  useCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "./auth.queries";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logOutMutation = useLogoutMutation();
  const currentUserQuery = useCurrentUserQuery();

  function extractErrorMessage(data: any, defaultMsg: string): string {
    if (!data) return defaultMsg;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail) && data.detail.length > 0) {
      const first = data.detail[0];
      return first.msg || first.message || defaultMsg;
    }
    if (data.message) return data.message;
    return defaultMsg;
  }

  const initAuth = async ({
    onUserChange,
  }: {
    onUserChange: (user: UserResponse | null) => void;
  }) => {
    const { accessToken, user: storedUser } = await getStoredTokens();
    if (storedUser) {
      onUserChange(storedUser);
    }
    if (accessToken) {
      try {
        const { data: me } = await currentUserQuery.refetch();
        onUserChange(me ?? storedUser);
      } catch {
        // Không đồng bộ được profile nhưng vẫn có thể dùng storedUser
      }
    }
  };

  const handleRegister = ({
    data,
    options,
  }: {
    data: RegisterRequest;
    options?: APIMutatorOptions<TokenResponse, RegisterRequest>;
  }) => {
    registerMutation.mutate(
      {
        data: {
          email: data.email.trim(),
          password: data.password,
          ...(data.full_name ? { full_name: data.full_name.trim() } : {}),
        },
      },
      {
        onSuccess: async (res: TokenResponse) => {
          await saveAuthSession(res);
          queryClient.invalidateQueries({
            queryKey: authQueryKeys.currentUser(),
          });
          options?.onSuccess?.(res);
        },
        onError: (e) => {
          console.error("Register request failed", {
            message: e.message,
            code: e.code,
            status: e.response?.status,
            url: e.config?.baseURL
              ? `${e.config.baseURL}${e.config.url ?? ""}`
              : e.config?.url,
          });
          options?.onError?.(e);
        },
        onSettled: (res, e, v) => {
          options?.onSettled?.(res, e, { ...v.data });
        },
      },
    );
  };

  const handleLogin = ({
    data,
    options,
  }: {
    data: LoginRequest;
    options?: APIMutatorOptions<TokenResponse, LoginRequest>;
  }) => {
    loginMutation.mutate(
      {
        data: {
          email: data.email.trim(),
          password: data.password,
        },
      },
      {
        onSuccess: async (res: TokenResponse) => {
          await saveAuthSession(res);
          queryClient.invalidateQueries({
            queryKey: authQueryKeys.currentUser(),
          });
          options?.onSuccess?.(res);
        },
        onError: (e) => {
          console.error("Login request failed", {
            message: e.message,
            code: e.code,
            status: e.response?.status,
            url: e.config?.baseURL
              ? `${e.config.baseURL}${e.config.url ?? ""}`
              : e.config?.url,
          });
          options?.onError?.(e);
        },
        onSettled: (res, e, v) => {
          options?.onSettled?.(res, e, { ...v.data });
        },
      },
    );
  };

  const handleLogout = async ({
    options,
  }: {
    options?: APIMutatorOptions<
      void,
      LogoutApiV1AuthLogoutPostMutationVariables
    >;
  }) => {
    const { refreshToken } = await getStoredTokens();
    if (!refreshToken) {
      await clearAuthSession();
      queryClient.removeQueries({ queryKey: ["/api/v1/profile"] });
      queryClient.invalidateQueries({
        queryKey: authQueryKeys.currentUser(),
      });
      options?.onSuccess?.();
      return;
    }

    try {
      await logOutMutation.mutateAsync({
        data: {
          refresh_token: refreshToken,
        },
      });
      await clearAuthSession();
      queryClient.removeQueries({ queryKey: ["/api/v1/profile"] });
      queryClient.invalidateQueries({
        queryKey: authQueryKeys.currentUser(),
      });
      options?.onSuccess?.();
    } catch (e) {
      const error = e as ErrorType<HTTPValidationError>;
      console.error("Logout request failed", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        url: error.config?.baseURL
          ? `${error.config.baseURL}${error.config.url ?? ""}`
          : error.config?.url,
      });
      options?.onError?.(error);
      throw e;
    } finally {
      options?.onSettled?.(undefined, null, {
        data: { refresh_token: refreshToken },
      });
    }
  };

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    initAuth,
  };
};
