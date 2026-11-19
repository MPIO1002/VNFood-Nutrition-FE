import { PressScale } from "@/components/PressScale";
import { FoodComponent, Macros } from "@/features/analyzer";
import debounce from "lodash.debounce";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from "react-native-reanimated";
import MarcrosBox from "./MacrosBox";

export interface IngredientItemBoxProps {
  id: number;
  data: FoodComponent;
  disabled?: boolean;
  disabledMacrosInput?: boolean;
  onPress?: () => void;
  onUpdateWeight?: (id: number, value: number) => void;
  onUpdateMacros?: (id: number, name: Macros, value: number) => void;
  onRemovePressed?: (id: number) => void;
}

export default function IngredientItemBox({
  id,
  data,
  disabled,
  disabledMacrosInput,
  onPress,
  onUpdateWeight,
  onUpdateMacros,
  onRemovePressed,
}: IngredientItemBoxProps) {
  const WEIGHT_OPTIONS = {
    min: 1,
    max: 1000,
    step: 10,
    getWeight: (text: string) => {
      const v = Number(text);
      if (!text || v < WEIGHT_OPTIONS.min) return WEIGHT_OPTIONS.min;
      else if (v > WEIGHT_OPTIONS.max) return WEIGHT_OPTIONS.max;

      return v;
    },
  } as const;

  const [weightInput, setWeightInput] = useState(`${data.weight ?? 0}`);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdjustWeight = (offset: number) => {
    const currentWeight = Number(weightInput);
    if (isNaN(currentWeight)) return;

    const value = currentWeight + offset;
    setWeightInput(`${value}`);
    onUpdateWeight?.(id, value);
  };

  const onWeightChange = useMemo(
    () =>
      debounce((v: number) => {
        onUpdateWeight?.(id, v);
      }, 300),
    [data, id, onUpdateWeight],
  );

  useEffect(() => {
    return () => onWeightChange.cancel();
  }, [onWeightChange]);

  const handleUpdateWeight = (input: string) => {
    if (input === "") {
      setWeightInput("");
      return;
    }
    const cleaned = input
      .replace(",", ".")
      .replace(/[^0-9.]/g, "")
      .replace(/^(\d*\.?\d?).*$/, "$1");

    const value = WEIGHT_OPTIONS.getWeight(cleaned);
    setWeightInput(cleaned);
    onWeightChange(value);
  };

  const handleWeightInputBlur = () => {
    const v = WEIGHT_OPTIONS.getWeight(weightInput);
    setWeightInput(`${v}`);
    onWeightChange(v);
  };

  return (
    <Pressable className="z-10" onPress={() => setIsExpanded((prev) => !prev)}>
      <Animated.View
        layout={LinearTransition.easing(Easing.out(Easing.ease)).duration(250)}
        className="bg-white border border-zinc-200 rounded-2xl gap-3 p-3">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="font-montserrat-medium text-charcoal-pure">
              {data.name || "Thành phần"}
            </Text>
            <Text className="font-montserrat-small text-zinc-500">
              ({weightInput}g)
            </Text>
          </View>
          <View className="flex-row items-center gap-1 flex-shrink-0">
            <PressScale
              disabled={disabled}
              onPress={() => handleAdjustWeight(-WEIGHT_OPTIONS.step)}
              className="w-8 h-8 items-center justify-center">
              <MinusIcon size={16} color="#18181B" />
            </PressScale>
            <View
              className="flex-row items-center justify-center"
              style={{ minWidth: 54, height: 32 }}>
              <TextInput
                editable={!disabled}
                value={weightInput}
                onChangeText={(text) => {
                  handleUpdateWeight(text);
                }}
                onPressIn={(event) => event.stopPropagation()}
                onEndEditing={() => handleWeightInputBlur()}
                keyboardType="numeric"
                textAlign="center"
                maxLength={6}
                className="font-montserrat-bold text-charcoal-pure"
                style={{
                  padding: 0,
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 18,
                  height: 32,
                  minWidth: 28,
                  textAlignVertical: "center",
                  includeFontPadding: false,
                }}
              />
              <Text
                className="font-montserrat-semibold text-charcoal-pure"
                style={{
                  fontSize: 12,
                  lineHeight: 18,
                  marginLeft: 2,
                  includeFontPadding: false,
                }}>
                {"g"}
              </Text>
            </View>
            <PressScale
              disabled={disabled}
              onPress={() => handleAdjustWeight(WEIGHT_OPTIONS.step)}
              className="w-8 h-8 items-center justify-center">
              <PlusIcon size={16} color="#18181B" />
            </PressScale>
          </View>
          <TouchableOpacity
            disabled={disabled}
            onPress={() => onRemovePressed?.(id)}
            className="ml-2 w-9 h-9 bg-red-50 rounded-full items-center justify-center">
            <Trash2Icon size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
        {isExpanded && (
          <Animated.View
            entering={FadeInDown.duration(250)}
            exiting={FadeOutDown.duration(250)}
            className="justify-center items-center gap-2">
            <Text className="text-gray-400 font-montserrat">Đơn vị g</Text>
            <View className="flex-row gap-2">
              <MarcrosBox
                name="calories"
                title="Cal"
                value={data.calories}
                disabled={disabledMacrosInput}
                onValueChanged={(v) => onUpdateMacros?.(id, "calories", v)}
              />
              <MarcrosBox
                name="protein"
                title="Pro"
                value={data.protein}
                disabled={disabledMacrosInput}
                onValueChanged={(v) => onUpdateMacros?.(id, "protein", v)}
              />
              <MarcrosBox
                name="carbs"
                title="Carb"
                value={data.carbs}
                disabled={disabledMacrosInput}
                onValueChanged={(v) => onUpdateMacros?.(id, "carbs", v)}
              />
              <MarcrosBox
                name="fat"
                title="Fat"
                value={data.fat}
                disabled={disabledMacrosInput}
                onValueChanged={(v) => onUpdateMacros?.(id, "fat", v)}
              />
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}
