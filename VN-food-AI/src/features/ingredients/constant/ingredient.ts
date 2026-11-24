export const MAX_INGREDIENT_FOR_MEAL = 25;

export const WEIGHT_OPTIONS = {
  min: 1,
  max: 1000,
  step: 10,
  getWeight: (text: string) => {
    const v = Number(text);
    if (!text || v < WEIGHT_OPTIONS.min) return WEIGHT_OPTIONS.min;
    else if (v > WEIGHT_OPTIONS.max) return WEIGHT_OPTIONS.max;

    return v;
  },
} as const;

export const MACROS_OPTIONS = {
  min: 0,
  max: (name: string) => (name === "calories" ? 1000 : 100),
  step: 10,
  getMacrosValue: (text: string, name: string) => {
    const v = Number(text);
    if (v < MACROS_OPTIONS.min || !text) return MACROS_OPTIONS.min;
    else if (v > MACROS_OPTIONS.max(name)) return MACROS_OPTIONS.max(name);

    return v;
  },
} as const;
