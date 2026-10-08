import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2, BookmarkCheck, ArrowRight } from 'lucide-react-native';
import { PressScale } from './PressScale';

interface NutritionResultsProps {
  foodData: any;
  totals: { kcal: number; protein: number; carbs: number; fat: number };
  saveState: 'idle' | 'saving' | 'saved';
  onUpdateComponentName: (idx: number, newName: string) => void;
  onUpdateComponentWeight: (idx: number, newWeightStr: string) => void;
  onAdjustWeight: (idx: number, delta: number) => void;
  onRemoveComponent: (idx: number) => void;
  onAddComponent: () => void;
  onSave: () => void;
}

export function NutritionResults({
  foodData,
  totals,
  saveState,
  onUpdateComponentName,
  onUpdateComponentWeight,
  onAdjustWeight,
  onRemoveComponent,
  onAddComponent,
  onSave,
}: NutritionResultsProps) {
  return (
    <View className="px-4 mt-2">
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

      {/* COMPONENTS BREAKDOWN */}
      {foodData?.components && (
        <View className="mb-6">
          <View className="mb-4">
            <View className="flex-row items-baseline justify-between">
              <Text className="font-montserrat-bold text-lg text-charcoal-pure">Thành phần chi tiết</Text>
              <Text className="font-montserrat-semibold text-sm text-charcoal-pure">
                {foodData.components.length} <Text className="font-montserrat-medium text-xs text-zinc-500">món nhận diện</Text>
              </Text>
            </View>
            <Text className="font-montserrat-medium text-xs text-zinc-500 mt-1">
              Chạm +/- để cân đối khẩu phần thực tế
            </Text>
          </View>

          <View className="gap-3">
            {foodData.components.map((comp: any, idx: number) => (
              <View
                key={idx}
                className="bg-white border border-zinc-100 rounded-[20px] p-3 flex-row items-center shadow-sm"
              >
                {/* Text info */}
                <View className="flex-1 min-w-0 mr-2 pl-2 justify-center">
                  <TextInput
                    value={comp.name}
                    onChangeText={(text) => onUpdateComponentName(idx, text)}
                    placeholder="Tên nguyên liệu"
                    className="font-montserrat-semibold text-charcoal-pure"
                    style={{
                      padding: 0,
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 22,
                      height: 22,
                      textAlignVertical: 'center',
                      includeFontPadding: false,
                    }}
                  />
                  <View className="flex-row items-center mt-1" style={{ height: 16 }}>
                    <Text
                      className="font-montserrat-bold text-charcoal-pure"
                      style={{ fontSize: 11, lineHeight: 16, includeFontPadding: false }}
                    >
                      {comp.calories}
                    </Text>
                    <Text
                      className="font-montserrat-medium text-zinc-500"
                      style={{ fontSize: 11, lineHeight: 16, includeFontPadding: false }}
                      numberOfLines={1}
                    >
                      {' '}kcal • {comp.protein}g P • {comp.carbs}g C
                    </Text>
                  </View>
                </View>

                {/* Controls (+/- Pill) */}
                <View className="flex-row items-center bg-zinc-100/80 rounded-full px-1" style={{ height: 36 }}>
                  <TouchableOpacity
                    onPress={() => onAdjustWeight(idx, -10)}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <Minus size={16} color="#18181B" />
                  </TouchableOpacity>

                  <View className="flex-row items-center justify-center" style={{ minWidth: 48, height: 32 }}>
                    <TextInput
                      value={comp.weight.toString()}
                      onChangeText={(text) => onUpdateComponentWeight(idx, text)}
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
                        textAlignVertical: 'center',
                        includeFontPadding: false,
                      }}
                    />
                    <Text
                      className="font-montserrat-semibold text-charcoal-pure"
                      style={{ fontSize: 12, lineHeight: 18, marginLeft: 2, includeFontPadding: false }}
                    >
                      g
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => onAdjustWeight(idx, 10)}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <Plus size={16} color="#18181B" />
                  </TouchableOpacity>
                </View>

                {/* Nút xoá */}
                <TouchableOpacity
                  onPress={() => onRemoveComponent(idx)}
                  className="ml-2 w-9 h-9 bg-red-50 rounded-full items-center justify-center"
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Bottom Actions */}
      <View className="gap-3">
        <PressScale onPress={onAddComponent}>
          <View className="h-14 flex-row items-center justify-center gap-2 px-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <Plus size={20} color="#18181B" />
            <Text className="font-montserrat-semibold text-sm text-charcoal-pure">Thêm thành phần</Text>
          </View>
        </PressScale>

        <PressScale onPress={onSave} toValue={0.99}>
          <View className={`h-16 flex-row items-center justify-between px-6 rounded-2xl shadow-sm ${saveState === 'saved' ? 'bg-green-600' : 'bg-charcoal-pure'}`}>
            <View className="flex-row items-center gap-3">
              <BookmarkCheck size={24} color="#FFFFFF" />
              <Text className="font-montserrat-bold text-base text-white">
                {saveState === 'saved' ? 'Đã ghi vào bữa trưa!' : saveState === 'saving' ? 'Đang lưu...' : 'Lưu nhật ký'}
              </Text>
            </View>
            {saveState === 'idle' && (
              <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20">
                <ArrowRight size={18} color="#FFFFFF" />
              </View>
            )}
          </View>
        </PressScale>
      </View>
    </View>
  );
}
