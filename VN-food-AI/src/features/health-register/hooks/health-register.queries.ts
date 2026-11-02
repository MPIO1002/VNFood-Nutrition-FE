import { useCalculateDailyNutritionApiV1NutritionCalculatePost } from "@/api/generated";

export const useHealthRegisterMutation = () => {
  const mutation = useCalculateDailyNutritionApiV1NutritionCalculatePost();
  return { ...mutation };
};
