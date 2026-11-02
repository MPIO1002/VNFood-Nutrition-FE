import {
  HTTPValidationError,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from "@/api/generated/model";
import {
  clearAuthSession,
  getStoredTokens,
  initializeSessionState,
  saveAuthSession,
} from "@/api/session/session";

import { LogoutApiV1AuthLogoutPostMutationVariables } from "@/api/generated";
import { ErrorType } from "@/api/mutator/axios-instance";
import { APIMutatorOptions } from "@/api/types/api";
import { profileQueryKeys } from "@/features/profile/hooks/profile.queries";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
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

  const initAuth = async ({
    onUserChange,
  }: {
    onUserChange: (user: UserResponse | null) => void;
  }) => {
    await initializeSessionState();
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

  const handleRegister = useCallback(
    ({
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
            queryClient.invalidateQueries({
              queryKey: profileQueryKeys.current(),
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
    },
    [],
  );

  const handleLogin = useCallback(
    ({
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
            queryClient.invalidateQueries({
              queryKey: profileQueryKeys.current(),
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
    },
    [],
  );

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
      queryClient.removeQueries({ queryKey: profileQueryKeys.current() });
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
      queryClient.removeQueries({ queryKey: authQueryKeys.currentUser() });
      queryClient.removeQueries({ queryKey: profileQueryKeys.current() });
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
