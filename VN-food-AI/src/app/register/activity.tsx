import { useUserHealthInformationContextController } from "@/context/register/hooks/useUserHealthInformationContext";
import { router } from "expo-router";
import {
  Armchair,
  ArrowRight,
  Check,
  Dumbbell,
  Flame,
  Footprints,
  SportShoe,
  Zap,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ActivityOption {
  id: string;
  pal: number;
  title: string;
  isRecommended?: boolean;
  desc: string;
  detail: string;
  IconComponent: any;
}

const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    id: "sedentary",
    pal: 1.2,
    title: "Chủ yếu ngồi",
    desc: "Rất ít hoặc không tập có chủ đích (Dân văn phòng, ngồi máy tính nhiều)",
    detail: "• Hệ số PAL: 1.2 • BMR × 1.2",
    IconComponent: Armchair,
  },
  {
    id: "light",
    pal: 1.375,
    title: "Vận động nhẹ",
    desc: "Tập nhẹ hoặc đi bộ khoảng 1–3 ngày/tuần",
    detail: "• Hệ số PAL: 1.375",
    IconComponent: Footprints,
  },
  {
    id: "moderate",
    pal: 1.55,
    title: "Vận động vừa",
    isRecommended: true,
    desc: "Tập thể thao, gym hoặc chạy bộ vừa phải khoảng 3–5 ngày/tuần",
    detail: "• Hệ số PAL: 1.55 • Tối ưu chuyển hoá",
    IconComponent: Dumbbell,
  },
  {
    id: "heavy",
    pal: 1.725,
    title: "Vận động nặng",
    desc: "Tập luyện cường độ cao khoảng 6–7 ngày/tuần",
    detail: "• Hệ số PAL: 1.725",
    IconComponent: SportShoe,
  },
  {
    id: "very_heavy",
    pal: 1.9,
    title: "Vận động viên chuyên nghiệp",
    desc: "Vận động viên thi đấu hoặc công việc thể lực nặng nhọc liên tục",
    detail: "• Hệ số PAL: 1.9 • Cường độ cực cao",
    IconComponent: Flame,
  },
];

export default function InputActivityScreen() {
  const insets = useSafeAreaInsets();
  const { markReady, data, updateData } =
    useUserHealthInformationContextController();

  const [selectedId, setSelectedId] = useState<string>(
    data?.activityId || "moderate",
  );

  useEffect(() => {
    markReady("activity");
  }, []);

  const selectedOption = useMemo(() => {
    return (
      ACTIVITY_OPTIONS.find((opt) => opt.id === selectedId) ||
      ACTIVITY_OPTIONS[2]
    );
  }, [selectedId]);

  const handleSelect = (option: ActivityOption) => {
    setSelectedId(option.id);
    updateData({
      activityId: option.id,
      activityLevel: option.pal,
    });
  };

  const userWeight = data?.weight || 68.5;
  const userHeight = data?.height || 175;
  const userAge = data?.age || 27;
  const isMale = (data?.gender || "male") === "male";

  // Calculate BMR and TDEE
  const bmr = useMemo(() => {
    const raw = 10 * userWeight + 6.25 * userHeight - 5 * userAge + (isMale ? 5 : -161);
    return Math.round(raw);
  }, [userWeight, userHeight, userAge, isMale]);

  const tdee = useMemo(() => {
    return Math.round(bmr * selectedOption.pal);
  }, [bmr, selectedOption.pal]);

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
        <View className="w-full gap-3">
          {/* Header Title & Subtitle */}
          <View className="w-full">
            <Text className="font-montserrat-bold text-2xl text-charcoal-pure">
              Mức độ vận động hàng tuần của bạn?
            </Text>
            <Text className="font-montserrat text-sm text-gray-400 mt-1 leading-5">
              CaloViet AI nhân hệ số vận động (PAL) với BMR để tính chính xác
              lượng Calo tiêu hao thực tế (TDEE).
            </Text>
          </View>

          {/* Activity Options List */}
          <View className="w-full gap-2.5 mt-1">
            {ACTIVITY_OPTIONS.map((item) => {
              const isSelected = item.id === selectedId;
              const IconComp = item.IconComponent;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleSelect(item)}
                  className={`w-full p-3.5 rounded-2xl bg-white flex-row items-center justify-between shadow-sm active:opacity-90 ${isSelected
                    ? "border-2 border-charcoal-pure"
                    : "border border-gray-100"
                    }`}>
                  <View className="flex-row items-start gap-3 flex-1 pr-2">
                    <View className="w-11 h-11 rounded-xl bg-gray-100 items-center justify-center mt-0.5">
                      <IconComp size={22} color="#18181B" />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 flex-wrap">
                        <Text className="font-montserrat-bold text-[15px] text-charcoal-pure leading-5">
                          {item.title}
                        </Text>
                        {item.isRecommended && (
                          <View className="bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                            <Text className="font-montserrat-semibold text-[10px] text-emerald-600">
                              Khuyên dùng
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text className="font-montserrat text-xs text-zinc-400 mt-1 leading-4">
                        {item.desc}
                      </Text>

                      <View className="flex-row items-center mt-1.5">
                        <Text
                          className={`font-montserrat-medium text-[11px] ${isSelected ? "text-emerald-600" : "text-zinc-500"
                            }`}>
                          {item.detail}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Radio check */}
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center ml-1 ${isSelected
                      ? "bg-charcoal-pure"
                      : "border-2 border-gray-200 bg-white"
                      }`}>
                    {isSelected && <Check size={14} color="#FFF" strokeWidth={3} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Bottom Section */}
        <View className="w-full gap-2.5 mt-6">
          <Pressable
            className="w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40"
            onPress={() => router.push("/register/plan")}>
            <Text className="font-montserrat-bold text-[15px] text-white">
              Tiếp tục (Chọn mục tiêu vóc dáng)
            </Text>
            <ArrowRight size={18} color="#FFF" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
