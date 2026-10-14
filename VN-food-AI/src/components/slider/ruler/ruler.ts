export interface SliderRulerController {
  stepBy: (count: number) => void;
}

export interface SliderRulerProps {
  min: number;
  max: number;
  unitLabel?: string;
  step?: number;
  tickGap?: number;
  tickWidth?: number;
  initialValue: number;
  onChange?: any;
  controlRef?: React.RefObject<SliderRulerController | null>;
}
