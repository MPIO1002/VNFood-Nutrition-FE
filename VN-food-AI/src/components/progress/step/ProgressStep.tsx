import { memo, useEffect } from "react";
import { ColorValue, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

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
  const fill = useSharedValue(isCurrent ? 1 : 0);
  useEffect(() => {
    if (isCurrent) {
      if (fill.value == 1) return;
      fill.value = withDelay(
        100,
        withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        }),
      );
    } else if (done) {
      fill.value = 1;
    } else {
      fill.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [isCurrent, done]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fill.value * 100}%`,
    backgroundColor: currentColor,
  }));

  return (
    <View
      className={`flex-1 h-1 rounded-full`}
      style={{
        backgroundColor: color,
      }}>
      <Animated.View
        className={"h-full rounded-full"}
        style={fillStyle}></Animated.View>
    </View>
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
