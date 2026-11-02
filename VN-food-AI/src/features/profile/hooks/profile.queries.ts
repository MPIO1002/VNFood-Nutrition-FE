import {
  useAddWeightApiV1ProfileWeightPost,
  useCalculateDailyNutritionApiV1NutritionCalculatePost,
  useGetProfileApiV1ProfileGet,
  useUpdateProfileApiV1ProfilePatch,
  useUploadImageEndpointApiV1UploadImagePost,
} from "@/api/generated";
import { ProfileResponseSchema } from "../validation/profileSchema";

export const profileQueryKeys = {
  all: ["profile"] as const,
  current: () => [...profileQueryKeys.all, "current"] as const,
};

export const useProfileQuery = () => {
  return useGetProfileApiV1ProfileGet({
    query: {
      retry: 1,
      queryKey: profileQueryKeys.current(),
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
  return useAddWeightApiV1ProfileWeightPost();
};

export const useUpdateProfileMutation = () => {
  return useUpdateProfileApiV1ProfilePatch();
};

export const useUploadProfileImageMutation = () => {
  return useUploadImageEndpointApiV1UploadImagePost();
};

export const useCalculateNutritionMutation = () =>
  useCalculateDailyNutritionApiV1NutritionCalculatePost();
