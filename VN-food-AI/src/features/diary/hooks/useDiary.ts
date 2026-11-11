import { MonthlyDiaryItem } from "@/api/generated/model";
import { useProfileQuery } from "@/features/profile";
import { dateUtils } from "@/lib/utils";
import { YearMonth, YearMonthDay } from "@/types/date";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDiaryByMonthInfiniteQuery } from "./diary.queries";

type MonthItem = {
  key: YearMonth;
  data?: MonthlyDiaryItem;
};

export const useDiary = () => {
  const LIMIT = 3;
  const now = new Date();

  const [isDataReady, setIsDataReady] = useState(false);
  const isAddSkeleton = useRef(false);
  const { data: me } = useProfileQuery();
  const userRegisterDate = useMemo(() => {
    const date = me?.created_at ? new Date(me.created_at) : undefined;
    if (date) {
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }, [me?.created_at]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
    isFetchingNextPage,
  } = useDiaryByMonthInfiniteQuery({
    startMonth: now,
    limit: LIMIT,
    userRegisterDate: userRegisterDate,
    enabled: !!userRegisterDate,
  });

  const buildMonths = (startMonth: Date) => {
    return new Map(
      Array.from(
        { length: LIMIT },
        (_, i): [YearMonth, MonthlyDiaryItem | undefined] => {
          const d = new Date(
            startMonth.getFullYear(),
            startMonth.getMonth() - i,
          );
          const key = dateUtils.toYMFormat(d);
          return [key, undefined];
        },
      ),
    );
  };

  const [months, setMonths] = useState<
    Map<YearMonth, MonthlyDiaryItem | undefined>
  >(buildMonths(now));
  const lastMonths = useRef<YearMonth>(dateUtils.toYMFormat(now));

  const updateMonthData = () => {
    if (data && userRegisterDate) {
      setMonths((prev) => {
        const monthlyData = [...data.pages].flatMap((p) => p.data);
        lastMonths.current = dateUtils.convertToYMFormat(
          data.pages.at(-1)?.data.at(0)?.month_start as YearMonthDay,
        );

        const mp = new Map(prev);
        for (let i of monthlyData) {
          const dateKey = dateUtils.convertToYMFormat(
            i.month_start as YearMonthDay,
          );

          const date = dateUtils.convertYMToDate(dateKey);
          if (userRegisterDate > date) {
            mp.delete(dateKey);
            continue;
          }

          mp.set(dateKey, i);
        }

        return new Map(mp);
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      updateMonthData();
      setIsDataReady(true);
    }, 500);
  }, [data]);

  const addSkeletons = () => {
    if (!isAddSkeleton.current) {
      const last = dateUtils.convertYMToDate(lastMonths.current);
      const next = new Date(last.getFullYear(), last.getMonth() - 1);

      setMonths((prev) => new Map([...prev, ...buildMonths(next)]));
      isAddSkeleton.current = true;
    }
  };

  const handleFetchNext = async ({
    onError,
  }: {
    onError?: (e: Error | null) => void;
  }) => {
    isAddSkeleton.current = false;
    addSkeletons();
    try {
      setIsDataReady(false);
      await fetchNextPage();
    } catch {
      onError?.(error);
    }
  };

  const monthlyData: MonthItem[] = useMemo(
    () =>
      [
        ...months.entries().map(
          (i): MonthItem => ({
            key: i[0],
            data: i[1],
          }),
        ),
      ].sort((a, b) => {
        const dateA = dateUtils.convertYMToDate(a.key);
        const dateB = dateUtils.convertYMToDate(b.key);

        return dateA.getTime() - dateB.getTime();
      }),
    [months],
  );

  const onLoadOlderMonths = useCallback(
    async ({
      onError,
    }: {
      onError?: (e: Error | null) => void;
    } = {}) => {
      if (!hasNextPage) return;
      if (isFetching || !isDataReady) return;

      handleFetchNext({ onError });
    },
    [hasNextPage, fetchNextPage, isFetching, isDataReady],
  );

  return {
    LIMIT,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    userRegisterDate,
    monthlyData,
    isDataReady,
    streakDays: data?.pages[0].streak_days ?? 0,
    locketCaloCount: data?.pages[0].total_meals_logged ?? 0,
    onLoadOlderMonths,
  };
};
