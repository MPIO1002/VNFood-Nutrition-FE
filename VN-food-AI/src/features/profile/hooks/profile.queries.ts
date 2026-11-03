import {
  useAddWeightApiV1ProfileWeightPost,
  useCalculateDailyNutritionApiV1NutritionCalculatePost,
  useGetProfileApiV1ProfileGet,
  useUpdateProfileApiV1ProfilePatch,
  useUploadImageEndpointApiV1UploadImagePost,
} from "@/api/generated";
import { useCallback } from "react";
import { ProfileResponseSchema } from "../validation/profileSchema";

export const profileQueryKeys = {
  all: ["profile"] as const,
  current: () => [...profileQueryKeys.all, "current"] as const,
};

export const useProfileQuery = useCallback(() => {
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
}, []);

export const useUpdateWeightMutation = useCallback(() => {
  return useAddWeightApiV1ProfileWeightPost();
}, []);

export const useUpdateProfileMutation = useCallback(() => {
  return useUpdateProfileApiV1ProfilePatch();
}, []);

export const useUploadProfileImageMutation = useCallback(() => {
  return useUploadImageEndpointApiV1UploadImagePost();
}, []);

export const useCalculateNutritionMutation = useCallback(
  () => useCalculateDailyNutritionApiV1NutritionCalculatePost(),
  [],
);
