import { ScrollView } from "react-native-gesture-handler";
import { SharedValue } from "react-native-reanimated";

export interface SliderRulerController {
  stepBy: (count: number) => void;
}

export interface SliderRulerProps {
  initialValue: number;
  min: number;
  max: number;
  minorPerMediumSegment?: number;
  mediumPerMajorSegment?: number;
  screenValue?: SharedValue<number>;
  unitLabel?: string;
  step?: number;
  tickGap?: number;
  tickWidth?: number;
  onChange?: (value: number) => void;
  controlRef?: React.RefObject<SliderRulerController | null>;
  externalScrollRef?: React.RefObject<ScrollView | null>;
}
