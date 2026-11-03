import { View } from "react-native";
import MealTypeSelect, { MealType } from "./MealTypeSelect";
import { NutritionComponentList } from "./NutritionComponentList";
import { NutritionSummary } from "./NutritionSummary";
import { SaveMealButton } from "./SaveMealButton";

export interface NutritionResultsProps {
  nutrition: import("@/features/analyzer/mapping/analyzeMapper").FoodNutrition;
  totals: { kcal: number; protein: number; carbs: number; fat: number };
  onUpdateName: (idx: number, newName: string) => void;
  onUpdateWeight: (idx: number, newWeight: number) => void;
  onAdjustWeight: (idx: number, delta: number) => void;
  onRemoveComponent: (idx: number) => void;
  onAddComponent: () => void;
  onMealTypeChange?: (type: MealType) => void;
  onSave: () => void;
  saveState?: "idle" | "saving" | "saved";
  disabled?: boolean;
}

export function NutritionResults({
  nutrition,
  totals,
  onUpdateName,
  onUpdateWeight,
  onAdjustWeight,
  onRemoveComponent,
  onAddComponent,
  onMealTypeChange,
  onSave,
  saveState = "idle",
  disabled = false,
}: NutritionResultsProps) {
  return (
    <View className="px-4 mt-2">
      <NutritionSummary totals={totals} />
      <MealTypeSelect disabled={disabled} onMealTypeChange={onMealTypeChange} />
      <NutritionComponentList
        nutrition={nutrition}
        onUpdateName={onUpdateName}
        onUpdateWeight={onUpdateWeight}
        onAdjustWeight={onAdjustWeight}
        onRemove={onRemoveComponent}
        onAdd={onAddComponent}
      />
      <SaveMealButton disabled={disabled} state={saveState} onPress={onSave} />
    </View>
  );
}
