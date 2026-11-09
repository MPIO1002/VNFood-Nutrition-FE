import { useCallback, useEffect, useRef, useState } from "react";

export const useDiary = () => {
  const INITIAL = 3;
  const BATCH = 3;
  const MAX_MONTHS = 12;

  const monthKey = useCallback((offset: number) => {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const shiftMonth = useCallback((key: string, back: number) => {
    const [y, m] = key.split("-").map(Number);
    const d = new Date(y, m - 1 - back, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [months, setMonths] = useState<string[]>(() =>
    Array.from({ length: INITIAL }, (_, i) => monthKey(INITIAL - 1 - i)),
  );
  const [activeMonths, setActiveMonths] = useState<Set<string>>(
    () => new Set([monthKey(0)]),
  );

  const readyRef = useRef(false);
  const loadingRef = useRef(false);
  const monthsLengthRef = useRef(months.length);

  useEffect(() => {
    monthsLengthRef.current = months.length;
  }, [months]);

  const onLoadOlderMonths = useCallback(
    (setIsLoading?: (isLoading: boolean) => void) => {
      if (!readyRef.current || loadingRef.current) return;
      if (monthsLengthRef.current >= MAX_MONTHS) return;

      loadingRef.current = true;
      setIsLoading?.(true);

      setMonths((prev) => {
        if (prev.length >= MAX_MONTHS) return prev;
        const older = Array.from({ length: BATCH }, (_, i) =>
          shiftMonth(prev[0], BATCH - i),
        );
        return [...older, ...prev];
      });

      setTimeout(() => {
        loadingRef.current = false;
        setIsLoading?.(false);
      }, 400);
    },
    [],
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 30 }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      setActiveMonths((prev) => {
        const next = new Set(prev);
        let changed = false;
        for (const v of viewableItems) {
          if (v.isViewable && !next.has(v.item)) {
            next.add(v.item);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    },
  ).current;

  return {
    INITIAL,
    BATCH,
    MAX_MONTHS,
    months,
    activeMonths,
    readyRef,
    loadingRef,
    viewabilityConfig,
    onViewableItemsChanged,
    onLoadOlderMonths,
  };
};
