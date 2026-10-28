import { HorizontalSliderRulerProps } from "@/components/slider/ruler/HorizontalSliderRuler";
import { SliderRulerController } from "@/components/slider/ruler/ruler";
import { useRef } from "react";
import { useAnimatedProps, useSharedValue } from "react-native-reanimated";

export interface UseKgSliderRulerOptions {
  onReady?: () => void;
  onValueChange?: (v: number) => void;
}

export const useKgSliderRuler = ({
  onReady,
  onValueChange,
}: UseKgSliderRulerOptions = {}) => {
  const kgRulerController = useRef<SliderRulerController | null>(null);
  const kgScreenValue = useSharedValue<number>(0);

  const kgProps: HorizontalSliderRulerProps = {
    min: 10,
    max: 300,
    initialValue: 50,
    step: 0.5,
    minorPerMediumSegment: 1,
    mediumPerMajorSegment: 4,
    unitLabel: "kg",
    screenValue: kgScreenValue,
    onFinishLoading: onReady,
    onChange: onValueChange,
    controlRef: kgRulerController,
  };

  const kgTextProps = useAnimatedProps(() => {
    const v = kgScreenValue.value;
    return {
      text: v.toFixed(1),
      defaultValue: v.toFixed(1),
    };
  });

  return {
    kgProps,
    kgTextProps,
    kgRulerController,
  };
};
