import React from "react";
import { View, Text } from "react-native";

export interface NutritionSummaryProps {
  totals: { kcal: number; protein: number; carbs: number; fat: number };
}

export function NutritionSummary({ totals }: NutritionSummaryProps) {
  return (
    <View className="bg-white rounded-3xl p-5 flex-row items-center justify-between gap-4 shadow-sm border border-zinc-100 mb-6">
      {/* Total energy */}
      <View className="flex-1 min-w-0">
        <Text className="font-montserrat-semibold text-[10px] text-zinc-500 uppercase tracking-widest">TỔNG NĂNG LƯỢNG</Text>
        <View className="flex-row items-baseline mt-1">
          <Text className="font-montserrat-bold text-[32px] text-charcoal-pure leading-10 tracking-tight">{totals.kcal}</Text>
          <Text className="font-montserrat-semibold text-xs text-zinc-500 ml-1"> kcal</Text>
        </View>
      </View>

      {/* Macro trio */}
      <View className="flex-row gap-2">
        <View className="items-center px-3 py-2.5 rounded-2xl min-w-[64px] bg-charcoal-pure shadow-sm">
          <Text className="font-montserrat-bold text-xs text-white/80">Pro</Text>
          <Text className="font-montserrat-semibold text-sm text-white mt-0.5">{totals.protein}g</Text>
        </View>
        <View className="items-center px-3 py-2.5 rounded-2xl min-w-[64px] bg-zinc-50 border border-zinc-100">
          <Text className="font-montserrat-bold text-xs text-zinc-500">Carb</Text>
          <Text className="font-montserrat-semibold text-sm text-charcoal-pure mt-0.5">{totals.carbs}g</Text>
        </View>
        <View className="items-center px-3 py-2.5 rounded-2xl min-w-[64px] bg-zinc-50 border border-zinc-100">
          <Text className="font-montserrat-bold text-xs text-zinc-500">Fat</Text>
          <Text className="font-montserrat-semibold text-sm text-charcoal-pure mt-0.5">{totals.fat}g</Text>
        </View>
      </View>
    </View>
  );
}