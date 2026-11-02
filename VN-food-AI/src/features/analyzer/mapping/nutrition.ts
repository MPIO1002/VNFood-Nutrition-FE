/**
 * Pure functions for nutrition calculation (no React imports).
 * Used by mapper and potentially by UI for manual edits.
 */
import type { FoodComponent, FoodNutrition } from "./analyzeMapper";

/** Calculate total nutrition from a FoodNutrition object */
export function calculateTotals(nutrition: FoodNutrition | null) {
  if (!nutrition) return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  return {
    kcal: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat,
  };
}

/** Scale a FoodComponent to a new weight, preserving ratios */
export function scaleComponent(
  comp: FoodComponent,
  newWeight: number,
): FoodComponent {
  if (comp.originalWeight <= 0) return comp;
  const ratio = newWeight / comp.originalWeight;
  return {
    ...comp,
    weight: newWeight,
    calories: Math.round(comp.calories * ratio),
    protein: Math.round(comp.protein * ratio),
    fat: Math.round(comp.fat * ratio),
    carbs: Math.round(comp.carbs * ratio),
    originalCalories: Math.round(comp.originalCalories * ratio),
    originalProtein: Math.round(comp.originalProtein * ratio),
    originalFat: Math.round(comp.originalFat * ratio),
    originalCarbs: Math.round(comp.originalCarbs * ratio),
  };
}

/** Replace a component at a given index in nutrition */
export function replaceComponent(
  nutrition: FoodNutrition | null,
  index: number,
  newComp: FoodComponent,
): FoodNutrition | null {
  if (!nutrition || !nutrition.components) return null;
  const newComponents = [...nutrition.components];
  newComponents[index] = newComp;
  return {
    ...nutrition,
    components: newComponents,
    calories: newComponents.reduce(
      (sum, c) => sum + c.calories,
      0,
    ),
    protein: newComponents.reduce((sum, c) => sum + c.protein, 0),
    fat: newComponents.reduce((sum, c) => sum + c.fat, 0),
    carbs: newComponents.reduce((sum, c) => sum + c.carbs, 0),
  };
}

/** Remove a component at the given index */
export function removeComponentAt(
  nutrition: FoodNutrition | null,
  index: number,
): FoodNutrition | null {
  if (!nutrition || !nutrition.components) return null;
  const newComponents = nutrition.components.filter(
    (_: FoodComponent, i: number) => i !== index,
  );
  if (newComponents.length === 0) return null;
  return {
    ...nutrition,
    components: newComponents,
    calories: newComponents.reduce((sum, c) => sum + c.calories, 0),
    protein: newComponents.reduce((sum, c) => sum + c.protein, 0),
    fat: newComponents.reduce((sum, c) => sum + c.fat, 0),
    carbs: newComponents.reduce((sum, c) => sum + c.carbs, 0),
  };
}

/** Add an empty component slot */
export function addEmptyComponent(nutrition: FoodNutrition): FoodNutrition {
  return {
    ...nutrition,
    components: [...nutrition.components, {
      name: "",
      weight: 0,
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      originalWeight: 0,
      originalCalories: 0,
      originalProtein: 0,
      originalFat: 0,
      originalCarbs: 0,
    }],
  };
}