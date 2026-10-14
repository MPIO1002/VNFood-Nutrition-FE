import { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, PixelRatio } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  cancelAnimation,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { SliderRulerProps } from "../ruler";

const decimalPlaces = (value: number) => {
  const text = String(value);
  return text.includes(".") ? text.length - text.indexOf(".") - 1 : 0;
};

export const useWeightSliderRuler = ({
  initialValue,
  step = 1,
  min,
  max,
  tickWidth = 2,
  tickGap = 20,
  onChange,
  controlRef,
  externalScrollRef,
}: SliderRulerProps) => {
  const tickCount = Math.floor((max - min) / step) + 1;
  const TICK_WIDTH = PixelRatio.roundToNearestPixel(tickWidth); // must match w-[2px]
  const TICK_GAP = PixelRatio.roundToNearestPixel(tickGap); // must match gap-5 (5 * 4px)
  const SNAP = TICK_WIDTH + TICK_GAP;
  const MAX_OFFSET = (tickCount - 1) * SNAP;
  const valuePrecision = 10 ** Math.max(0, decimalPlaces(step));
  const majorTickInterval = Math.max(1, Math.round(1 / step));
  const TICKS = useMemo(
    () => Array.from({ length: tickCount }, (_, i) => i),
    [tickCount],
  );
  const MAJOR_TICKS = useMemo(
    () => TICKS.filter((index) => index % majorTickInterval === 0),
    [TICKS, majorTickInterval],
  );
  const rulerHeight = 80;
  const [containerWidth, setContainerWidth] = useState(0);
  const viewportPadding = containerWidth / 2;

  const formatTickValue = useCallback(
    (index: number) => {
      const v = Math.round((min + index * step) * 100) / 100;
      return Number.isInteger(v) ? String(v) : v.toFixed(2);
    },
    [min, step],
  );

  const clampX = useCallback(
    (x: number) => {
      "worklet";
      return Math.min(0, Math.max(-MAX_OFFSET, x));
    },
    [MAX_OFFSET],
  );

  const translateX = useSharedValue(
    -Math.min(
      tickCount - 1,
      Math.max(0, Math.round((initialValue - min) / step)),
    ) * SNAP,
  );

  const startX = useSharedValue(0);
  const index = useDerivedValue(() => Math.round(-translateX.value / SNAP));
  const value = useDerivedValue(
    () =>
      Math.round((min + index.value * step) * valuePrecision) / valuePrecision,
  );

  const pan = useMemo(() => {
    const p = Gesture.Pan()
      .onStart(() => {
        cancelAnimation(translateX);
        startX.value = translateX.value;
      })
      .onUpdate((e) => {
        translateX.value = clampX(startX.value + e.translationX);
      })
      .onEnd((e) => {
        translateX.value = withDecay(
          { velocity: e.velocityX, clamp: [-MAX_OFFSET, 0] },
          (finished) => {
            "worklet";
            if (finished) {
              const snapped = Math.max(
                -MAX_OFFSET,
                Math.min(0, -Math.round(-translateX.value / SNAP) * SNAP),
              );
              translateX.value = withTiming(snapped, { duration: 150 });
            }
          },
        );
      });

    if (externalScrollRef) p.blocksExternalGesture(externalScrollRef);
    return p;
  }, [MAX_OFFSET, SNAP, clampX, startX, translateX]);

  useAnimatedReaction(
    () => value.value,
    (current, previous) => {
      if (previous !== null && current !== previous && onChange) {
        scheduleOnRN(onChange, current);
      }
    },
  );

  const rulerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const textProps = useAnimatedProps(() => {
    const v = value.value;
    return {
      text: Number.isInteger(v) ? String(v) : v.toFixed(2),
      defaultValue: Number.isInteger(v) ? String(v) : v.toFixed(2),
    };
  });

  const centerLeft = {
    left: Math.max(0, (containerWidth - TICK_WIDTH) / 2),
  };
  const rulerLeft = {
    left: Math.max(0, centerLeft.left - viewportPadding),
  };

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setContainerWidth(nativeEvent.layout.width);
  }, []);

  const scrollToIndex = useCallback(
    (target: number) => {
      const safeIndex = Math.min(
        tickCount - 1,
        Math.max(0, Math.round(target)),
      );
      cancelAnimation(translateX);
      translateX.value = withTiming(-safeIndex * SNAP, { duration: 200 });
    },
    [tickCount, SNAP, translateX],
  );

  // REMINDER: for the future if need
  const scrollToValue = useCallback(
    (value: number) => scrollToIndex((value - min) / step),
    [min, step, scrollToIndex],
  );

  const stepBy = useCallback(
    (count: number) => {
      const currentIndex = Math.round(-translateX.value / SNAP);
      scrollToIndex(currentIndex + count);
    },
    [SNAP, translateX, scrollToIndex],
  );

  if (controlRef) {
    controlRef.current = {
      stepBy,
    };
  }

  const props = {
    textProps,
    pan,
    tickCount,
    viewportPadding,
    TICKS,
    MAJOR_TICKS,
    SNAP,
    majorTickInterval,
  };

  const style = {
    centerLeft,
    rulerLeft,
    rulerHeight,
    rulerStyle,
    TICK_WIDTH,
  };

  return {
    props,
    style,
    formatTickValue,
    handleLayout,
    stepBy,
  };
};
