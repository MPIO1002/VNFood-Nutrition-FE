import React from "react";
import { View } from "react-native";
import { NutritionSummary } from "./NutritionSummary";
import { NutritionComponentList } from "./NutritionComponentList";
import { SaveMealButton } from "./SaveMealButton";

export interface NutritionResultsProps {
  nutrition: import("@/features/analyzer/mapping/analyzeMapper").FoodNutrition;
  totals: { kcal: number; protein: number; carbs: number; fat: number };
  onUpdateName: (idx: number, newName: string) => void;
  onUpdateWeight: (idx: number, newWeight: number) => void;
  onAdjustWeight: (idx: number, delta: number) => void;
  onRemoveComponent: (idx: number) => void;
  onAddComponent: () => void;
  onSave: () => void;
  saveState?: "idle" | "saving" | "saved";
}

export function NutritionResults({
  nutrition,
  totals,
  onUpdateName,
  onUpdateWeight,
  onAdjustWeight,
  onRemoveComponent,
  onAddComponent,
  onSave,
  saveState = "idle",
}: NutritionResultsProps) {
  return (
    <View className="px-4 mt-2">
      <NutritionSummary totals={totals} />
      <NutritionComponentList
        nutrition={nutrition}
        onUpdateName={onUpdateName}
        onUpdateWeight={onUpdateWeight}
        onAdjustWeight={onAdjustWeight}
        onRemove={onRemoveComponent}
        onAdd={onAddComponent}
      />
      <SaveMealButton state={saveState} onPress={onSave} />
    </View>
  );
}