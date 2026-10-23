// ─── Nutrition Calculate API ──────────────────────────────────
export type SexForEquation = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type NutritionGoal = "lose_weight" | "maintain_weight" | "gain_weight";

export type GoalPace = "gradual" | "standard";

export interface NutritionCalculateRequest {
  sex_for_equation: SexForEquation;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  goal: NutritionGoal;
  weight_change_kg?: number | null;
  goal_pace?: GoalPace | null;
  pregnant_or_breastfeeding?: boolean;
  competitive_athlete?: boolean;
  metabolism_affecting_condition?: boolean;
}

export interface NutritionCalculateResponse {
  user_id: number;
  sex_for_equation: SexForEquation;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  goal: NutritionGoal;
  bmi: number;
  current_weight_kg: number;
  weight_change_kg: number;
  target_weight_kg: number;
  current_bmi: number;
  target_bmi: number;
  bmi_category_general: string;
  bmi_category_asian: string;
  estimated_rmr_kcal_per_day: number;
  activity_factor: number;
  estimated_tdee_kcal_per_day: number;
  goal_pace: GoalPace | null;
  requested_goal_adjustment_kcal: number;
  applied_goal_adjustment_kcal: number;
  daily_calorie_adjustment: number;
  minimum_target_kcal: number;
  target_was_safety_limited: boolean;
  target_kcal_per_day: number;
  target_protein_g: number;
  target_carb_g: number;
  target_fat_g: number;
  weekly_pace_kg: number;
  estimated_days: number;
  estimated_weeks: number;
  target_date: string;
  summary_message: string;
  formula_name: string;
  is_estimate: boolean;
  warnings: string[];
}

// ─── Daily Meals API ─────────────────────────────────────────

export interface MealLogEntry {
  id: number;
  user_id: number;
  dish_id: number | null;
  dish_name: string | null;
  meal_type: string;
  quantity: number;
  total_calories: number;
  protein_g: number | null;
  fat_g: number | null;
  carb_g: number | null;
  calorie_source: "dish_catalog" | "manual";
  catalog_calories_per_serving: number | null;
  image_url: string | null;
  consumed_at: string;
  created_at: string;
  updated_at: string;
}

export interface DailyMealsResponse {
  date: string;
  timezone: string;
  meal_count: number;
  total_calories: number;
  target_kcal_per_day: number | null;
  remaining_kcal: number | null;
  total_protein_g: number | null;
  total_fat_g: number | null;
  total_carb_g: number | null;
  target_protein_g: number | null;
  target_fat_g: number | null;
  target_carb_g: number | null;
  remaining_protein_g: number | null;
  remaining_fat_g: number | null;
  remaining_carb_g: number | null;
  calorie_source_counts: {
    dish_catalog: number;
    manual: number;
  };
  meals: MealLogEntry[];
}
