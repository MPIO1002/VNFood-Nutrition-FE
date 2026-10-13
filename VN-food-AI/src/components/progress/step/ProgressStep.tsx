import { memo } from "react";
import { ColorValue, View } from "react-native";

export interface ProgressStepProps {
  currentStep: number;
  totalSteps: number;
  color?: ColorValue;
  finishedColor?: ColorValue;
}

const StepBar = memo(function StepBar({
  done,
  color,
  finishedColor,
}: {
  done: boolean;
  color?: ColorValue;
  finishedColor?: ColorValue;
}) {
  return (
    <View
      className={`flex-1 h-1 rounded-full`}
      style={{
        backgroundColor: done ? finishedColor : color,
      }}
    />
  );
});

export default function ProgressStep({
  currentStep,
  totalSteps,
  color,
  finishedColor,
}: ProgressStepProps) {
  return (
    <View className="w-full h-1 flex-row gap-1.5 mb-5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <StepBar
          key={i}
          done={i < currentStep}
          color={color}
          finishedColor={finishedColor}
        />
      ))}
    </View>
  );
}
