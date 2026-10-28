import { GoalPace, MetabolismRequest } from "@/api/generated/model";

export type MetabolismFieldData = {
  [K in keyof MetabolismRequest]: {
    field: K;
    value: MetabolismRequest[K];
  };
}[keyof MetabolismRequest];

export interface WeightChangePlan {
  goal_pace: GoalPace | null;
  weight_change_kg: number;
}

export type WeightChangePlanData = {
  [K in keyof WeightChangePlan]: {
    field: K;
    value: WeightChangePlan[K];
  };
}[keyof WeightChangePlan];
