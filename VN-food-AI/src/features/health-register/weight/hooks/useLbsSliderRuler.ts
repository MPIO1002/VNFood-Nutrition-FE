import { HorizontalSliderRulerProps } from "@/components/slider/ruler/HorizontalSliderRuler";
import { SliderRulerController } from "@/components/slider/ruler/ruler";
import { useRef } from "react";
import { useAnimatedProps, useSharedValue } from "react-native-reanimated";

export interface UseLbsSliderRulerOptions {
  onReady?: () => void;
  onValueChange?: (v: number) => void;
}

export const useLbsSliderRuler = ({
  onReady,
  onValueChange,
}: UseLbsSliderRulerOptions = {}) => {
  const lbsRulerController = useRef<SliderRulerController | null>(null);
  const lbsScreenValue = useSharedValue<number>(0);

  const lbsProps: HorizontalSliderRulerProps = {
    min: 10,
    max: 300,
    initialValue: 50,
    step: 0.5,
    minorPerMediumSegment: 1,
    mediumPerMajorSegment: 4,
    unitLabel: "lbs",
    screenValue: lbsScreenValue,
    onFinishLoading: onReady,
    onChange: onValueChange,
    controlRef: lbsRulerController,
  };

  const lbsTextProps = useAnimatedProps(() => {
    const v = lbsScreenValue.value;
    return {
      text: v.toFixed(1),
      defaultValue: v.toFixed(1),
    };
  });

  return {
    lbsProps,
    lbsTextProps,
    lbsRulerController,
  };
};
