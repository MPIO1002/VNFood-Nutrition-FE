import { Portal } from "@rn-primitives/portal";
import { Image } from "expo-image";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  EasingFunction,
  EasingFunctionFactory,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function LoadingScreen({
  show = false,
  onReady,
}: {
  show?: boolean;
  onReady?: () => void;
}) {
  const circleOpacity = useSharedValue(0.5);
  const circleScale = useSharedValue(1);

  useEffect(() => {
    const easing: EasingFunction | EasingFunctionFactory = Easing.linear;

    circleOpacity.value = withRepeat(
      withSequence(
        withTiming(0, {
          duration: 1000,
          easing,
        }),
        withDelay(100, withTiming(0)),
      ),
      -1,
      false,
    );
    circleScale.value = withRepeat(
      withSequence(
        withTiming(2, {
          duration: 1000,
          easing,
        }),
        withDelay(100, withTiming(1)),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(circleOpacity);
      cancelAnimation(circleScale);
    };
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  return (
    show && (
      <Portal name="loading-screen">
        <View className="w-full h-full justify-center items-center bg-white relative">
          <View className="absolute inset-0 justify-center items-center z-10">
            <View className="w-24 h-24">
              <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
              />
            </View>
          </View>
          <Animated.View
            className="rounded-3xl w-24 h-24 bg-black"
            style={circleStyle}
          />
        </View>
      </Portal>
    )
  );
}
