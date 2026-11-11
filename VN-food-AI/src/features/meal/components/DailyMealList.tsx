import type { MealResponse } from "@/api/generated/model";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { DailyMealListSkeleton } from "./skeleton";

function formatQuantity(quantity: number) {
  return Number.isInteger(quantity) ? quantity.toString() : quantity.toFixed(1);
}

function formatMealType(mealType: string) {
  const labels: Record<string, string> = {
    breakfast: "Bữa sáng",
    lunch: "Bữa trưa",
    dinner: "Bữa tối",
    snack: "Bữa phụ",
  };

  return labels[mealType.toLowerCase()] ?? mealType;
}

function MealCard({ meal }: { meal: MealResponse }) {
  return (
    <View className="flex-row items-center gap-3 rounded-3xl border border-border-hairline bg-canvas-white p-4 shadow-sm">
      {meal.image_url ? (
        <Image
          source={{ uri: meal.image_url }}
          style={{ width: 64, height: 64, borderRadius: 16 }}
          contentFit="cover"
        />
      ) : (
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
          <Text className="text-2xl">🍽️</Text>
        </View>
      )}
      <View className="min-w-0 flex-1">
        <View className="flex-row items-center justify-between gap-1">
          <Text
            className="flex-1 font-montserrat-bold text-[15px] text-charcoal-pure"
            numberOfLines={1}>
            {meal.dish_name || "Bữa ăn chưa định danh"}
          </Text>
          <Text className="font-montserrat-bold text-sm text-charcoal-pure">
            {Math.round(meal.total_calories).toLocaleString()} kcal
          </Text>
        </View>
        <Text
          className="mt-1 font-montserrat text-xs text-zinc-500"
          numberOfLines={1}>
          {formatMealType(meal.meal_type)} • {formatQuantity(meal.quantity)} phần
        </Text>
        <View className="mt-2 flex-row gap-1.5">
          <View className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5">
            <Text className="font-montserrat-bold text-[10px] text-slate-700">
              P: {Math.round(meal.protein_g ?? 0)}g
            </Text>
          </View>
          <View className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5">
            <Text className="font-montserrat-bold text-[10px] text-amber-800">
              C: {Math.round(meal.carb_g ?? 0)}g
            </Text>
          </View>
          <View className="rounded border border-rose-200 bg-rose-50 px-2 py-0.5">
            <Text className="font-montserrat-bold text-[10px] text-rose-800">
              F: {Math.round(meal.fat_g ?? 0)}g
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function DailyMealList({
  meals,
  isLoading,
  isError,
}: {
  meals: MealResponse[];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) return <DailyMealListSkeleton />;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-0.5">
        <View className="flex-row items-center gap-2">
          <Text className="font-montserrat-bold text-base text-charcoal-pure">
            Bữa ăn hôm nay
          </Text>
          <View className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5">
            <Text className="font-montserrat-bold text-[11px] text-charcoal-pure">
              {meals.length} bữa
            </Text>
          </View>
        </View>
      </View>
      {isError ? (
        <Text className="font-montserrat text-sm text-rose-600">
          Không thể tải nhật ký bữa ăn hôm nay.
        </Text>
      ) : meals.length === 0 ? (
        <Text className="font-montserrat text-sm text-zinc-500">
          Chưa có bữa ăn nào được ghi nhận hôm nay.
        </Text>
      ) : (
        meals.map((meal) => <MealCard key={meal.id} meal={meal} />)
      )}
    </View>
  );
}
