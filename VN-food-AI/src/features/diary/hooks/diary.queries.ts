import {
  monthlyDiaryApiV1DiaryMonthlyGet,
  useMonthlyDiaryApiV1DiaryMonthlyGet,
} from "@/api/generated";
import { MonthlyDiaryApiV1DiaryMonthlyGetParams } from "@/api/generated/model";
import { dateUtils } from "@/lib/utils";
import { YearMonthDay } from "@/types/date";
import { useInfiniteQuery } from "@tanstack/react-query";

export const diaryQueryKeys = {
  all: ["diary"] as const,
  months: () => [...diaryQueryKeys.all, "months"] as const,
  month: (month: string) => [...diaryQueryKeys.months(), month] as const,
  monthRange: (range: MonthlyDiaryApiV1DiaryMonthlyGetParams) =>
    [...diaryQueryKeys.months(), range] as const,
  monthRangeInfinite: (params: { startMonth: string; limit: number }) =>
    [...diaryQueryKeys.months(), "infinite", params] as const,
};

export const useDiaryByMonthQuery = (
  data: MonthlyDiaryApiV1DiaryMonthlyGetParams,
) => {
  return useMonthlyDiaryApiV1DiaryMonthlyGet(data, {
    query: {
      queryKey: diaryQueryKeys.monthRange(data),
      retry: 1,
    },
  });
};

const getNextMonthRange = (
  startMonth: YearMonthDay,
  limit: number,
  userRegisterDate?: Date,
): MonthlyDiaryApiV1DiaryMonthlyGetParams | null => {
  if (!userRegisterDate) return null;

  const [y, m, _] = dateUtils.getFromDateFormat(startMonth).map(Number);
  // minus one for convert real month to 0-based index + one for step back one month
  const endDate = new Date(y, m - 2, 1);
  const startDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() - limit,
    1,
  );
  const capDate = new Date(userRegisterDate);
  capDate.setDate(1);

  if (startDate < capDate && endDate < capDate) return null;
  return {
    start_date: dateUtils.toYMDFormat(startDate),
    end_date: dateUtils.toYMDFormat(endDate),
  };
};

export const useDiaryByMonthInfiniteQuery = ({
  startMonth,
  limit,
  userRegisterDate,
  enabled,
}: {
  startMonth: Date;
  limit: number;
  userRegisterDate?: Date;
  enabled?: boolean;
}) => {
  const startDate = new Date(
    startMonth.getFullYear(),
    startMonth.getMonth() - limit,
    1,
  );
  const endDate = new Date(
    startMonth.getFullYear(),
    startMonth.getMonth() + 1,
    0,
  );

  const initial: MonthlyDiaryApiV1DiaryMonthlyGetParams = {
    start_date: dateUtils.toYMDFormat(startDate),
    end_date: dateUtils.toYMDFormat(endDate),
  };

  return useInfiniteQuery({
    queryKey: diaryQueryKeys.monthRangeInfinite({
      startMonth: initial.start_date,
      limit,
    }),
    queryFn: ({ pageParam, signal }) =>
      monthlyDiaryApiV1DiaryMonthlyGet(pageParam, undefined, signal),
    initialPageParam: initial,
    getNextPageParam: (_lastPage, _allPage, lastPageParam) =>
      getNextMonthRange(
        lastPageParam.start_date as YearMonthDay,
        limit,
        userRegisterDate,
      ),
    enabled: enabled,
  });
};
