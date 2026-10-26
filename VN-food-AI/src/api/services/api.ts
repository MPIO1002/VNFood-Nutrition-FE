import { analyzeFoodApiV1FoodAnalyzePost } from "../generated";

export async function analyzeFoodImage(
  imageUri: string,
  options?: { containerType?: string },
) {
  try {
    const localResponse = await fetch(imageUri);
    if (!localResponse.ok) {
      throw new Error(`Không thể đọc ảnh (${localResponse.status})`);
    }

    const response = await analyzeFoodApiV1FoodAnalyzePost({
      image: await localResponse.blob(),
      ...(options?.containerType ? { container_type: options.containerType } : {}),
    });
    const data = response as {
      visual_base64?: string;
      items?: Array<{
        detection_confidence?: number;
        food?: {
          name?: string;
          estimated_totals?: Record<string, number>;
          estimated_components?: Array<Record<string, number | string>>;
        };
      }>;
    };
    const items = data.items || [];
    const firstItem = items[0];
    const totals = firstItem?.food?.estimated_totals || {};
    const rawComponents = firstItem?.food?.estimated_components || [];

    const nutrition = firstItem?.food
      ? {
          name: firstItem.food.name,
          confidence: firstItem.detection_confidence,
          calories: Math.round(totals.calories_kcal || 0),
          protein: Math.round(totals.protein_g || 0),
          fat: Math.round(totals.fat_g || 0),
          carbs: Math.round(totals.carb_g || 0),
          components: rawComponents.map((component) => ({
            name: component.name,
            weight: Math.round(Number(component.estimated_g) || 0),
            calories: Math.round(Number(component.calories_kcal) || 0),
            protein: Math.round(Number(component.protein_g) || 0),
            fat: Math.round(Number(component.fat_g) || 0),
            carbs: Math.round(Number(component.carb_g) || 0),
            originalWeight: component.estimated_g || 0,
            originalCalories: component.calories_kcal || 0,
            originalProtein: component.protein_g || 0,
            originalFat: component.fat_g || 0,
            originalCarbs: component.carb_g || 0,
          })),
        }
      : null;

    return {
      success: true,
      visualBase64: data.visual_base64
        ? `data:image/jpeg;base64,${data.visual_base64}`
        : null,
      nutrition,
      allDetected: items,
    };
  } catch (error) {
    console.error("Lỗi khi gọi API analyze:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể phân tích ảnh",
    };
  }
}
