import {
  getGetProfileApiV1ProfileGetQueryKey,
  useAddWeightApiV1ProfileWeightPost,
  useCalculateDailyNutritionApiV1NutritionCalculatePost,
  useGetProfileApiV1ProfileGet,
} from "@/api/generated";
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
  return useAddWeightApiV1ProfileWeightPost();
};

export const useCalculateNutritionMutation = () =>
  useCalculateDailyNutritionApiV1NutritionCalculatePost();
