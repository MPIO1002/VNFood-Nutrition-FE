import {
  NumberSliderRuler,
  NumberSliderRulerProps,
} from "@/components/slider/ruler/NumberSliderRuler";
import { useUserHealthInformationContext } from "@/features/health-register";
import HealthRegisterNextButton from "@/features/health-register/components/HealthNextButton";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputAgeScreen() {
  const INITIAL_AGE = 25;
  const [age, setAge] = useState(INITIAL_AGE);
  const { markReady, assignMetabolismFieldData } =
    useUserHealthInformationContext();
  const insets = useSafeAreaInsets();

  const onReady = () => {
    markReady("age");
  };

  const onAgeChange = (value: number) => {
    setAge(value);
  };

  const ageProps: NumberSliderRulerProps = {
    min: 10,
    max: 100,
    initialValue: INITIAL_AGE,
    step: 1,
    onFinishLoading: onReady,
    onChange: onAgeChange,
  };
  const onNext = () => {
    assignMetabolismFieldData({
      field: "age",
      value: age,
    });
    router.push("/register/(steps)/weight");
  };

  return (
    <View
      className="bg-gray-100 flex-1 px-5 gap-2"
      style={{
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 16),
      }}>
      <View className="w-full">
        <Text className="font-montserrat-bold text-2xl text-charcoal-pure">
          Bạn bao nhiêu tuổi ?
        </Text>
        <Text className="font-montserrat text-sm text-gray-400 mt-1">
          Độ tuổi ảnh hưởng đến tốc độ chuyển hoá năng lượng tự nhiên và nhu cầu
          tổng hợp protein của cơ thể.
        </Text>
        <View className="w-full my-3 p-5 bg-white rounded-[24px] shadow-sm relative">
          <View className="w-full h-[200px]">
            <NumberSliderRuler {...ageProps} />
          </View>
        </View>
      </View>
      <HealthRegisterNextButton
        title="Tiếp tục (Chọn cân nặng)"
        onNext={onNext}
      />
    </View>
  );
}
