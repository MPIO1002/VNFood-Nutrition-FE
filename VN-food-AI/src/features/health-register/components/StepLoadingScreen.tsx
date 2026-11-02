import { Image } from "expo-image";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface StepLoadingScreenProps {
  progress: number;
}

export default function StepLoadingScreen({
  progress,
}: StepLoadingScreenProps) {
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
  }, [progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fill.value * 100}%`,
    backgroundColor: "black",
  }));

  return (
    <View className="w-full h-full justify-center items-center bg-white gap-4 p-4">
      <View className="w-20 h-20 mb-4 relative shadow-lg">
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: "100%", height: "100%" }}
          contentFit="contain"
        />
      </View>
      <View className="w-full">
        <Text className="font-montserrat text-center">
          Đang chuẩn bị hồ sơ cho bạn, chờ chút nhé
        </Text>
      </View>
      <View
        className={`w-full h-3 rounded-full`}
        style={{
          backgroundColor: "#E4E4E7",
        }}>
        <Animated.View
          className={"w-full h-full rounded-full"}
          style={fillStyle}
        />
      </View>
    </View>
  );
}
