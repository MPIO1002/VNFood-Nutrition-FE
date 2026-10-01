import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Sparkles, ChevronRight, Utensils, Flame } from 'lucide-react-native';
import { PressScale } from './PressScale';

interface CalorieRingProps {
  goal: number;
  consumed: number;
  burned?: number;
  className?: string;
}

export function CalorieRing({ goal, consumed, burned = 320, className }: CalorieRingProps) {
  const remaining = goal - consumed;
  const RING_R = 82;
  const RING_STROKE = 15;
  const CIRCUMFERENCE = 2 * Math.PI * RING_R;
  const PROGRESS_RATIO = consumed / goal;
  const STROKE_DASHOFFSET = CIRCUMFERENCE * (1 - PROGRESS_RATIO);

  return (
    <View className={`bg-canvas-white rounded-[24px] p-5 shadow-sm border border-border-subtle mb-6 ${className || ''}`}>
      <View className="flex-row items-center justify-between mb-4 px-1">
        <View className="flex-row items-center gap-1.5 px-3 py-1.5 bg-zinc-100 rounded-full border border-border-hairline">
          <View className="w-1.5 h-1.5 rounded-full bg-macro-burned" />
          <Text className="font-montserrat-semibold text-[11px] text-zinc-600">AI Food Scanner</Text>
        </View>
        <PressScale>
          <View className="flex-row items-center gap-1">
            <Text 
              className="font-montserrat-semibold text-[13px] text-zinc-500"
              numberOfLines={1}
            >
              Chi tiết
            </Text>
            <ChevronRight size={14} color="#71717A" />
          </View>
        </PressScale>
      </View>

      <View className="items-center justify-center my-2 relative">
        <Svg width={200} height={200} viewBox="0 0 200 200" style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={100} cy={100} r={RING_R} fill="none" stroke="#F4F4F5" strokeWidth={RING_STROKE} />
          <Circle
            cx={100}
            cy={100}
            r={RING_R}
            fill="none"
            stroke="#18181B"
            strokeWidth={RING_STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={STROKE_DASHOFFSET}
            strokeLinecap="round"
          />
        </Svg>
        <View className="absolute items-center justify-center pointer-events-none">
          <Text className="font-montserrat-semibold text-xs text-zinc-500 tracking-[0.5px] uppercase mb-0.5">Còn lại</Text>
          <View className="flex-row items-baseline mb-1">
            <Text className="font-montserrat-bold text-[34px] text-charcoal-pure tracking-[-1px]">{remaining.toLocaleString()}</Text>
            <Text className="font-montserrat-semibold text-[14px] text-zinc-500 ml-1">kcal</Text>
          </View>
          <View className="bg-zinc-100 px-3 py-1.5 rounded-full">
            <Text className="font-montserrat-semibold text-[11px] text-zinc-600">Mục tiêu {goal.toLocaleString()} kcal</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center px-4 mt-4 bg-surface-container p-4 rounded-[18px]">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-canvas-white items-center justify-center shadow-sm">
            <Utensils size={18} color="#18181B" />
          </View>
          <View>
            <Text className="font-montserrat-semibold text-[11px] text-zinc-500 uppercase tracking-widest">Đã nạp</Text>
            <Text className="font-montserrat-bold text-[17px] text-charcoal-pure mt-0.5">
              {consumed} <Text className="font-montserrat-semibold text-[12px] text-zinc-500">kcal</Text>
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center border border-green-100">
            <Flame size={18} color="#059669" />
          </View>
          <View>
            <Text className="font-montserrat-semibold text-[11px] text-zinc-500 uppercase tracking-widest">Tiêu hao</Text>
            <Text className="font-montserrat-bold text-[17px] text-charcoal-pure mt-0.5">
              {burned} <Text className="font-montserrat-semibold text-[12px] text-zinc-500">kcal</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Macro Row placeholder */}
      <View className="flex-row gap-2 mt-4">
        {/* We can extract Macro Pill later, keeping simple here */}
        <View className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-montserrat-semibold text-[11px] text-slate-700">Protein</Text>
            <Text className="font-montserrat-bold text-[11px] text-slate-700">61%</Text>
          </View>
          <View className="h-[5px] bg-slate-200 rounded-full overflow-hidden mb-2">
            <View className="h-full bg-macro-protein w-[61%]" />
          </View>
          <Text className="font-montserrat-bold text-[13px] text-charcoal-pure">85<Text className="font-montserrat-medium text-[11px] text-zinc-400">/140g</Text></Text>
        </View>

        <View className="flex-1 bg-amber-50 p-3 rounded-2xl border border-amber-100">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-montserrat-semibold text-[11px] text-amber-800">Carbs</Text>
            <Text className="font-montserrat-bold text-[11px] text-amber-800">73%</Text>
          </View>
          <View className="h-[5px] bg-amber-200 rounded-full overflow-hidden mb-2">
            <View className="h-full bg-macro-carbs w-[73%]" />
          </View>
          <Text className="font-montserrat-bold text-[13px] text-charcoal-pure">160<Text className="font-montserrat-medium text-[11px] text-zinc-400">/220g</Text></Text>
        </View>

        <View className="flex-1 bg-rose-50 p-3 rounded-2xl border border-rose-100">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-montserrat-semibold text-[11px] text-rose-800">Chất béo</Text>
            <Text className="font-montserrat-bold text-[11px] text-rose-800">69%</Text>
          </View>
          <View className="h-[5px] bg-rose-200 rounded-full overflow-hidden mb-2">
            <View className="h-full bg-macro-fat w-[69%]" />
          </View>
          <Text className="font-montserrat-bold text-[13px] text-charcoal-pure">45<Text className="font-montserrat-medium text-[11px] text-zinc-400">/65g</Text></Text>
        </View>
      </View>
    </View>
  );
}
