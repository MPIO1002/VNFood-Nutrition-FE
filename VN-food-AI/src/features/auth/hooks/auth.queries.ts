import {
  useLoginApiV1AuthLoginPost,
  useLogoutApiV1AuthLogoutPost,
  useMeApiV1AuthMeGet,
  useRegisterApiV1AuthRegisterPost,
} from "@/api/generated";
import { UserResponse } from "@/api/generated/model";
import { useCallback } from "react";

export const authQueryKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authQueryKeys.all, "current"] as const,
};

export const useRegisterMutation = useCallback(() => {
  const mutation = useRegisterApiV1AuthRegisterPost();
  return { ...mutation };
}, []);

export const useLoginMutation = useCallback(() => {
  const mutation = useLoginApiV1AuthLoginPost();
  return { ...mutation };
}, []);

export const useLogoutMutation = useCallback(() => {
  const mutation = useLogoutApiV1AuthLogoutPost();
  return { ...mutation };
}, []);

export const useCurrentUserQuery = useCallback(() => {
  const response = useMeApiV1AuthMeGet<UserResponse>({
    query: {
      queryKey: authQueryKeys.currentUser(),
      enabled: false,
    },
  });
  return response;
}, []);
