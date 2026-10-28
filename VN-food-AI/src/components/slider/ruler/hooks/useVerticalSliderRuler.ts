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

export interface UseVerticalSliderRulerOptions extends Omit<
  UseSliderRulerOptions,
  "snap"
> {
  tickWidth?: number;
  tickGap?: number;
  externalScrollRef?: React.RefObject<ScrollView | null>;
}

export const useVerticalSliderRuler = ({
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
}: UseVerticalSliderRulerOptions) => {
  const TICK_HEIGHT = PixelRatio.roundToNearestPixel(tickWidth);
  const TICK_GAP = PixelRatio.roundToNearestPixel(tickGap);
  const SNAP = TICK_HEIGHT + TICK_GAP;

  const {
    props: rulerProps,
    translatePos: translateY,
    startPos: startY,
    clampPos: clampY,
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

  const [containerHeight, setContainerHeight] = useState(0);
  const viewportPadding = containerHeight / 2;

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
          { velocity: e.velocityY, clamp: [-rulerProps.maxOffset, 0] },
          (finished) => {
            "worklet";
            if (finished) {
              const snapped = Math.max(
                -rulerProps.maxOffset,
                Math.min(0, -Math.round(-translateY.value / SNAP) * SNAP),
              );
              translateY.value = withTiming(snapped, { duration: 150 });
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
  }, [rulerProps.maxOffset, SNAP, clampY, startY, translateY]);

  const rulerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const centerTop = {
    top: Math.max(0, (containerHeight - TICK_HEIGHT) / 2),
  };
  const rulerTop = {
    top: Math.max(0, centerTop.top - viewportPadding),
  };

  const UIProps = {
    ticks: rulerProps.ticks,
    pan,
    viewportPadding,
    SNAP,
    tickCount: rulerProps.tickCount,
  };

  const UIstyle = {
    centerTop,
    rulerTop,
    rulerStyle,
    TICK_HEIGHT,
    setContainerHeight,
  };

  return {
    UIProps,
    UIstyle,
    formatTickValue,
    stepBy,
  };
};
