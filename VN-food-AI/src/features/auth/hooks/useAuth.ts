import {
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from "@/api/generated/model";
import {
  clearAuthSession,
  getStoredTokens,
  saveAuthSession,
} from "@/api/session/session";

import { APIMutatorOptions } from "@/api/types/api";
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

  const initAuth = useCallback(
    async ({
      onUserChange,
    }: {
      onUserChange: (user: UserResponse | null) => void;
    }) => {
      const { user: storedUser } = await getStoredTokens();
      if (storedUser) {
        onUserChange(storedUser);
      }
      try {
        const { data: me } = getCurrentUser();
        onUserChange(me ?? null);
      } catch {
        // Không đồng bộ được profile nhưng vẫn có thể dùng storedUser
      }
    },
    [],
  );

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
            options?.onSuccess?.(res);
          },
          onError: (e) => {
            console.log(`Failed to call api: ${e.cause?.message}`);
            console.log(`Failed status: ${e.status}`);
            options?.onError?.(e);
          },
          onSettled: (res, e, v) => {
            options?.onSettled?.(res, e, { ...v.data });
          },
        },
      );
    },
    [registerMutation],
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
            options?.onSuccess?.(res);
          },
          onError: (e) => {
            console.log(`Failed to call api: ${e.cause?.message}`);
            console.log(`Failed status: ${e.status}`);
            options?.onError?.(e);
          },
          onSettled: (res, e, v) => {
            options?.onSettled?.(res, e, { ...v.data });
          },
        },
      );
    },
    [loginMutation],
  );

  const handleLogout = useCallback(
    async ({
      options,
    }: {
      options?: APIMutatorOptions<void, RefreshRequest>;
    }) => {
      const { refreshToken } = await getStoredTokens();
      if (!refreshToken) return;

      logOutMutation.mutate(
        {
          data: {
            refresh_token: refreshToken,
          },
        },
        {
          onSuccess: async () => {
            await clearAuthSession();
            queryClient.invalidateQueries({
              queryKey: authQueryKeys.currentUser(),
            });
            options?.onSuccess?.();
          },
          onError: (e) => {
            console.log(`Failed to call api: ${e.cause?.message}`);
            console.log(`Failed status: ${e.status}`);
            options?.onError?.(e);
          },
          onSettled: (_, e, req) => {
            options?.onSettled?.(undefined, e, { ...req.data });
          },
        },
      );
    },
    [logOutMutation],
  );

  const getCurrentUser = useCallback(() => {
    return useCurrentUserQuery();
  }, []);

  return {
    handleLogin,
    handleRegister,
    getCurrentUser,
    handleLogout,
    initAuth,
  };
};
