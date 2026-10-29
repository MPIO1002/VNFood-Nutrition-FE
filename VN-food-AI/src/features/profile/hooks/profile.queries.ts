import {
  getGetProfileApiV1ProfileGetQueryKey,
  useAddWeightApiV1ProfileWeightPost,
  useGetProfileApiV1ProfileGet,
} from "@/api/generated";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileResponseSchema } from "../validation/profileSchema";

export const profileQueryKeys = {
  all: ["profile"] as const,
  current: getGetProfileApiV1ProfileGetQueryKey,
};

export const useProfileQuery = () => {
  return useGetProfileApiV1ProfileGet({
    query: {
      retry: 1,
      select: (response) => {
        const parsed = ProfileResponseSchema.safeParse(response);
        if (!parsed.success) {
          throw new Error("Phản hồi hồ sơ không hợp lệ");
        }
        return parsed.data;
      },
    },
  });
};

export const useUpdateWeightMutation = () => {
  const queryClient = useQueryClient();
  return useAddWeightApiV1ProfileWeightPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: profileQueryKeys.current(),
        });
      },
    },
  });
};
