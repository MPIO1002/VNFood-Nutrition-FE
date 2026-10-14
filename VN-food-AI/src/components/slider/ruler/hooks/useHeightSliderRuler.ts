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

export const useHeightSliderRuler = ({
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
  const TICK_WIDTH = PixelRatio.roundToNearestPixel(tickWidth);
  const TICK_GAP = PixelRatio.roundToNearestPixel(tickGap);
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
  const rulerWidth = 80;
  const [containerHeight, setContainerHeight] = useState(0);
  const viewportPadding = containerHeight / 2;

  const formatTickValue = useCallback(
    (index: number) => {
      const v = Math.round((min + index * step) * 100) / 100;
      return Number.isInteger(v) ? String(v) : v.toFixed(2);
    },
    [min, step],
  );

  const clampY = useCallback(
    (y: number) => {
      "worklet";
      return Math.min(0, Math.max(-MAX_OFFSET, y));
    },
    [MAX_OFFSET],
  );

  const translateY = useSharedValue(
    -Math.min(
      tickCount - 1,
      Math.max(0, Math.round((initialValue - min) / step)),
    ) * SNAP,
  );

  const startY = useSharedValue(0);
  const index = useDerivedValue(() => Math.round(-translateY.value / SNAP));
  const value = useDerivedValue(
    () =>
      Math.round((min + index.value * step) * valuePrecision) / valuePrecision,
  );

  const pan = useMemo(() => {
    const p = Gesture.Pan()
      .onStart(() => {
        cancelAnimation(translateY);
        startY.value = translateY.value;
      })
      .onUpdate((e) => {
        translateY.value = clampY(startY.value + e.translationY);
      })
      .onEnd((e) => {
        translateY.value = withDecay(
          { velocity: e.velocityY, clamp: [-MAX_OFFSET, 0] },
          (finished) => {
            "worklet";
            if (finished) {
              const snapped = Math.max(
                -MAX_OFFSET,
                Math.min(0, -Math.round(-translateY.value / SNAP) * SNAP),
              );
              translateY.value = withTiming(snapped, { duration: 150 });
            }
          },
        );
      });

    if (externalScrollRef) p.blocksExternalGesture(externalScrollRef);
    return p;
  }, [MAX_OFFSET, SNAP, clampY, startY, translateY]);

  useAnimatedReaction(
    () => value.value,
    (current, previous) => {
      if (previous !== null && current !== previous && onChange) {
        scheduleOnRN(onChange, current);
      }
    },
  );

  const rulerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const textProps = useAnimatedProps(() => {
    const v = value.value;
    return {
      text: Number.isInteger(v) ? String(v) : v.toFixed(2),
      defaultValue: Number.isInteger(v) ? String(v) : v.toFixed(2),
    };
  });

  const centerTop = {
    top: Math.max(0, (containerHeight - TICK_WIDTH) / 2),
  };
  const rulerTop = {
    top: Math.max(0, centerTop.top - viewportPadding),
  };

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setContainerHeight(nativeEvent.layout.height);
  }, []);

  const scrollToIndex = useCallback(
    (target: number) => {
      const safeIndex = Math.min(
        tickCount - 1,
        Math.max(0, Math.round(target)),
      );
      cancelAnimation(translateY);
      translateY.value = withTiming(-safeIndex * SNAP, { duration: 200 });
    },
    [tickCount, SNAP, translateY],
  );

  const scrollToValue = useCallback(
    (targetValue: number) => scrollToIndex((targetValue - min) / step),
    [min, step, scrollToIndex],
  );

  const stepBy = useCallback(
    (count: number) => {
      const currentIndex = Math.round(-translateY.value / SNAP);
      scrollToIndex(currentIndex + count);
    },
    [SNAP, translateY, scrollToIndex],
  );

  if (controlRef) {
    controlRef.current = {
      stepBy,
    };
  }

  return {
    props: {
      textProps,
      pan,
      tickCount,
      viewportPadding,
      TICKS,
      MAJOR_TICKS,
      SNAP,
      majorTickInterval,
    },
    style: {
      centerTop,
      rulerTop,
      rulerWidth,
      rulerStyle,
      TICK_WIDTH,
    },
    formatTickValue,
    handleLayout,
    stepBy,
    scrollToValue,
  };
};
