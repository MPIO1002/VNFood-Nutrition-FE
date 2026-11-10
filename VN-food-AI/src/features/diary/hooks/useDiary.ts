import { MonthlyDiaryItem } from "@/api/generated/model";
import { useProfileQuery } from "@/features/profile";
import { ViewToken } from "@legendapp/list/react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDiaryByMonthInfiniteQuery } from "./diary.queries";

type MonthItem = {
  key: string;
  data?: MonthlyDiaryItem;
};

export const useDiary = () => {
  const LIMIT = 3;

  const { data: me } = useProfileQuery();
  const userRegisterDate = useMemo(
    () => (me?.created_at ? new Date(me.created_at) : undefined),
    [me?.created_at],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
    isFetchingNextPage,
  } = useDiaryByMonthInfiniteQuery({
    startMonth: new Date(),
    limit: LIMIT,
    userRegisterDate: userRegisterDate,
    wait: !!userRegisterDate,
  });

  const getMonthKey = useCallback((startMonth: string) => {
    const [y, m, d] = startMonth.split("-").map(Number);

    const date = new Date(y, m - 1, d);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const months = useMemo<MonthItem[]>(() => {
    if (data && userRegisterDate) {
      const rev = [...data.pages].reverse().flatMap((p) => p.data);
      const res: MonthItem[] = [];

      for (let i of rev) {
        const [_y, m, _d] = i.month_start.split("-");
        if (userRegisterDate.getMonth() + 1 > Number(m)) {
          continue;
        }

        res.push({
          key: getMonthKey(i.month_start),
          data: i,
        });
      }
      return res;
    }
    return [];
  }, [data]);

  const [activeMonths, setActiveMonths] = useState<Set<string>>(
    new Set(months.slice(1).map((m) => m.key)),
  );

  const readyRef = useRef(false);
  const monthsLengthRef = useRef(months.length);

  useEffect(() => {
    monthsLengthRef.current = months.length;
  }, [months]);

  const onLoadOlderMonths = useCallback(
    async ({
      onError,
    }: {
      onError?: (e: Error | null) => void;
    } = {}) => {
      if (!hasNextPage) return;
      if (!readyRef.current || isFetching) return;

      try {
        await fetchNextPage();
      } catch {
        onError?.(error);
      }
    },
    [hasNextPage, fetchNextPage, isFetching],
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 30 }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<MonthItem>[] }) => {
      setActiveMonths((prev) => {
        const next = new Set(prev);
        let changed = false;
        for (const v of viewableItems) {
          if (v.isViewable && !next.has(v.item.key)) {
            next.add(v.item.key);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    },
  ).current;

  return {
    LIMIT,
    isFetchingNextPage,
    months,
    activeMonths,
    readyRef,
    viewabilityConfig,
    onViewableItemsChanged,
    onLoadOlderMonths,
  };
};
