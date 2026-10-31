import { MetabolismRequest, MetabolismResponse } from "@/api/generated/model";
import { APIMutatorOptions } from "@/api/types/api";
import { useCallback, useRef } from "react";
import { HealthSteps } from "../../constant/register";
import { useHealthRegister } from "../../hooks/useHealthRegister";
import { MetabolismFieldData } from "../../types/metabolism";

export interface UseUserHealthInformationContextOptions {
  totalSteps: number;
  onLoadingProgressChange?: (progress: number) => void;
  onAllReady?: () => void;
}

const metabolismDefaultValues: MetabolismRequest = {
  sex_for_equation: "male",
  age: 18,
  height_cm: 101,
  weight_kg: 26,
  activity_level: "sedentary",
  goal: "lose_weight",
  weight_change_kg: 100,
  goal_pace: "gradual",
  pregnant_or_breastfeeding: false,
  competitive_athlete: false,
  metabolism_affecting_condition: false,
};

export const useUserHealthInformation = ({
  totalSteps,
  onLoadingProgressChange,
  onAllReady,
}: UseUserHealthInformationContextOptions) => {
  const { handleHealthRegister } = useHealthRegister();
  const readySteps = useRef<Set<string>>(new Set<string>());
  const metabolismData = useRef<MetabolismRequest>(metabolismDefaultValues);

  const markReady = useCallback(
    (name: HealthSteps) => {
      readySteps.current.add(name);

      const progress = readySteps.current.size / totalSteps;
      onLoadingProgressChange?.(progress);
      if (readySteps.current.size === totalSteps) onAllReady?.();
    },
    [totalSteps],
  );

  const assignMetabolismFieldData = useCallback(
    (fieldData: MetabolismFieldData) => {
      if (!fieldData || !fieldData.field) return;
      metabolismData.current = {
        ...metabolismData.current,
        [fieldData.field]: fieldData.value,
      };
    },
    [],
  );

  const assginMultipleMetabolismFieldData = useCallback(
    (obj: Partial<MetabolismRequest>) => {
      metabolismData.current = {
        ...metabolismData.current,
        ...obj,
      };
    },
    [],
  );

  const submitMetabolismData = useCallback(
    ({
      options,
    }: {
      options?: APIMutatorOptions<MetabolismResponse, MetabolismRequest>;
    } = {}) => {
      handleHealthRegister({
        data: metabolismData.current,
        options: options,
      });
    },
    [handleHealthRegister],
  );

  return {
    markReady,
    metabolismData,
    assignMetabolismFieldData,
    assginMultipleMetabolismFieldData,
    submitMetabolismData,
  };
};
