export const HEALTH_STEPS = [
  "gender",
  "age",
  "weight",
  "height",
  "plan",
] as const;

export type HealthSteps = (typeof HEALTH_STEPS)[number];
