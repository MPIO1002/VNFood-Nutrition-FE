import { SliderRulerController } from "@/components/slider/ruler/ruler";
import { VerticalSliderRulerProps } from "@/components/slider/ruler/VerticalSliderRuler";
import { useRef } from "react";
import { useAnimatedProps, useSharedValue } from "react-native-reanimated";

export interface UseFtSliderRulerOptions {
  onReady?: () => void;
  onValueChange?: (v: number) => void;
}

export const useFtSliderRuler = ({
  onReady,
  onValueChange,
}: UseFtSliderRulerOptions = {}) => {
  const INITIAL_VALUE = 160;
  const ftRulerController = useRef<SliderRulerController | null>(null);
  const ftScreenValue = useSharedValue<number>(INITIAL_VALUE);

  const ftProps: VerticalSliderRulerProps = {
    min: 50,
    max: 250,
    initialValue: INITIAL_VALUE,
    minorPerMediumSegment: 0,
    mediumPerMajorSegment: 4,
    step: 1,
    unitLabel: "in",
    onFinishLoading: onReady,
    onChange: onValueChange,
    screenValue: ftScreenValue,
    controlRef: ftRulerController,
  };

  const ftTextProps = useAnimatedProps(() => {
    const v = ftScreenValue.value;
    return {
      text: String(v),
      defaultValue: String(v),
    };
  });

  return {
    ftProps,
    ftRulerController,
    ftTextProps,
  };
};
