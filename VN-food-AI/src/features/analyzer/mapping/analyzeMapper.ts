import type { AnalyzeResponse } from "@/features/analyzer/validation/analyzeSchema";

export interface FoodComponent {
  name: string;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  originalWeight: number;
  originalCalories: number;
  originalProtein: number;
  originalFat: number;
  originalCarbs: number;
}

export interface FoodNutrition {
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  components: FoodComponent[];
}

export interface DetectedItem {
  label: string;
  confidence: number;
  maskPolygons: number[][][];
}

export interface AnalyzeResult {
  nutrition: FoodNutrition | null;
  detected: DetectedItem[];
  visualBase64: string | null;
  imageSize: { width: number; height: number } | null;
  warnings: string[];
  imageQuality: { isBlurry: boolean; issues: string[] } | null;
}

/**
 * Map AnalyzeResponse (already validated by Zod) → AnalyzeResult (domain model).
 * - Fix mask_polygons vs polygons bug.
 * - imageSize from response.image.
 * - Math.round only here, not riddled in screen/component.
 */
export function mapAnalyzeResponse(res: AnalyzeResponse): AnalyzeResult {
  const items = res.items || [];

  // Detect first item's food as nutrition (fallback: if no totals, sum from components)
  let nutrition: FoodNutrition | null = null;
  let detected: DetectedItem[] = [];
  let visualBase64: string | null = res.visual_base64
    ? `data:image/jpeg;base64,${res.visual_base64}`
    : null;
  let imageSize: { width: number; height: number } | null = res.image
    ? { width: res.image.width, height: res.image.height }
    : null;
  const warnings: string[] = res.warnings || [];
  const imageQuality: { isBlurry: boolean; issues: string[] } | null = res.image_quality
    ? {
        isBlurry: res.image_quality.is_blurry ?? false,
        issues: res.image_quality.issues ?? [],
      }
    : null;

  if (items.length > 0) {
    const firstItem = items[0];
    const food = firstItem.food;
    const estimatedComponents = food?.estimated_components || [];

    // Build detected items with maskPolygons (fix: API returns mask_polygons, we map to maskPolygons)
    detected = (firstItem.mask_polygons || []).map(
      (polygon, idx) => ({
        label: firstItem.label || `Món ${idx + 1}`,
        confidence: firstItem.detection_confidence || 0,
        maskPolygons: [polygon],
      }),
    );

    const components = estimatedComponents.map((c) => ({
      name: c.name,
      weight: Math.round(c.estimated_g || 0),
      calories: Math.round(c.calories_kcal || 0),
      protein: Math.round(c.protein_g || 0),
      fat: Math.round(c.fat_g || 0),
      carbs: Math.round(c.carb_g || 0),
      originalWeight: c.estimated_g || 0,
      originalCalories: c.calories_kcal || 0,
      originalProtein: c.protein_g || 0,
      originalFat: c.fat_g || 0,
      originalCarbs: c.carb_g || 0,
    }));

    // Prefer backend totals while retaining estimated components for editing.
    if (food?.estimated_totals) {
      const totals = food.estimated_totals;
      nutrition = {
        name: food.name || "Món ăn",
        confidence: firstItem.detection_confidence || 0,
        calories: Math.round(totals.calories_kcal || 0),
        protein: Math.round(totals.protein_g || 0),
        fat: Math.round(totals.fat_g || 0),
        carbs: Math.round(totals.carb_g || 0),
        components,
      };
    } else if (estimatedComponents.length > 0) {
      // Sum components to compute totals
      const totalCal = components.reduce((sum, c) => sum + (c.calories || 0), 0);
      const totalProtein = components.reduce((sum, c) => sum + (c.protein || 0), 0);
      const totalFat = components.reduce((sum, c) => sum + (c.fat || 0), 0);
      const totalCarb = components.reduce((sum, c) => sum + (c.carbs || 0), 0);

      nutrition = {
        name: food?.name || "Món ăn",
        confidence: firstItem.detection_confidence || 0,
        calories: totalCal,
        protein: totalProtein,
        fat: totalFat,
        carbs: totalCarb,
        components,
      };
    }
  }

  return { nutrition, detected, visualBase64, imageSize, warnings, imageQuality };
}