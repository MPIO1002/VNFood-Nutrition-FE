import { NutritionGoal } from "@/api/generated/model";
import { useCallback, useRef } from "react";
import { WeightChangePlan, WeightChangePlanData } from "../../types/metabolism";

export const useHealthPlanRegister = () => {
  const losePlanValues = useRef<WeightChangePlan>({
    goal_pace: "standard",
    weight_change_kg: 3,
  });

  const gainPlanValues = useRef<WeightChangePlan>({
    goal_pace: "standard",
    weight_change_kg: 3,
  });

  const balancedPlan: WeightChangePlan = {
    goal_pace: null,
    weight_change_kg: 0,
  };

  const onLosePlanValueChange = useCallback(
    (fieldData: WeightChangePlanData) => {
      losePlanValues.current = {
        ...losePlanValues.current,
        [fieldData.field]: fieldData.value,
      };
    },
    [],
  );

  const onGainPlanValueChange = useCallback(
    (fieldData: WeightChangePlanData) => {
      gainPlanValues.current = {
        ...gainPlanValues.current,
        [fieldData.field]: fieldData.value,
      };
    },
    [],
  );

  const getPlanValues = useCallback((plan: NutritionGoal) => {
    if (plan == "lose_weight") return losePlanValues.current;
    else if (plan == "maintain_weight") return balancedPlan;
    else return gainPlanValues.current;
  }, []);

  return { onLosePlanValueChange, onGainPlanValueChange, getPlanValues };
};
