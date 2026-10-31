import { Circle, CircleCheck } from "lucide-react-native";
import { ReactNode, useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface ActivityLevelBoxProps {
  activated?: boolean;
  className?: string;
  children?: ReactNode;
  onPress?: () => void;
}

export function ActivityLevelBox({
  activated = false,
  className,
  children,
  onPress,
}: ActivityLevelBoxProps) {
  const leftBorderWidth = useSharedValue(activated ? 8 : 0);
  const leftBorderStyle = useAnimatedStyle(() => ({
    borderLeftWidth: leftBorderWidth.value,
  }));

  useEffect(() => {
    if (activated) {
      leftBorderWidth.value = withTiming(8, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      leftBorderWidth.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [activated]);

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        className={`${className ?? ""} w-full flex-row relative rounded-2xl bg-white gap-1 p-4 ${
          activated ? "border-charcoal-pure" : "border-zinc-200 opacity-70"
        }`}
        style={leftBorderStyle}>
        <View className="flex-1">{children}</View>
        <View className="h-full">
          {activated ? (
            <CircleCheck size={24} fill={"black"} color={"white"} />
          ) : (
            <Circle size={24} fill={"#e4e4e7"} strokeWidth={0} />
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}
