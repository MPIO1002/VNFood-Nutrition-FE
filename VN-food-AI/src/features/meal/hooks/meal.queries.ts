import {
  useCreateMealApiV1MealsPost,
  useGetDailyMealsApiV1MealsDailyGet,
} from "@/api/generated";
export const mealQueryKeys = {
  all: ["meal"] as const,
  daily: () => [...mealQueryKeys.all, "daily"] as const,
};

export const useCreateMealMutation = () => {
  const mutation = useCreateMealApiV1MealsPost();
  return { ...mutation };
};

export const useDailyMealsQuery = () => {
  return useGetDailyMealsApiV1MealsDailyGet(undefined, {
    query: {
      queryKey: mealQueryKeys.daily(),
      retry: 1,
    },
  });
};
