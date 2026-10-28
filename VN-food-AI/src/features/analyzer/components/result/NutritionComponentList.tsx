import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Minus, Plus, Trash2 } from "lucide-react-native";
import { PressScale } from "@/components/PressScale";

export interface NutritionComponentListProps {
  nutrition: import("@/features/analyzer/mapping/analyzeMapper").FoodNutrition;
  onUpdateName: (idx: number, newName: string) => void;
  onUpdateWeight: (idx: number, newWeight: number) => void;
  onAdjustWeight: (idx: number, delta: number) => void;
  onRemove: (idx: number) => void;
  onAdd: () => void;
}

export function NutritionComponentList({
  nutrition,
  onUpdateName,
  onUpdateWeight,
  onAdjustWeight,
  onRemove,
  onAdd,
}: NutritionComponentListProps) {
  return (
    <View className="px-4 mt-2">
      {/* Components Breakdown */}
      {nutrition.components && (
        <View className="mb-6">
          <View className="mb-4">
            <View className="flex-row items-baseline justify-between">
              <Text className="font-montserrat-bold text-lg text-charcoal-pure">Thành phần chi tiết</Text>
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
            {nutrition.components.map((comp: any, idx: number) => (
              <View key={idx} className="flex-row items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-200">
                {/* Thành phần */}
                <View className="flex-1">
                  <Text className="font-montserrat-medium text-charcoal-pure">{comp.name || "Thành phần"}</Text>
                  <Text className="font-montserrat-small text-zinc-500">({comp.weight}g)</Text>
                </View>

                {/* Cân đo */}
                <View className="flex-row items-center gap-1 flex-shrink-0">
                  <PressScale onPress={() => onAdjustWeight(idx, -10)} className="w-8 h-8 items-center justify-center">
                    <Minus size={16} color="#18181B" />
                  </PressScale>
                  <View
                    className="flex-row items-center justify-center"
                    style={{ minWidth: 54, height: 32 }}
                  >
                    <TextInput
                      value={comp.weight.toString()}
                      onChangeText={(text) => onUpdateWeight(idx, Number(text))}
                      keyboardType="numeric"
                      textAlign="center"
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
                    <Text className="font-montserrat-semibold text-charcoal-pure" style={{ fontSize: 12, lineHeight: 18, marginLeft: 2, includeFontPadding: false }}>{"g"}</Text>
                  </View>
                  <PressScale onPress={() => onAdjustWeight(idx, 10)} className="w-8 h-8 items-center justify-center">
                    <Plus size={16} color="#18181B" />
                  </PressScale>
                </View>

                {/* Nút xoá */}
                <TouchableOpacity onPress={() => onRemove(idx)} className="ml-2 w-9 h-9 bg-red-50 rounded-full items-center justify-center">
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Bottom Actions */}
      <View className="gap-3">
        <PressScale onPress={onAdd} style={{ marginBottom: 4 }}>
          <View className="h-14 flex-row items-center justify-center gap-2 px-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <Plus size={20} color="#18181B" />
            <Text className="font-montserrat-semibold text-sm text-charcoal-pure">Thêm thành phần</Text>
          </View>
        </PressScale>

      </View>
    </View>
  );
}