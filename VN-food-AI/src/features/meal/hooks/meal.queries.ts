import { useCreateMealApiV1MealsPost } from "@/api/generated";
import { useCallback } from "react";

export const mealQueryKeys = {
  all: ["meal"] as const,
};

export const useCreateMealMutation = useCallback(() => {
  const mutation = useCreateMealApiV1MealsPost();
  return { ...mutation };
}, []);
