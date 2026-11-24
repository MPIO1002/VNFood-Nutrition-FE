import {
  useMonthlyProgressApiV1ProgressMonthlyGet,
  useWeeklyProgressApiV1ProgressWeeklyGet,
} from "@/api/generated";
import type {
  MonthlyProgressApiV1ProgressMonthlyGetParams,
  WeeklyProgressApiV1ProgressWeeklyGetParams,
} from "@/api/generated/model";
import { QUERY_OPTIONS } from "@/constants/queries";

export const analyticsQueryKeys = {
  all: ["analytics"] as const,
  weeklyProgress: (params: WeeklyProgressApiV1ProgressWeeklyGetParams) =>
    [...analyticsQueryKeys.all, "weekly-progress", params] as const,
  monthlyProgress: (params: MonthlyProgressApiV1ProgressMonthlyGetParams) =>
    [...analyticsQueryKeys.all, "monthly-progress", params] as const,
};

export const useWeeklyProgressQuery = (
  params: WeeklyProgressApiV1ProgressWeeklyGetParams,
  enabled: boolean,
) =>
  useWeeklyProgressApiV1ProgressWeeklyGet(params, {
    query: {
      queryKey: analyticsQueryKeys.weeklyProgress(params),
      enabled,
      retry: 1,
      staleTime: QUERY_OPTIONS.DEFAULT_STALE_TIME,
    },
  });

export const useMonthlyProgressQuery = (
  params: MonthlyProgressApiV1ProgressMonthlyGetParams,
  enabled: boolean,
) =>
  useMonthlyProgressApiV1ProgressMonthlyGet(params, {
    query: {
      queryKey: analyticsQueryKeys.monthlyProgress(params),
      enabled,
      retry: 1,
      staleTime: QUERY_OPTIONS.DEFAULT_STALE_TIME,
    },
  });
