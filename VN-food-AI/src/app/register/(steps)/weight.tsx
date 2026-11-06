import { WeightUnit } from "@/api/generated/model";
import { useUserHealthInformationContext } from "@/features/health-register";
import HealthRegisterNextButton from "@/features/health-register/components/HealthNextButton";
import KgSliderRuler from "@/features/health-register/weight/KgSliderRuler";
import LbsSliderRuler from "@/features/health-register/weight/LbsSliderRuler";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputWeightScreen() {
  const insets = useSafeAreaInsets();
  const { markReady, assginMultipleMetabolismFieldData } =
    useUserHealthInformationContext();
  const [mode, setMode] = useState<WeightUnit>("kg");

  const [isKgRulerReady, setIsKgRulerReady] = useState(false);
  const kgValue = useRef(0);
  const [isLbsRulerReady, setIsLbsRulerReady] = useState(false);
  const lbsValue = useRef(0);

  useEffect(() => {
    if (isLbsRulerReady) markReady("weight");
  }, [isKgRulerReady, isLbsRulerReady]);

  const onNext = () => {
    assginMultipleMetabolismFieldData({
      weight: mode === "kg" ? kgValue.current : lbsValue.current,
      weight_unit: mode,
    });

    router.push("/register/(steps)/height");
  };

  return (
    <View
      className="bg-gray-100 flex-1 px-5"
      style={{
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 16),
      }}>
      <View className="w-full">
        <Text className="font-montserrat-bold text-2xl text-charcoal-pure">
          Cân nặng hiện tại của bạn là bao nhiêu ?
        </Text>
        <Text className="font-montserrat text-sm text-gray-400 mt-1">
          CaloViet AI sử dụng chỉ số này để tính mức chuyển hóa cơ bản (BMR) và
          định lượng thâm hụt năng lượng chính xác.
        </Text>
      </View>

      <View className="w-full flex-1 my-3 p-5 bg-white rounded-[24px] shadow-sm justify-between relative">
        <View className="flex-row rounded-full bg-gray-200 p-0.5 absolute top-4 left-4 z-30">
          <TouchableOpacity
            className={`py-1.5 px-4 rounded-full items-center justify-center ${mode === "kg" ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
            onPress={() => setMode("kg")}>
            <Text
              className={`font-montserrat-medium text-sm ${mode === "kg" ? "text-white" : "text-zinc-500"}`}>
              kg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-1.5 px-4 rounded-full items-center justify-center ${mode === "lbs" ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
            onPress={() => setMode("lbs")}>
            <Text
              className={`font-montserrat-medium text-sm ${mode === "lbs" ? "text-white" : "text-zinc-500"}`}>
              lbs
            </Text>
          </TouchableOpacity>
        </View>
        <View className="relative">
          <View
            className="absolute inset-0"
            style={{ opacity: mode === "kg" ? 1 : 0 }}
            pointerEvents={mode === "kg" ? "auto" : "none"}>
            <KgSliderRuler
              className="w-full h-[300px]"
              onReady={() => setIsKgRulerReady(true)}
              onValueChange={(v) => {
                kgValue.current = v;
              }}
            />
          </View>
          <View
            className="absolute inset-0"
            style={{ opacity: mode === "lbs" ? 1 : 0 }}
            pointerEvents={mode === "lbs" ? "auto" : "none"}>
            <LbsSliderRuler
              className="w-full h-[300px]"
              onReady={() => setIsLbsRulerReady(true)}
              onValueChange={(v) => {
                lbsValue.current = v;
              }}
            />
          </View>
        </View>
      </View>
      <HealthRegisterNextButton
        title="Tiếp tục (Chọn chiều cao)"
        onNext={onNext}
      />
    </View>
  );
}
