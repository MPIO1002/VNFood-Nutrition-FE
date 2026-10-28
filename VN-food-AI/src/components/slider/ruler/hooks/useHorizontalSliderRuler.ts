import { useMemo, useState } from "react";
import { PixelRatio } from "react-native";
import { Gesture, ScrollView } from "react-native-gesture-handler";
import {
  cancelAnimation,
  useAnimatedStyle,
  withDecay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSliderRuler, UseSliderRulerOptions } from "./useSliderRuler";

export interface UseHorizontalSliderRulerOptions extends Omit<
  UseSliderRulerOptions,
  "snap"
> {
  tickWidth?: number;
  tickGap?: number;
  externalScrollRef?: React.RefObject<ScrollView | null>;
}

export const useHorizontalSliderRuler = ({
  initialValue,
  step = 1,
  min,
  max,
  screenValue,
  tickWidth = 2,
  tickGap = 20,
  onChange,
  controlRef,
  externalScrollRef,
}: UseHorizontalSliderRulerOptions) => {
  const TICK_GAP = PixelRatio.roundToNearestPixel(tickGap);
  const TICK_WIDTH = PixelRatio.roundToNearestPixel(tickWidth);
  const SNAP = TICK_WIDTH + TICK_GAP;

  const {
    props: rulerProps,
    translatePos: translateX,
    startPos: startX,
    clampPos: clampX,
    formatTickValue,
    stepBy,
    calculateValue,
  } = useSliderRuler({
    initialValue,
    max,
    min,
    snap: SNAP,
    controlRef,
    onChange,
    screenValue,
    step,
  });

  const [containerWidth, setContainerWidth] = useState(0);
  const viewportPadding = containerWidth / 2;

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
          { velocity: e.velocityX, clamp: [-rulerProps.maxOffset, 0] },
          (finished) => {
            "worklet";
            if (finished) {
              const snapped = Math.max(
                -rulerProps.maxOffset,
                Math.min(0, -Math.round(-translateX.value / SNAP) * SNAP),
              );
              translateX.value = withTiming(snapped, { duration: 150 });
              if (onChange) {
                const v = calculateValue(snapped);
                scheduleOnRN(onChange, v);
              }
            }
          },
        );
      });

    if (externalScrollRef) p.blocksExternalGesture(externalScrollRef);
    return p;
  }, [rulerProps.maxOffset, SNAP, clampX, startX, translateX]);

  const rulerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const centerLeft = {
    left: Math.max(0, (containerWidth - TICK_WIDTH) / 2),
  };
  const rulerLeft = {
    left: Math.max(0, centerLeft.left - viewportPadding),
  };

  const UIProps = {
    ticks: rulerProps.ticks,
    pan,
    viewportPadding,
    SNAP,
    tickCount: rulerProps.tickCount,
  };

  const UIstyle = {
    centerLeft,
    rulerLeft,
    rulerStyle,
    TICK_WIDTH,
    setContainerWidth,
  };

  return {
    UIProps,
    UIstyle,
    formatTickValue,
    stepBy,
  };
};
