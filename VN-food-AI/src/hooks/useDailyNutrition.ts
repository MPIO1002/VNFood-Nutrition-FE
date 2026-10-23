import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getDailyMeals } from '@/services/nutrition';
import type { DailyMealsResponse, MealLogEntry } from '@/types/nutrition';

// ─── Types ────────────────────────────────────────────────────
export interface MacroData {
  consumed: number;
  target: number | null;
}

export interface DailyNutritionData {
  /** Raw API response, null before first fetch */
  raw: DailyMealsResponse | null;

  /** Kcal mục tiêu trong ngày (fallback 2100 nếu chưa calculate) */
  targetKcal: number;
  /** Kcal đã nạp trong ngày */
  consumedKcal: number;
  /** Kcal còn lại trong ngày */
  remainingKcal: number;

  /** Macro data cho progress bars */
  protein: MacroData;
  carbs: MacroData;
  fat: MacroData;

  /** Danh sách bữa ăn trong ngày */
  meals: MealLogEntry[];
  /** Có bữa ăn nào chưa */
  hasMeals: boolean;
}

const DEFAULT_TARGET_KCAL = 2100;

/**
 * Hook quản lý toàn bộ logic lấy & tính toán dữ liệu dinh dưỡng hàng ngày.
 *
 * - Auto-fetch mỗi khi screen được focus.
 * - Derive các giá trị hiển thị (kcal, macros) từ API response.
 * - UI chỉ cần đọc và render.
 */
export function useDailyNutrition(): DailyNutritionData {
  const [dailyData, setDailyData] = useState<DailyMealsResponse | null>(null);

  // Fetch daily meals on focus (mỗi khi user quay lại trang chủ)
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function fetchDaily() {
        try {
          const data = await getDailyMeals();
          if (!cancelled) setDailyData(data);
        } catch (error) {
          console.warn('Lỗi lấy dữ liệu bữa ăn hàng ngày:', error);
        }
      }

      fetchDaily();

      return () => {
        cancelled = true;
      };
    }, []),
  );

  // ─── Derive display values ──────────────────────────────────
  const targetKcal = dailyData?.target_kcal_per_day ?? DEFAULT_TARGET_KCAL;
  const consumedKcal = dailyData?.total_calories ?? 0;
  const remainingKcal = dailyData?.remaining_kcal ?? targetKcal;

  const protein: MacroData = {
    consumed: dailyData?.total_protein_g ?? 0,
    target: dailyData?.target_protein_g ?? null,
  };
  const carbs: MacroData = {
    consumed: dailyData?.total_carb_g ?? 0,
    target: dailyData?.target_carb_g ?? null,
  };
  const fat: MacroData = {
    consumed: dailyData?.total_fat_g ?? 0,
    target: dailyData?.target_fat_g ?? null,
  };

  const meals = dailyData?.meals ?? [];

  return {
    raw: dailyData,
    targetKcal,
    consumedKcal,
    remainingKcal,
    protein,
    carbs,
    fat,
    meals,
    hasMeals: meals.length > 0,
  };
}
