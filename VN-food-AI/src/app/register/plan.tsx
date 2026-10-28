import { NutritionGoal } from "@/api/generated/model";
import { useUserHealthInformationContext } from "@/features/health-register";
import { BalancedPlanBox } from "@/features/health-register/plan/components/BalancedPlanBox";
import { GainWeightPlanBox } from "@/features/health-register/plan/components/GainWeightPlanBox";
import { LoseWeightPlanBox } from "@/features/health-register/plan/components/LoseWeightPlanBox";
import { useHealthPlanRegister } from "@/features/health-register/plan/hooks/useHealthPlanRegister";
import { ArrowRight, LockIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlanChoiceScreen() {
  const insets = useSafeAreaInsets();
  const { markReady, metabolismData, assginMultipleMetabolismFieldData } =
    useUserHealthInformationContext();
  const [choice, setChoice] = useState<NutritionGoal>("maintain_weight");

  const currentWeight = metabolismData?.weight_kg || 0;
  const { getPlanValues, onGainPlanValueChange, onLosePlanValueChange } =
    useHealthPlanRegister();

  useEffect(() => {
    markReady("plan");
  }, []);

  const onNext = () => {
    const values = getPlanValues(choice);
    assginMultipleMetabolismFieldData({
      goal: choice,
      ...values,
    });

    // if (router.canDismiss()) router.dismissAll();
    // router.push("/(tabs)/analytics");
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
              Thuật toán CaloViet AI sẽ tự động phân bổ ngân sách calo và tỷ lệ
              đạm - đường - béo chuẩn cho cơ địa người Việt.
            </Text>
          </View>
          <View className="w-full gap-3">
            <LoseWeightPlanBox
              activated={choice === "lose_weight"}
              currentWeight={currentWeight}
              onPress={() => setChoice("lose_weight")}
              onWeightChange={(v) => {
                onLosePlanValueChange({ field: "weight_change_kg", value: v });
              }}
              onModeChange={(mode) => {
                console.log(mode);
                onLosePlanValueChange({ field: "goal_pace", value: mode });
              }}
            />
            <BalancedPlanBox
              activated={choice === "maintain_weight"}
              onPress={() => setChoice("maintain_weight")}
            />
            <GainWeightPlanBox
              activated={choice === "gain_weight"}
              currentWeight={currentWeight}
              onPress={() => setChoice("gain_weight")}
              onWeightChange={(v) => {
                onGainPlanValueChange({ field: "weight_change_kg", value: v });
              }}
              onModeChange={(mode) => {
                onGainPlanValueChange({ field: "goal_pace", value: mode });
              }}
            />
          </View>
        </View>

        {/* Bottom section anchored at bottom */}
        <View className="w-full gap-2.5 mt-6">
          <Pressable
            className="w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40"
            onPress={onNext}>
            <Text className="font-montserrat-bold text-[15px] text-white">
              {"Hoàn tất & Khám phá CaloViet AI"}
            </Text>
            <ArrowRight size={18} color="#FFF" />
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
