import { BalancedPlanBox } from "@/components/plan/BalancedPlanBox";
import { GainWeightPlanBox } from "@/components/plan/GainWeightPlanBox";
import { LoseWeightPlanBox } from "@/components/plan/LoseWeightPlanBox";
import { useUserHealthInformationContextController } from "@/context/register/hooks/useUserHealthInformationContext";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight, LockIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlanChoiceScreen() {
  const { markReady } = useUserHealthInformationContextController();
  const [choice, setChoice] = useState(2);

  useEffect(() => {
    markReady("plan");
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="bg-gray-100 w-screen flex-1 px-3 gap-5">
            <View className="w-full">
              <Text className="font-montserrat-bold text-2xl">
                Mục tiêu vóc dáng của bạn là gì?
              </Text>
              <Text className="font-montserrat text-sm text-gray-400">
                Thuật toán CaloViet AI sẽ tự động phân bổ ngân sách calo và tỷ
                lệ đạm - đường - béo chuẩn cho cơ địa người Việt.
              </Text>
            </View>
            <View className="w-full flex-1 gap-5">
              <LoseWeightPlanBox
                activated={choice === 1}
                onPress={() => setChoice(1)}
              />
              <BalancedPlanBox
                activated={choice === 2}
                onPress={() => setChoice(2)}
              />
              <GainWeightPlanBox
                activated={choice === 3}
                onPress={() => setChoice(3)}
              />
            </View>
            <View className="w-full gap-2">
              <Pressable
                className="w-full bg-charcoal-pure rounded-xl h-14 mt-10 flex-row items-center justify-center gap-2 active:opacity-40"
                onPress={() => {
                  if (router.canDismiss()) router.dismissAll();
                  router.push("/(tabs)/analytics");
                }}>
                <Text className="font-montserrat-bold text-[15px] text-white">
                  {"Hoàn tất & Khám phá CaloViet AI"}
                </Text>
                <ArrowRight size={18} color="#FFF" />
              </Pressable>
              <Pressable
                className="w-full rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40"
                onPress={() => {
                  if (router.canGoBack()) router.back();
                }}>
                <ArrowLeft size={18} color="#9ca3af" />
                <Text className="font-montserrat-medium text-[15px] text-gray-400">
                  {"Quay lại bước 2 (Chiều cao)"}
                </Text>
              </Pressable>
            </View>
          </View>
          <View className="w-full flex-row items-center justify-center gap-2">
            <LockIcon size={10} color={"#9ca3af"}></LockIcon>
            <Text className="text-xs font-montserrat text-center text-gray-400">
              Dữ liệu được bảo mật an toàn cho lộ trình cá nhân
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
