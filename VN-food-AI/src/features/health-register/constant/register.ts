export const HEALTH_STEPS = [
  "gender",
  "age",
  "weight",
  "height",
  "activity",
  "plan",
] as const;

export type HealthSteps = (typeof HEALTH_STEPS)[number];
