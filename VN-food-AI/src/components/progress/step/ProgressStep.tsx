import { memo } from "react";
import { ColorValue, View } from "react-native";

export interface ProgressStepProps {
  currentStep: number;
  totalSteps: number;
  color?: ColorValue;
  currentColor?: ColorValue;
  finishedColor?: ColorValue;
}

const StepBar = memo(function StepBar({
  done,
  isCurrent,
  color,
  currentColor,
  finishedColor,
}: {
  done: boolean;
  isCurrent: boolean;
  color?: ColorValue;
  currentColor?: ColorValue;
  finishedColor?: ColorValue;
}) {
  let bgColor: ColorValue | undefined;
  if (isCurrent) {
    bgColor = currentColor;
  } else {
    bgColor = done ? finishedColor : color;
  }

  return (
    <View
      className={`flex-1 h-1 rounded-full`}
      style={{
        backgroundColor: bgColor,
      }}
    />
  );
});

export default function ProgressStep({
  currentStep,
  totalSteps,
  color,
  currentColor,
  finishedColor,
}: ProgressStepProps) {
  return (
    <View className="w-full h-1 flex-row gap-1.5 mb-5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <StepBar
          key={i}
          isCurrent={i === currentStep}
          done={i < currentStep}
          color={color}
          currentColor={currentColor}
          finishedColor={finishedColor}
        />
      ))}
    </View>
  );
}
