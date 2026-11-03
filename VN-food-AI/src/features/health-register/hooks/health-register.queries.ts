import { useCalculateDailyNutritionApiV1NutritionCalculatePost } from "@/api/generated";
import { useCallback } from "react";

export const useHealthRegisterMutation = useCallback(() => {
  const mutation = useCalculateDailyNutritionApiV1NutritionCalculatePost();
  return { ...mutation };
}, []);
