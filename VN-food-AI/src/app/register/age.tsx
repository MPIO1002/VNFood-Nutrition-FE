import { useUserHealthInformationContextController } from "@/context/register/hooks/useUserHealthInformationContext";
import { router } from "expo-router";
import { ArrowRight, Lightbulb, Minus, Plus } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AGE_RANGES = [
  { label: "18–24", defaultAge: 22, min: 18, max: 24 },
  { label: "25–34", defaultAge: 27, min: 25, max: 34 },
  { label: "35–44", defaultAge: 38, min: 35, max: 44 },
  { label: "45+", defaultAge: 48, min: 45, max: 90 },
];

export default function InputAgeScreen() {
  const insets = useSafeAreaInsets();
  const { markReady, data, updateData } =
    useUserHealthInformationContextController();

  const [age, setAge] = useState<number>(data?.age || 27);

  useEffect(() => {
    markReady("age");
  }, []);

  const handleAgeChange = (newAge: number) => {
    const clamped = Math.max(12, Math.min(100, newAge));
    setAge(clamped);
    updateData({ age: clamped });
  };

  const birthYear = 2026 - age;

  const generation = useMemo(() => {
    if (birthYear >= 2013) return "Gen Alpha";
    if (birthYear >= 1997) return "Gen Z";
    if (birthYear >= 1981) return "Gen Y (Millennials)";
    if (birthYear >= 1965) return "Gen X";
    return "Baby Boomer";
  }, [birthYear]);

  const selectedRangeIndex = useMemo(() => {
    return AGE_RANGES.findIndex((r) => age >= r.min && age <= r.max);
  }, [age]);

  const metabolicInsight = useMemo(() => {
    if (age < 25) {
      return "Ở độ tuổi 18–24, tốc độ trao đổi chất đạt đỉnh cao, khả năng phục hồi cơ bắp và thích ứng vận động rất nhanh chóng.";
    }
    if (age <= 34) {
      return "Ở độ tuổi 25–34, cơ thể đạt đỉnh duy trì khối cơ nhưng quá trình trao đổi chất bắt đầu giảm 1–2% mỗi thập kỷ nếu thiếu vận động.";
    }
    if (age <= 44) {
      return "Ở độ tuổi 35–44, khối lượng cơ bắp tự nhiên có xu hướng suy giảm nhẹ, cần chú trọng tập kháng lực và duy trì lượng đạm.";
    }
    return "Ở độ tuổi 45+, tốc độ chuyển hóa chậm lại, việc duy trì vận động đều đặn và dinh dưỡng cân bằng là chìa khóa duy trì năng lượng.";
  }, [age]);

  // Estimate BMR based on age and gender
  const estimatedBMR = useMemo(() => {
    const weight = data?.weight || 68.5;
    const height = data?.height || 175;
    const isMale = (data?.gender || "male") === "male";
    const bmr = 10 * weight + 6.25 * height - 5 * age + (isMale ? 5 : -161);
    return Math.round(bmr);
  }, [age, data?.weight, data?.height, data?.gender]);

  return (
    <View
      className="bg-gray-100 flex-1 px-5"
      style={{
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 16),
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingBottom: 8,
        }}>
        <View className="w-full gap-3.5">
          {/* Header Title & Subtitle */}
          <View className="w-full">
            <Text className="font-montserrat-bold text-2xl text-charcoal-pure">
              Bạn bao nhiêu tuổi?
            </Text>
            <Text className="font-montserrat text-sm text-gray-400 mt-1 leading-5">
              Độ tuổi ảnh hưởng đến tốc độ chuyển hoá năng lượng tự nhiên và nhu
              cầu tổng hợp protein của cơ thể.
            </Text>
          </View>

          {/* Main Card */}
          <View className="w-full bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
            {/* Range Presets Row */}
            <View className="w-full flex-row justify-between items-center gap-1.5">
              {AGE_RANGES.map((range, idx) => {
                const isActive = idx === selectedRangeIndex;
                return (
                  <Pressable
                    key={range.label}
                    onPress={() => handleAgeChange(range.defaultAge)}
                    className={`flex-1 py-2 rounded-full items-center justify-center ${isActive ? "bg-charcoal-pure" : "bg-gray-100"
                      }`}>
                    <Text
                      className={`text-xs font-montserrat-semibold ${isActive ? "text-white" : "text-zinc-600"
                        }`}>
                      {range.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Big Age Number & Generation Badge */}
            <View className="w-full items-center justify-center my-6 gap-2">
              <View className="flex-row items-baseline justify-center">
                <Text className="font-montserrat-bold text-[50px] text-charcoal-pure leading-none">
                  {age}
                </Text>
                <Text className="font-montserrat-medium text-xl text-zinc-600 ml-2">
                  tuổi
                </Text>
              </View>

              <View className="bg-gray-100 rounded-full px-3.5 py-1.5 flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                <Text className="font-montserrat-medium text-xs text-zinc-600">
                  Sinh năm {birthYear} • Thế hệ {generation}
                </Text>
              </View>
            </View>

            {/* Stepper with Visual Gauge */}
            <View className="w-full items-center">
              <View className="w-full flex-row items-center justify-between px-2">
                <Pressable
                  onPress={() => handleAgeChange(age - 1)}
                  className="w-12 h-12 rounded-2xl bg-gray-100 items-center justify-center active:opacity-40">
                  <Minus size={20} color="#18181B" strokeWidth={2.5} />
                </Pressable>

                {/* Central Gauge Lines */}
                <View className="flex-row items-center justify-center gap-1.5 h-10 px-4">
                  <View className="w-1 h-3 rounded-full bg-zinc-300" />
                  <View className="w-1 h-4 rounded-full bg-zinc-300" />
                  <View className="w-1 h-5 rounded-full bg-zinc-300" />
                  <View className="w-1 h-6 rounded-full bg-zinc-400" />
                  <View className="w-1.5 h-8 rounded-full bg-charcoal-pure" />
                  <View className="w-1 h-6 rounded-full bg-zinc-400" />
                  <View className="w-1 h-5 rounded-full bg-zinc-300" />
                  <View className="w-1 h-4 rounded-full bg-zinc-300" />
                  <View className="w-1 h-3 rounded-full bg-zinc-300" />
                </View>

                <Pressable
                  onPress={() => handleAgeChange(age + 1)}
                  className="w-12 h-12 rounded-2xl bg-gray-100 items-center justify-center active:opacity-40">
                  <Plus size={20} color="#18181B" strokeWidth={2.5} />
                </Pressable>
              </View>

              <Text className="font-montserrat text-xs text-zinc-400 mt-3 text-center">
                Chạm để tinh chỉnh ±1 tuổi
              </Text>
            </View>
          </View>

          {/* Chuyển hóa theo độ tuổi Card */}
          <View className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 gap-2">
            <View className="flex-row items-center gap-2">
              <View className="w-6 h-6 rounded-full bg-amber-100 items-center justify-center">
                <Lightbulb size={14} color="#D97706" />
              </View>
              <Text className="font-montserrat-bold text-sm text-charcoal-pure">
                Chuyển hóa theo độ tuổi
              </Text>
            </View>
            <Text className="font-montserrat text-xs text-zinc-600 leading-5">
              {metabolicInsight}
            </Text>
          </View>

          {/* Stat Row */}
          <View className="w-full flex-row gap-3">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Text className="font-montserrat text-xs text-zinc-500">
                Hệ số BMR cơ sở
              </Text>
              <Text className="font-montserrat-bold text-base text-charcoal-pure mt-1">
                ~{estimatedBMR.toLocaleString()} kcal
              </Text>
            </View>

            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Text className="font-montserrat text-xs text-zinc-500">
                Nhu cầu Protein
              </Text>
              <Text className="font-montserrat-bold text-base text-blue-600 mt-1">
                • 1.6 - 2.0g/kg
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View className="w-full gap-2.5 mt-6">
          <Pressable
            className="w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40"
            onPress={() => router.push("/register/weight")}>
            <Text className="font-montserrat-bold text-[15px] text-white">
              Tiếp tục (Chọn cân nặng)
            </Text>
            <ArrowRight size={18} color="#FFF" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
