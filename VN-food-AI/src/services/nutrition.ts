import { authenticatedFetch } from "./auth";
import type {
  NutritionCalculateRequest,
  NutritionCalculateResponse,
  DailyMealsResponse,
} from "@/types/nutrition";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Tính toán dinh dưỡng (BMI, RMR, TDEE, target kcal) và lưu vào user profile.
 * POST /api/v1/nutrition/calculate
 */
export async function calculateNutrition(
  payload: NutritionCalculateRequest,
): Promise<NutritionCalculateResponse> {
  const response = await authenticatedFetch(
    `${BASE_URL}/api/v1/nutrition/calculate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      typeof data?.detail === "string"
        ? data.detail
        : data?.detail?.message ||
          `Lỗi tính toán dinh dưỡng (${response.status})`;
    throw new Error(errorMsg);
  }

  return data as NutritionCalculateResponse;
}

/**
 * Lấy bữa ăn, tổng kcal và kcal còn lại trong ngày.
 * GET /api/v1/meals/daily?date=YYYY-MM-DD
 *
 * @param date - Ngày cần lấy (YYYY-MM-DD). Mặc định: ngày hiện tại.
 */
export async function getDailyMeals(
  date?: string,
): Promise<DailyMealsResponse> {
  const params = date ? `?date=${date}` : "";
  const response = await authenticatedFetch(
    `${BASE_URL}/api/v1/meals/daily${params}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      typeof data?.detail === "string"
        ? data.detail
        : `Lỗi lấy dữ liệu bữa ăn (${response.status})`;
    throw new Error(errorMsg);
  }

  return data as DailyMealsResponse;
}
