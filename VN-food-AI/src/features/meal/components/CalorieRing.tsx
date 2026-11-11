import { PressScale } from "@/components/PressScale";
import { ChevronRight, Flame, Utensils } from "lucide-react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { MacroCard } from "./MacroCard";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CalorieRingProps {
  goal: number;
  consumed: number;
  protein?: number;
  proteinGoal?: number | null;
  carbs?: number;
  carbsGoal?: number | null;
  fat?: number;
  fatGoal?: number | null;
  burned?: number;
  className?: string;
  animationKey?: number;
}

export function CalorieRing({
  goal,
  consumed,
  protein = 0,
  proteinGoal = 140,
  carbs = 0,
  carbsGoal = 220,
  fat = 0,
  fatGoal = 65,
  burned = 0,
  className,
  animationKey,
}: CalorieRingProps) {
  const remaining = goal - consumed;
  const RING_R = 82;
  const RING_STROKE = 15;
  const CIRCUMFERENCE = 2 * Math.PI * RING_R;
  const PROGRESS_RATIO = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(PROGRESS_RATIO, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [PROGRESS_RATIO, animationKey, progress]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

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
          <AnimatedCircle
            cx={100}
            cy={100}
            r={RING_R}
            fill="none"
            stroke="#18181B"
            strokeWidth={RING_STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeLinecap="round"
            animatedProps={animatedCircleProps}
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

      <View className="flex-row gap-2 mt-4">
        <MacroCard
          label="Protein"
          value={protein}
          goal={proteinGoal}
          colors={{
            background: "bg-slate-50",
            border: "border-slate-100",
            text: "text-slate-700",
            track: "bg-slate-200",
            fill: "bg-macro-protein",
          }}
        />
        <MacroCard
          label="Carb"
          value={carbs}
          goal={carbsGoal}
          colors={{
            background: "bg-amber-50",
            border: "border-amber-100",
            text: "text-amber-800",
            track: "bg-amber-200",
            fill: "bg-macro-carbs",
          }}
        />
        <MacroCard
          label="Fat"
          value={fat}
          goal={fatGoal}
          colors={{
            background: "bg-rose-50",
            border: "border-rose-100",
            text: "text-rose-800",
            track: "bg-rose-200",
            fill: "bg-macro-fat",
          }}
        />
      </View>
    </View>
  );
}
