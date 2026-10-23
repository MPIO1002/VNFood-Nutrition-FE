import { BalancedPlanBox } from "@/components/plan/BalancedPlanBox";
import { GainWeightPlanBox } from "@/components/plan/GainWeightPlanBox";
import { LoseWeightPlanBox } from "@/components/plan/LoseWeightPlanBox";
import { useUserHealthInformationContextController } from "@/context/register/hooks/useUserHealthInformationContext";
import { calculateNutrition } from "@/services/nutrition";
import type {
  ActivityLevel,
  NutritionGoal,
} from "@/types/nutrition";
import { router } from "expo-router";
import { ArrowRight, LockIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Map activityId (internal) → API activity_level value */
const ACTIVITY_LEVEL_MAP: Record<string, ActivityLevel> = {
  sedentary: "sedentary",
  light: "light",
  moderate: "moderate",
  heavy: "active",
  very_heavy: "very_active",
};

/** Map plan choice (1/2/3) → API goal value */
const GOAL_MAP: Record<number, NutritionGoal> = {
  1: "lose_weight",
  2: "maintain_weight",
  3: "gain_weight",
};

export default function PlanChoiceScreen() {
  const insets = useSafeAreaInsets();
  const { markReady, data, updateData } =
    useUserHealthInformationContextController();
  const [choice, setChoice] = useState(data?.plan || 2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    markReady("plan");
  }, []);

  const handleFinish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const activityLevel =
        ACTIVITY_LEVEL_MAP[data.activityId] || "moderate";
      const goal = GOAL_MAP[choice] || "maintain_weight";

      await calculateNutrition({
        sex_for_equation: data.gender,
        age: data.age,
        height_cm: data.height,
        weight_kg: data.weight,
        activity_level: activityLevel,
        goal: goal,
      });

      // Chuyển về trang chủ sau khi tính toán thành công
      if (router.canDismiss()) router.dismissAll();
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Lỗi tính toán dinh dưỡng:", error);
      Alert.alert(
        "Lỗi tính toán",
        error?.message || "Không thể tính toán chỉ số dinh dưỡng. Vui lòng thử lại.",
        [
          {
            text: "Thử lại",
            onPress: () => setIsSubmitting(false),
          },
          {
            text: "Bỏ qua",
            style: "cancel",
            onPress: () => {
              if (router.canDismiss()) router.dismissAll();
              router.replace("/(tabs)");
            },
          },
        ],
      );
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        className="flex-1 bg-gray-100"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 16),
        }}
        showsVerticalScrollIndicator={false}>
        <View className="w-full gap-4">
          <View className="w-full">
            <Text className="font-montserrat-bold text-2xl text-charcoal-pure">
              Mục tiêu vóc dáng của bạn là gì?
            </Text>
            <Text className="font-montserrat text-sm text-gray-400 mt-1">
              Thuật toán CaloViet AI sẽ tự động phân bổ ngân sách calo và tỷ
              lệ đạm - đường - béo chuẩn cho cơ địa người Việt.
            </Text>
          </View>
          <View className="w-full gap-3">
            <LoseWeightPlanBox
              activated={choice === 1}
              onPress={() => {
                setChoice(1);
                updateData({ plan: 1 });
              }}
            />
            <BalancedPlanBox
              activated={choice === 2}
              onPress={() => {
                setChoice(2);
                updateData({ plan: 2 });
              }}
            />
            <GainWeightPlanBox
              activated={choice === 3}
              onPress={() => {
                setChoice(3);
                updateData({ plan: 3 });
              }}
            />
          </View>
        </View>

        {/* Bottom section anchored at bottom */}
        <View className="w-full gap-2.5 mt-6">
          <Pressable
            className={`w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 ${isSubmitting ? "opacity-60" : "active:opacity-40"}`}
            disabled={isSubmitting}
            onPress={handleFinish}>
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="#FFF" />
                <Text className="font-montserrat-bold text-[15px] text-white">
                  Đang tính toán...
                </Text>
              </>
            ) : (
              <>
                <Text className="font-montserrat-bold text-[15px] text-white">
                  {"Hoàn tất & Khám phá CaloViet AI"}
                </Text>
                <ArrowRight size={18} color="#FFF" />
              </>
            )}
          </Pressable>

          <View className="w-full flex-row items-center justify-center gap-1.5 pb-1">
            <LockIcon size={12} color={"#9ca3af"} />
            <Text className="text-xs font-montserrat text-center text-gray-400">
              Dữ liệu được bảo mật an toàn cho lộ trình cá nhân
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
