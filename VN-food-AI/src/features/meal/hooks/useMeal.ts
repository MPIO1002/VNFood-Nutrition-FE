import { MealCreateRequest, MealResponse } from "@/api/generated/model";
import { APIMutatorOptions } from "@/api/types/api";
import { useCallback } from "react";
import { useCreateMealMutation } from "./meal.queries";

export const useMeal = () => {
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
    [createMealMutation],
  );

  return { handleCreateMeal };
};
