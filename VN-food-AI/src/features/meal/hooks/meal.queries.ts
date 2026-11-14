import {
  useCreateMealApiV1MealsPost,
  useGetDailyMealsApiV1MealsDailyGet,
} from "@/api/generated";
import { GetDailyMealsApiV1MealsDailyGetParams } from "@/api/generated/model";
import { dateUtils } from "@/lib/utils";
import { YearMonthDay } from "@/types/date";
export const mealQueryKeys = {
  all: ["meal"] as const,
  daily: (date: YearMonthDay) => [...mealQueryKeys.all, "daily", date] as const,
};

export const useCreateMealMutation = () => {
  const mutation = useCreateMealApiV1MealsPost();
  return { ...mutation };
};

export const useDailyMealsQuery = (date?: YearMonthDay) => {
  const request: GetDailyMealsApiV1MealsDailyGetParams | undefined = date
    ? {
        date: date,
      }
    : undefined;
  return useGetDailyMealsApiV1MealsDailyGet(request, {
    query: {
      queryKey: mealQueryKeys.daily(date ?? dateUtils.now()),
      retry: 1,
    },
  });
};
