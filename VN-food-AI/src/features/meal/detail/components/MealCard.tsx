import { MealResponse } from "@/api/generated/model";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { dateUtils } from "@/lib/utils";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ClockIcon } from "lucide-react-native";
import { cssInterop, StyleSheet } from "nativewind";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { MEAL_TYPE_OPTIONS } from "../../constants/meal";
import { MealType } from "../../type/meal";

cssInterop(Image, { className: "style" });

export interface MealCardProps {
  index: number;
  activeIndex: SharedValue<number>;
  width: number;
  slot: number;
  meal?: MealResponse;
  isOnScreen?: boolean;
}

export default function MealCard({
  index,
  activeIndex,
  meal,
  width,
  slot,
  isOnScreen,
}: MealCardProps) {
  const mealType = (meal?.meal_type as MealType) ?? "breakfast";
  const mealTypeStyle = MEAL_TYPE_OPTIONS[mealType];
  const timeConsumed = meal ? new Date(meal?.consumed_at) : null;

  const style = useAnimatedStyle(() => {
    const isActive = activeIndex.value === index;
    const config = { duration: 300, easing: Easing.out(Easing.cubic) };

    return {
      transform: [{ scale: withTiming(isActive ? 1 : 0.9, config) }],
      opacity: withTiming(isActive ? 1 : 0.85, config),
    };
  });

  const blurStyle = useAnimatedStyle(() => ({
    opacity: withTiming(activeIndex.value === index ? 0 : 1, { duration: 300 }),
  }));

  return (
    <View style={{ width: slot }} className="items-center">
      <Animated.View
        style={[{ width, height: width }, style]}
        className="overflow-hidden rounded-[32px] bg-neutral-200">
        {meal && meal.image_url ? (
          <>
            <Image
              source={{ uri: meal.image_url }}
              className="h-full w-full"
              contentFit="cover"
              transition={150}
            />
            <Animated.View
              style={[StyleSheet.absoluteFill, blurStyle]}
              pointerEvents="none">
              <Image
                source={{ uri: meal.image_url }}
                className="h-full w-full"
                contentFit="cover"
                blurRadius={50}
              />
            </Animated.View>
          </>
        ) : isOnScreen ? (
          <Skeleton className="w-full h-full bg-gray-400" />
        ) : (
          <View className="w-full h-full bg-gray-400" />
        )}

        <LinearGradient
          colors={["rgba(0,0,0,0.35)", "transparent", "rgba(0,0,0,0.55)"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />
        <View className="absolute top-3.5 right-3.5 flex-row items-end">
          <View className="self-end">
            <Badge className="bg-zinc-900 gap-2">
              <Icon as={ClockIcon} size={10} color={"white"} />
              <Text className="font-montserrat-medium text-sm text-white">
                {timeConsumed && dateUtils.formatTime(timeConsumed)}
              </Text>
            </Badge>
          </View>
        </View>
        <View className="absolute bottom-3.5 left-3.5 right-3.5 flex-row items-end">
          <View className="flex-1 pr-2">
            <View className="self-start">
              <Badge className="bg-zinc-900 gap-2">
                <Icon
                  as={mealTypeStyle.icon}
                  size={10}
                  fill={mealTypeStyle.color}
                  color={mealTypeStyle.color}
                />
                <Text
                  className="font-montserrat-medium text-sm"
                  style={{
                    color: mealTypeStyle.color,
                  }}>
                  {mealTypeStyle.label}
                </Text>
              </Badge>
            </View>
            {!!meal?.dish_name && (
              <Text
                numberOfLines={1}
                className="mt-1.5 font-montserrat text-white">
                {meal.dish_name}
              </Text>
            )}
          </View>

          <View className="items-center rounded-2xl bg-white px-3 py-1.5">
            <Text className="text-xl font-montserrat-bold text-neutral-900">
              {meal?.total_calories}
            </Text>
            <Text className="text-[10px] font-montserrat-bold text-neutral-400">
              KCAL
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
