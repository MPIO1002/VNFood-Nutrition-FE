import { PressScale } from "@/components/PressScale";
import {
  FoodComponent,
  Macros,
} from "@/features/analyzer/mapping/analyzeMapper";
import IngredientItemBox from "@/features/ingredients/components/IngredientItemBox";
import { Plus } from "lucide-react-native";
import { Text, View } from "react-native";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";

export interface NutritionComponentListProps {
  nutrition: import("@/features/analyzer/mapping/analyzeMapper").FoodNutrition;
  onUpdateName: (idx: number, newName: string) => void;
  onUpdateWeight: (idx: number, newWeight: number) => void;
  onAdjustWeight: (idx: number, delta: number) => void;
  onUpdateMacros?: (id: number, name: Macros, value: number) => void;
  onRemove: (idx: number) => void;
  onAdd: () => void;
  disabled?: boolean;
  disabledAddComponent?: boolean;
}

export function NutritionComponentList({
  nutrition,
  onUpdateName,
  onUpdateWeight,
  onAdjustWeight,
  onUpdateMacros,
  onRemove,
  onAdd,
  disabled = false,
  disabledAddComponent = false,
}: NutritionComponentListProps) {
  return (
    <View className="px-4 mt-2">
      {/* Components Breakdown */}
      {nutrition.components && (
        <View className="mb-6">
          <View className="mb-4">
            <View className="flex-row items-baseline justify-between">
              <Text className="font-montserrat-bold text-lg text-charcoal-pure">
                Thành phần chi tiết
              </Text>
              <Text className="font-montserrat-semibold text-sm text-charcoal-pure">
                {nutrition.components.length}{" "}
                <Text className="font-montserrat-medium text-xs text-zinc-500">
                  món nhận diện
                </Text>
              </Text>
            </View>
            <Text className="font-montserrat-medium text-xs text-zinc-500 mt-1">
              Chạm +/- để cân đối khẩu phần thực tế
            </Text>
          </View>

          <View className="gap-3">
            {nutrition.components.map((comp: FoodComponent, idx: number) => (
              <Animated.View
                key={comp.name}
                layout={LinearTransition.easing(
                  Easing.out(Easing.ease),
                ).duration(250)}>
                <IngredientItemBox
                  id={idx}
                  data={comp}
                  disabled={disabled}
                  disabledMacrosInput={!comp.isCustom}
                  onUpdateWeight={onUpdateWeight}
                  onUpdateMacros={onUpdateMacros}
                  onRemovePressed={onRemove}
                />
              </Animated.View>
            ))}
          </View>
        </View>
      )}

      {/* Bottom Actions */}
      <Animated.View
        layout={LinearTransition.easing(Easing.out(Easing.ease)).duration(250)}
        className="gap-3">
        <PressScale
          disabled={disabled || disabledAddComponent}
          onPress={onAdd}
          style={{ marginBottom: 4 }}>
          <View
            className={`h-14 flex-row items-center justify-center gap-2 px-4 rounded-2xl bg-zinc-50 border border-zinc-200 ${(disabled || disabledAddComponent) && "opacity-60"}`}>
            <Plus size={20} color="#18181B" />
            <Text className="font-montserrat-semibold text-sm text-charcoal-pure">
              Thêm thành phần
            </Text>
          </View>
        </PressScale>
      </Animated.View>
    </View>
  );
}
