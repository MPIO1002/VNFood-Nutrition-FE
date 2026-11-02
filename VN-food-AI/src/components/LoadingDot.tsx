import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export interface LoadingDotProps {
  y: number;
  duration: number;
  className?: string;
  delay?: number;
}

export default function LoadingDot({
  y,
  duration: totalDuration,
  delay,
  className,
}: LoadingDotProps) {
  const yPos = useSharedValue(0);
  const duration = totalDuration / 3;

  useEffect(() => {
    yPos.value = withDelay(
      delay ?? 0,
      withRepeat(
        withSequence(
          withTiming(y, {
            duration: duration,
            easing: Easing.out(Easing.quad),
          }),
          withTiming(0, { duration: duration, easing: Easing.in(Easing.quad) }),
          withTiming(0, { duration: duration }),
        ),
        -1,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: yPos.value }],
  }));

  return (
    <Animated.Text className={`${className ?? ""}`} style={style}>
      .
    </Animated.Text>
  );
}
