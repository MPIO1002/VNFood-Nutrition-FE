import { useCallback, useMemo } from "react";
import {
  cancelAnimation,
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { SliderRulerController } from "../ruler";

const decimalPlaces = (value: number) => {
  const text = String(value);
  return text.includes(".") ? text.length - text.indexOf(".") - 1 : 0;
};

export interface UseSliderRulerOptions {
  initialValue: number;
  min: number;
  max: number;
  snap: number;
  screenValue?: SharedValue<number>;
  step?: number;
  onChange?: (value: number) => void;
  controlRef?: React.RefObject<SliderRulerController | null>;
}

export const useSliderRuler = ({
  initialValue,
  step = 1,
  min,
  max,
  snap,
  screenValue,
  onChange,
  controlRef,
}: UseSliderRulerOptions) => {
  const tickCount = Math.floor((max - min) / step) + 1;
  const maxOffset = (tickCount - 1) * snap;
  const valuePrecision = 10 ** Math.max(0, decimalPlaces(step));
  const ticks = useMemo(
    () => Array.from({ length: tickCount }, (_, i) => i),
    [tickCount],
  );

  const formatTickValue = useCallback(
    (index: number) => {
      const v =
        Math.round((min + index * step) * valuePrecision) / valuePrecision;
      return Number.isInteger(v) ? String(v) : v.toFixed(2);
    },
    [min, step],
  );

  const clampPos = useCallback(
    (pos: number) => {
      "worklet";
      return Math.min(0, Math.max(-maxOffset, pos));
    },
    [maxOffset],
  );

  const translatePos = useSharedValue(
    -Math.min(
      tickCount - 1,
      Math.max(0, Math.round((initialValue - min) / step)),
    ) * snap,
  );

  const calculateValue = (pos: number) => {
    "worklet";
    const index = Math.round(-pos / snap);
    return Math.round((min + index * step) * valuePrecision) / valuePrecision;
  };

  const startPos = useSharedValue(0);
  useAnimatedReaction(
    () => calculateValue(translatePos.value),
    (current) => {
      if (screenValue) screenValue.value = current;
    },
  );

  const scrollToIndex = useCallback(
    (target: number) => {
      const safeIndex = Math.min(
        tickCount - 1,
        Math.max(0, Math.round(target)),
      );
      cancelAnimation(translatePos);
      const pos = withTiming(-safeIndex * snap, { duration: 200 });
      translatePos.value = pos;

      if (onChange) {
        const v = calculateValue(pos);
        scheduleOnRN(onChange, v);
      }
    },
    [tickCount, snap, translatePos],
  );

  // REMINDER: for the future if need
  const scrollToValue = useCallback(
    (value: number) => scrollToIndex((value - min) / step),
    [min, step, scrollToIndex],
  );

  const stepBy = useCallback(
    (count: number) => {
      const currentIndex = Math.round(-translatePos.value / snap);
      scrollToIndex(currentIndex + count);
    },
    [snap, translatePos, scrollToIndex],
  );

  if (controlRef) {
    controlRef.current = {
      stepBy,
    };
  }

  const props = {
    tickCount,
    ticks,
    maxOffset,
    snap,
  };

  return {
    translatePos,
    startPos,
    props,
    formatTickValue,
    stepBy,
    calculateValue,
    clampPos,
  };
};
