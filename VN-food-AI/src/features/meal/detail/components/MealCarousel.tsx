import { MealResponse } from "@/api/generated/model";
import { LegendList } from "@legendapp/list/react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
  View,
} from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import MealCard from "./MealCard";

function Dots({ count, active }: { count: number; active: number }) {
  const MAX = 5;
  const start = Math.max(
    0,
    Math.min(active - Math.floor(MAX / 2), count - MAX),
  );
  const visible = Array.from(
    { length: Math.min(MAX, count) },
    (_, k) => start + k,
  );

  return (
    <View className="mt-3.5 flex-row items-center justify-center gap-1.5">
      {visible.map((i) => (
        <View
          key={i}
          className={
            i === active
              ? "h-1.5 w-[18px] rounded-full bg-neutral-800"
              : "h-1.5 w-1.5 rounded-full bg-neutral-300"
          }
        />
      ))}
    </View>
  );
}

export interface MealCarouselProps {
  meals: MealResponse[];
  initialIndex?: number;
  gap?: number;
  onIndexChange?: (index: number) => void;
  onReady?: () => void;
}

export function MealCarousel({
  meals,
  initialIndex = 0,
  gap = 5,
  onIndexChange,
  onReady,
}: MealCarouselProps) {
  const { width } = useWindowDimensions();
  const length = meals.length;

  const cardW = width * 0.84;
  const snap = cardW + gap;
  const sidePad = (width - snap) / 2;

  const scrollX = useSharedValue(initialIndex * snap);
  const [active, setActive] = useState(initialIndex);
  const activeRef = useRef(initialIndex);

  const activeIndex = useDerivedValue(() =>
    Math.min(Math.max(Math.round(scrollX.value / snap), 0), length - 1),
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      scrollX.set(x);

      const i = Math.round(x / snap);
      if (i !== activeRef.current && i >= 0 && i < length) {
        activeRef.current = i;
        setActive(i);
        onIndexChange?.(i);
      }
    },
    [snap, length, onIndexChange, scrollX],
  );

  useEffect(() => {
    onIndexChange?.(initialIndex);
  }, [initialIndex]);

  return (
    <View>
      <LegendList
        data={meals}
        keyExtractor={(m) => `meal-${m.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={snap}
        snapToInterval={snap}
        decelerationRate="fast"
        disableIntervalMomentum
        initialScrollIndex={initialIndex}
        contentContainerStyle={{ paddingHorizontal: sidePad }}
        onScroll={onScroll}
        onLayout={onReady}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <MealCard
            meal={item}
            activeIndex={activeIndex}
            isOnScreen={
              index === activeRef.current - 1 ||
              index === activeRef.current + 1 ||
              index === activeRef.current
            }
            index={index}
            width={cardW}
            slot={snap}
          />
        )}
      />
      <Dots count={meals.length} active={active} />
    </View>
  );
}
