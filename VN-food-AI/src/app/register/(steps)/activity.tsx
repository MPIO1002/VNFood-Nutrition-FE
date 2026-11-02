import { ActivityLevel } from "@/api/generated/model";
import { useUserHealthInformationContext } from "@/features/health-register";
import ActiveLevelBoxLevelBox from "@/features/health-register/activity/components/ActiveLevelBox";
import LightLevelBoxLevelBox from "@/features/health-register/activity/components/LightLevelBox";
import ModerateLevelBoxLevelBox from "@/features/health-register/activity/components/ModerateLevelBox";
import SedentaryLevelBoxLevelBox from "@/features/health-register/activity/components/SedentaryLevelBox";
import VeryActiveLevelBoxLevelBox from "@/features/health-register/activity/components/VeryActiveLevelBox";
import HealthRegisterNextButton from "@/features/health-register/components/HealthNextButton";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputActivityLevel() {
  const insets = useSafeAreaInsets();
  const { markReady, assignMetabolismFieldData } =
    useUserHealthInformationContext();
  const [choice, setChoice] = useState<ActivityLevel>("moderate");

  useEffect(() => {
    markReady("activity");
  }, []);

  const onNext = () => {
    assignMetabolismFieldData({
      field: "activity_level",
      value: choice,
    });
    router.push("/register/(steps)/plan");
  };
  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
        paddingBottom: Math.max(insets.bottom, 16),
      }}
      showsVerticalScrollIndicator={false}>
      <View
        className="bg-gray-100 flex-1 px-5 gap-2"
        style={{
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 16),
        }}>
        <View className="w-full">
          <Text className="font-montserrat-bold text-xl text-charcoal-pure">
            Mức độ vận động hàng tuần của bạn ?
          </Text>
          <Text className="font-montserrat text-sm text-gray-400 mt-1">
            CaloViet AI nhân hệ số vận động (PAL) với BMR để tính chính xác
            lượng Calo tiêu hao thực tế (TDEE).
          </Text>
        </View>
        <View className="w-full gap-5 mt-2">
          <SedentaryLevelBoxLevelBox
            activated={choice === "sedentary"}
            onPress={() => setChoice("sedentary")}
          />
          <LightLevelBoxLevelBox
            activated={choice === "light"}
            onPress={() => setChoice("light")}
          />
          <ModerateLevelBoxLevelBox
            activated={choice === "moderate"}
            onPress={() => setChoice("moderate")}
          />
          <ActiveLevelBoxLevelBox
            activated={choice === "active"}
            onPress={() => setChoice("active")}
          />
          <VeryActiveLevelBoxLevelBox
            activated={choice === "very_active"}
            onPress={() => setChoice("very_active")}
          />
        </View>
        <HealthRegisterNextButton
          title="Tiếp tục (Chọn mục tiêu vóc dáng)"
          onNext={onNext}
        />
      </View>
    </ScrollView>
  );
}
