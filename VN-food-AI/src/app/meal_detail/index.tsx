import { MealResponse } from "@/api/generated/model";
import LoadingScreen from "@/components/LoadingScreen";
import { useDailyMealsQuery } from "@/features/meal";
import { MealCarousel } from "@/features/meal/detail/components/MealCarousel";
import { dateUtils } from "@/lib/utils";
import { YearMonthDay } from "@/types/date";
import { router, useLocalSearchParams } from "expo-router";
import { XIcon } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ColorValue, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CalorieBox({
  className,
  label,
  value,
  color,
}: {
  className?: string;
  label: string;
  value: number;
  color?: ColorValue;
}) {
  return (
    <View
      className={`${className ?? ""} px-3 py-4 gap-2`}
      style={{ flex: 1, minWidth: 0 }}>
      <View className="flex-row items-center relative">
        <Text className="font-montserrat-semibold text-sm">{label}</Text>
        <View
          className="rounded-full w-2 h-2 absolute right-0 top-[6.3px]"
          style={{
            backgroundColor: color,
          }}
        />
      </View>
      <View className="flex-row gap-1 items-end">
        <Text className="font-montserrat-semibold text-xl">{value}</Text>
        <Text
          className="font-montserrat-semibold"
          style={{
            color: color,
          }}>
          g
        </Text>
      </View>
    </View>
  );
}

export type MealDetailScreenProps = {
  date: YearMonthDay;
};

export default function MealDetailScreen() {
  const [isReady, setIsReady] = useState(false);
  const { date } = useLocalSearchParams<MealDetailScreenProps>();
  const { data, isLoading } = useDailyMealsQuery(date);
  const meals = useMemo(
    () => [...(data?.meals ?? [])].reverse(),
    [data?.meals],
  );
  const initialIndex = meals.length ? meals.length - 1 : 0;
  const [currentMeal, setCurrentMeal] = useState<MealResponse | undefined>(
    meals[initialIndex],
  );
  const [y, m, d] = dateUtils.getFromDateFormat(date).map(Number);
  const { top } = useSafeAreaInsets();

  return (
    <View className="w-full h-full bg-surface">
      {!isLoading && (
        <>
          <View
            className="w-full items-center justify-end relative"
            style={{
              marginTop: top + 20,
            }}>
            <Text className="font-montserrat-bold">{`Năm ${y}`}</Text>
            <Text className="font-montserrat-semibold">{`Ngày ${d} ${dateUtils.getMonthLabel(m)}`}</Text>
            <Pressable
              className="absolute left-5 top-3"
              onPress={() => {
                if (router.canGoBack()) router.back();
              }}>
              <XIcon size={25} />
            </Pressable>
          </View>
          <View className="w-full flex-1 justify-center items-center gap-10">
            <View className="w-full">
              <MealCarousel
                meals={meals}
                initialIndex={initialIndex}
                onIndexChange={(index) => {
                  setCurrentMeal(meals[index]);
                }}
                onReady={() => setIsReady(true)}
                gap={1}
              />
            </View>
            <View className={`w-full px-3 ${!isReady && "hidden"}`}>
              <View className="w-full bg-white rounded-2xl p-4 shadow shadow-slate-800 gap-1">
                <Text className="font-montserrat-semibold text-gray-500 text-sm">
                  MÓN ĂN GHI NHẬN
                </Text>
                <Text className="font-montserrat-bold text-2xl">
                  {currentMeal?.dish_name}
                </Text>
                <View className="w-full flex-row gap-5 mt-3">
                  <CalorieBox
                    className="rounded-xl bg-blue-100"
                    color="#3b82f6"
                    label="Protein"
                    value={currentMeal?.protein_g ?? 0}
                  />
                  <CalorieBox
                    className="rounded-xl bg-orange-50"
                    color="#F97316"
                    label="Carbs"
                    value={currentMeal?.carb_g ?? 0}
                  />
                  <CalorieBox
                    className="rounded-xl bg-red-100"
                    color="red"
                    label="Chất béo"
                    value={currentMeal?.fat_g ?? 0}
                  />
                </View>
              </View>
            </View>
          </View>
        </>
      )}
      <LoadingScreen show={isLoading} />
    </View>
  );
}
