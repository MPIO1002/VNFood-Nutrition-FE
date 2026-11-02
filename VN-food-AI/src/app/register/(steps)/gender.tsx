import { MetabolismRequest, SexForEquation } from "@/api/generated/model";
import { useUserHealthInformationContext } from "@/features/health-register";
import HealthRegisterNextButton from "@/features/health-register/components/HealthNextButton";
import FemaleGenderBox from "@/features/health-register/gender/components/FemaleGenderBox";
import MaleGenderBox from "@/features/health-register/gender/components/MaleGenderBox";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputGenderScreen() {
  const insets = useSafeAreaInsets();
  const { markReady, assginMultipleMetabolismFieldData } =
    useUserHealthInformationContext();
  const [choice, setChoice] = useState<SexForEquation>("male");

  useEffect(() => {
    markReady("gender");
  }, []);

  const onNext = () => {
    const data: Partial<MetabolismRequest> = {
      sex_for_equation: choice,
      competitive_athlete: false,
      pregnant_or_breastfeeding: false,
      metabolism_affecting_condition: false,
    };

    assginMultipleMetabolismFieldData(data);
    router.push("/register/(steps)/age");
  };

  return (
    <View
      className="bg-gray-100 flex-1 px-5 gap-2"
      style={{
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 16),
      }}>
      <View className="w-full">
        <Text className="font-montserrat-bold text-xl text-charcoal-pure">
          Giới tính sinh học của bạn là gì ?
        </Text>
        <Text className="font-montserrat text-sm text-gray-400 mt-1">
          Giới tính sinh học quyết định trực tiếp đến tỷ lệ trao đổi chất cơ bản
          (BMR) và công thức tính năng lượng tiêu hao chuẩn khoa học.
        </Text>
      </View>
      <View className="w-full gap-5 mt-2">
        <MaleGenderBox
          activated={choice === "male"}
          onPress={() => {
            setChoice("male");
          }}
        />
        <FemaleGenderBox
          activated={choice === "female"}
          onPress={() => setChoice("female")}
        />
      </View>
      <HealthRegisterNextButton
        title="Tiếp tục (Chọn độ tuổi)"
        onNext={onNext}
      />
    </View>
  );
}
