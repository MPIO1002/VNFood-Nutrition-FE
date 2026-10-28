import { MetabolismRequest } from "@/api/generated/model";
import { useCallback, useEffect, useRef, useState } from "react";
import { MetabolismFieldData } from "../../types/metabolism";

export interface UseUserHealthInformationContextOptions {
  totalSteps: number;
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
  onAllReady,
}: UseUserHealthInformationContextOptions) => {
  const readySteps = useRef<Set<string>>(new Set<string>());
  const [metabolismData, setMetabolismData] = useState<MetabolismRequest>(
    metabolismDefaultValues,
  );

  useEffect(() => {
    console.log(metabolismData);
  }, [metabolismData]);

  const markReady = useCallback(
    (name: string) => {
      readySteps.current.add(name);
      if (readySteps.current.size === totalSteps) onAllReady?.();
    },
    [totalSteps],
  );

  const assignMetabolismFieldData = useCallback(
    (fieldData: MetabolismFieldData) => {
      if (!fieldData || !fieldData.field) return;
      setMetabolismData((prev) => ({
        ...prev,
        [fieldData.field]: fieldData.value,
      }));
    },
    [],
  );

  const assginMultipleMetabolismFieldData = useCallback(
    (obj: Partial<MetabolismRequest>) => {
      setMetabolismData((prev) => ({
        ...prev,
        ...obj,
      }));
    },
    [],
  );

  return {
    markReady,
    metabolismData,
    assignMetabolismFieldData,
    assginMultipleMetabolismFieldData,
  };
};
