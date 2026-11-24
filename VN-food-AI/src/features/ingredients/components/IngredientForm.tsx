import { IngredientItem } from "@/api/generated/model";
import { PressScale } from "@/components/PressScale";
import { FoodComponent, Macros } from "@/features/analyzer";
import {
  GroceriesIcon,
  MinusIcon,
  PlusCircleIcon,
  PlusIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { WEIGHT_OPTIONS } from "../constant/ingredient";
import IngredientPicker from "./IngredientPicker";
import MarcrosBox from "./MacrosBox";

export interface IngredientFormProps {
  excludeIngredientIds?: number[];
  listSearchPosition?: "top" | "bottom";
  onAddIngredient?: (comp: FoodComponent) => void;
  onCancel?: () => void;
}

export default function IngredientForm({
  excludeIngredientIds,
  listSearchPosition,
  onAddIngredient,
  onCancel,
}: IngredientFormProps) {
  const [name, setName] = useState("");
  const [macrosValues, setMacrosValues] = useState<Record<Macros, number>>({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  });
  const [isCustom, setIsCustom] = useState(true);
  const WEIGHT_CHOICE_BOXES = [50, 100, 150, 200];
  const [weight, setWeight] = useState(0);
  const [weightInput, setWeightInput] = useState(`${weight}`);

  const handleQueryChange = (q: string) => {
    setName(q);
    if (!isCustom) setIsCustom(true);
  };

  const handleSelect = (i: IngredientItem) => {
    setIsCustom(false);
    setName(i.name);
    setMacrosValues({
      calories: i.calories_per_100g,
      protein: i.protein_g,
      carbs: i.carb_g,
      fat: i.fat_g,
    });
  };

  const handleAdjustWeight = (offset: number) => {
    const currentWeight = Number(weightInput);
    if (isNaN(currentWeight)) return;

    const value = currentWeight + offset;
    setWeightInput(`${value}`);
    setWeight(value);
  };

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
    setWeight(value);
  };

  const handleWeightInputBlur = () => {
    const v = WEIGHT_OPTIONS.getWeight(weightInput);
    setWeightInput(`${v}`);
  };

  const handleAdd = () => {
    const ingredient: FoodComponent = {
      name: name,
      weight: weight,
      calories: macrosValues.calories,
      protein: macrosValues.protein,
      carbs: macrosValues.carbs,
      fat: macrosValues.fat,
      originalWeight: weight,
      originalCalories: macrosValues.calories,
      originalProtein: macrosValues.protein,
      originalCarbs: macrosValues.carbs,
      originalFat: macrosValues.fat,
      isCustom: isCustom,
    };

    onAddIngredient?.(ingredient);
  };

  return (
    <View className="bg-white border border-zinc-200 rounded-2xl p-3">
      <View className="w-full flex-row justify-center gap-2 p-2">
        <View className="justify-center items-center p-3 bg-black rounded-xl h-12 w-12">
          <GroceriesIcon size={20} color={"white"} />
        </View>
        <View className="justify-center flex-1">
          <Text className="font-montserrat-semibold">Thêm nguyên liệu mới</Text>
          <Text className="text-gray-300 text-xs text-wrap">
            Tính toán dinh dưỡng tức thì theo định lượng
          </Text>
        </View>
      </View>
      <IngredientPicker
        initialQuery={name}
        onQueryChange={handleQueryChange}
        onSelect={(i) => handleSelect(i)}
        excludeIngredientIds={excludeIngredientIds}
        listSearchPosition={listSearchPosition}
      />
      <View className="flex-row p-3 items-center">
        <Text className="font-light">Định lượng khẩu phần:</Text>
        <View className="flex-1 items-end">
          <View className="flex-row items-center gap-1 flex-shrink-0">
            <PressScale
              onPress={() => handleAdjustWeight(-WEIGHT_OPTIONS.step)}
              className="w-8 h-8 items-center justify-center">
              <MinusIcon size={16} color="#18181B" />
            </PressScale>
            <View
              className="flex-row items-center justify-center"
              style={{ width: 50, height: 32 }}>
              <TextInput
                value={weightInput}
                onChangeText={(text) => {
                  handleUpdateWeight(text);
                }}
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
              onPress={() => handleAdjustWeight(WEIGHT_OPTIONS.step)}
              className="w-8 h-8 items-center justify-center">
              <PlusIcon size={16} color="#18181B" />
            </PressScale>
          </View>
        </View>
      </View>
      <View className="flex-row gap-2">
        {WEIGHT_CHOICE_BOXES.map((v) => (
          <Pressable
            key={`weight-${v}`}
            className="px-3 py-2 border border-gray-300 bg-gray-100 shadow shadow-gray-500 rounded-2xl flex-1 justify-center items-center active:opacity-50"
            onPress={() => handleUpdateWeight(`${v}`)}>
            <Text className="font-montserrat-semibold">{v}g</Text>
          </Pressable>
        ))}
      </View>
      <View className="justify-center items-center gap-2 mt-5">
        <Text className="text-gray-400 font-montserrat">Đơn vị g</Text>
        <View className="flex-row gap-2">
          <MarcrosBox
            name="calories"
            title="Cal"
            disabled={!isCustom}
            value={macrosValues.calories}
            onValueChanged={(v) =>
              setMacrosValues((prev) => ({
                ...prev,
                calories: v,
              }))
            }
          />
          <MarcrosBox
            name="protein"
            title="Pro"
            disabled={!isCustom}
            value={macrosValues.protein}
            onValueChanged={(v) =>
              setMacrosValues((prev) => ({
                ...prev,
                protein: v,
              }))
            }
          />
          <MarcrosBox
            name="carbs"
            title="Carb"
            disabled={!isCustom}
            value={macrosValues.carbs}
            onValueChanged={(v) =>
              setMacrosValues((prev) => ({
                ...prev,
                carbs: v,
              }))
            }
          />
          <MarcrosBox
            name="fat"
            title="Fat"
            disabled={!isCustom}
            value={macrosValues.fat}
            onValueChanged={(v) =>
              setMacrosValues((prev) => ({
                ...prev,
                fat: v,
              }))
            }
          />
        </View>
      </View>
      <PressScale className="mt-5" onPress={handleAdd}>
        <View
          className={`h-14 flex-row items-center justify-center gap-2 px-4 rounded-2xl bg-charcoal-pure`}>
          <PlusCircleIcon size={20} color="white" />
          <Text className="font-montserrat-semibold text-sm text-white">
            Thêm vào danh sách
          </Text>
        </View>
      </PressScale>
      <PressScale className="mt-5" onPress={() => onCancel?.()}>
        <View
          className={`h-14 flex-row items-center justify-center gap-2 px-4 rounded-2xl bg-white`}>
          <Text className="font-montserrat-semibold text-sm text-charcoal-pure">
            Hủy
          </Text>
        </View>
      </PressScale>
    </View>
  );
}
