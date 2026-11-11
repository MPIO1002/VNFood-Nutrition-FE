import { MealCreateRequest, MealResponse } from "@/api/generated/model";
import { APIMutatorOptions } from "@/api/types/api";
import { diaryQueryKeys } from "@/features/diary";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { mealQueryKeys, useCreateMealMutation } from "./meal.queries";

export const useMeal = () => {
  const queryClient = useQueryClient();
  const createMealMutation = useCreateMealMutation();

  const handleCreateMeal = useCallback(
    (
      data: MealCreateRequest,
      options?: APIMutatorOptions<MealResponse, MealCreateRequest>,
    ) => {
      createMealMutation.mutate(
        { data },
        {
          onSuccess: (res) => {
            queryClient.invalidateQueries({
              queryKey: mealQueryKeys.daily(),
            });
            queryClient.invalidateQueries({
              queryKey: diaryQueryKeys.months(),
            });
            options?.onSuccess?.(res);
          },
          onError: (e) => {
            options?.onError?.(e);
          },
          onSettled: (res, e, req) => {
            options?.onSettled?.(res, e, { ...req.data });
          },
        },
      );
    },
    [createMealMutation, queryClient],
  );

  return { handleCreateMeal };
};
