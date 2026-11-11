import type { AnalyticsDateRange, AnalyticsPeriod } from "../utils/date-range";
import {
    useMonthlyProgressQuery,
    useWeeklyProgressQuery,
} from "./analytics.queries";

export interface AnalyticsMetrics {
  totalCalories: number;
  targetCalories: number | null;
  adherencePercent: number | null;
  mealCount: number;
  daysLogged: number;
  averageDailyCalories: number;
  totalProteinGrams: number;
  totalCarbGrams: number;
  totalFatGrams: number;
  daysInPeriod: number;
}

export function useAnalytics(period: AnalyticsPeriod, range: AnalyticsDateRange) {
  const params = { start_date: range.startDate, end_date: range.endDate };
  const weeklyProgress = useWeeklyProgressQuery(params, period === "week");
  const monthlyProgress = useMonthlyProgressQuery(params, period === "month");

  const stats =
    period === "week"
      ? weeklyProgress.data?.data[0]
      : monthlyProgress.data?.data[0];
  const targetCalories =
    period === "week"
      ? (weeklyProgress.data?.data[0]?.target_weekly_kcal ?? null)
      : (monthlyProgress.data?.data[0]?.target_monthly_kcal ?? null);
  const totalCalories = stats?.total_calories ?? 0;
  const apiAdherencePercent =
    period === "week"
      ? (weeklyProgress.data?.data[0]?.adherence_pct ?? null)
      : (monthlyProgress.data?.data[0]?.adherence_pct ?? null);
  const adherencePercent =
    apiAdherencePercent ??
    (targetCalories !== null && targetCalories > 0
      ? (totalCalories / targetCalories) * 100
      : null);

  const metrics: AnalyticsMetrics = {
    totalCalories,
    targetCalories,
    adherencePercent,
    mealCount: stats?.meal_count ?? 0,
    daysLogged: stats?.days_logged ?? 0,
    averageDailyCalories: stats?.avg_daily_calories ?? 0,
    totalProteinGrams: stats?.total_protein_g ?? 0,
    totalCarbGrams: stats?.total_carb_g ?? 0,
    totalFatGrams: stats?.total_fat_g ?? 0,
    daysInPeriod: range.dayCount,
  };

  const isLoading =
    period === "week"
      ? weeklyProgress.isLoading
      : monthlyProgress.isLoading;
  const isRefetching =
    period === "week"
      ? weeklyProgress.isRefetching
      : monthlyProgress.isRefetching;
  const isError =
    period === "week"
      ? weeklyProgress.isError
      : monthlyProgress.isError;

  const refetch = async () => {
    if (period === "week") {
      await weeklyProgress.refetch();
      return;
    }
    await monthlyProgress.refetch();
  };

  return { metrics, isLoading, isRefetching, isError, refetch };
}