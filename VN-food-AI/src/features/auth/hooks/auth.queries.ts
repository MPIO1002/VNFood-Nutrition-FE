import {
  useLoginApiV1AuthLoginPost,
  useLogoutApiV1AuthLogoutPost,
  useMeApiV1AuthMeGet,
  useRegisterApiV1AuthRegisterPost,
} from "@/api/generated";
import { UserResponse } from "@/api/generated/model";

export const authQueryKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authQueryKeys.all, "current"] as const,
};

export const useRegisterMutation = () => {
  const mutation = useRegisterApiV1AuthRegisterPost();
  return { ...mutation };
};

export const useLoginMutation = () => {
  const mutation = useLoginApiV1AuthLoginPost();
  return { ...mutation };
};

export const useLogoutMutation = () => {
  const mutation = useLogoutApiV1AuthLogoutPost();
  return { ...mutation };
};

export const useCurrentUserQuery = () => {
  const response = useMeApiV1AuthMeGet<UserResponse>({
    query: {
      queryKey: authQueryKeys.currentUser(),
      enabled: false,
    },
  });
  return response;
};
