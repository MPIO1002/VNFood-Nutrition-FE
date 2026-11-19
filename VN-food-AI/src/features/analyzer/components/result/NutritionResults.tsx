import { Macros } from "@/features/analyzer/mapping/analyzeMapper";
import { MAX_INGREDIENT_FOR_MEAL } from "@/features/ingredients/constant/ingredient";
import { MealType } from "@/features/meal/type/meal";
import { View } from "react-native";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import MealTypeSelect from "./MealTypeSelect";
import { NutritionComponentList } from "./NutritionComponentList";
import { NutritionSummary } from "./NutritionSummary";
import { SaveMealButton } from "./SaveMealButton";

export interface NutritionResultsProps {
  nutrition: import("@/features/analyzer/mapping/analyzeMapper").FoodNutrition;
  totals: { kcal: number; protein: number; carbs: number; fat: number };
  onUpdateName: (idx: number, newName: string) => void;
  onUpdateWeight: (idx: number, newWeight: number) => void;
  onAdjustWeight: (idx: number, delta: number) => void;
  onUpdateMacros?: (id: number, name: Macros, value: number) => void;
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
  onUpdateMacros,
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
        onUpdateMacros={onUpdateMacros}
        disabledAddComponent={
          nutrition.components.length > MAX_INGREDIENT_FOR_MEAL
        }
        onRemove={onRemoveComponent}
        onAdd={onAddComponent}
      />
      <Animated.View
        layout={LinearTransition.easing(Easing.out(Easing.ease)).duration(250)}
        className="gap-3">
        <SaveMealButton
          disabled={disabled}
          state={saveState}
          onPress={onSave}
        />
      </Animated.View>
    </View>
  );
}
