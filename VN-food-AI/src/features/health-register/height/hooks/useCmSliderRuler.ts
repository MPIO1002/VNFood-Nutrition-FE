import { SliderRulerController } from "@/components/slider/ruler/ruler";
import { VerticalSliderRulerProps } from "@/components/slider/ruler/VerticalSliderRuler";
import { useRef } from "react";
import { useAnimatedProps, useSharedValue } from "react-native-reanimated";

export interface UseCmSliderRulerOptions {
  onReady?: () => void;
  onValueChange?: (v: number) => void;
}

export const useCmSliderRuler = ({
  onReady,
  onValueChange,
}: UseCmSliderRulerOptions = {}) => {
  const INITIAL_VALUE = 160;
  const cmRulerController = useRef<SliderRulerController | null>(null);
  const cmScreenValue = useSharedValue<number>(INITIAL_VALUE);

  const cmProps: VerticalSliderRulerProps = {
    min: 50,
    max: 250,
    initialValue: INITIAL_VALUE,
    minorPerMediumSegment: 0,
    mediumPerMajorSegment: 4,
    step: 1,
    unitLabel: "cm",
    screenValue: cmScreenValue,
    onFinishLoading: onReady,
    onChange: onValueChange,
    controlRef: cmRulerController,
  };

  const cmTextProps = useAnimatedProps(() => {
    const v = cmScreenValue.value;
    return {
      text: String(v),
      defaultValue: String(v),
    };
  });

  return {
    cmProps,
    cmTextProps,
    cmRulerController,
  };
};
