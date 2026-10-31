import { useUserHealthInformationContext } from "@/features/health-register";
import HealthRegisterNextButton from "@/features/health-register/components/HealthNextButton";
import CmSliderRuler from "@/features/health-register/height/CmSliderRuler";
import FtSliderRuler from "@/features/health-register/height/FtSliderRuler";
import { router } from "expo-router";
import { Dot } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputHeightScreen() {
  const insets = useSafeAreaInsets();
  const { markReady, assignMetabolismFieldData } =
    useUserHealthInformationContext();

  const [isCmMode, setIsCmMode] = useState(true);
  const [isCmRulerReady, setIsCmRulerReady] = useState(false);
  const cmValue = useRef(0);

  const [isFtRulerReady, setIsFtRulerReady] = useState(false);
  const ftValue = useRef(0);

  useEffect(() => {
    if (isCmRulerReady && isFtRulerReady) markReady("height");
  }, [isCmRulerReady, isFtRulerReady]);

  const onNext = () => {
    assignMetabolismFieldData({
      field: "height_cm",
      value: isCmMode ? cmValue.current : ftValue.current,
    });

    router.push("/register/(steps)/activity");
  };

  return (
    <View
      className="bg-gray-100 w-screen flex-1 px-5"
      style={{
        paddingBottom: Math.max(insets.bottom, 16),
      }}>
      <View className="w-full">
        <Text className="font-montserrat-bold text-2xl text-charcoal-pure">
          Chiều cao hiện tại của bạn là bao nhiêu ?
        </Text>
        <Text className="font-montserrat text-sm text-gray-400 mt-1">
          CaloViet AI sử dụng chỉ số này để tính mức chuyển hóa cơ bản (BMR) và
          định lượng thâm hụt năng lượng chính xác.
        </Text>
      </View>

      <View className="w-full flex-1 my-3 p-5 bg-white rounded-[24px] shadow-sm justify-between relative">
        <View className="flex-row rounded-full bg-gray-200 p-0.5 top-4 left-4 absolute">
          <TouchableOpacity
            className={`py-1.5 px-4 rounded-full items-center justify-center ${isCmMode ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
            onPress={() => setIsCmMode(true)}>
            <Text
              className={`font-montserrat-medium text-sm ${isCmMode ? "text-white" : "text-zinc-500"}`}>
              cm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-1.5 px-3 rounded-full items-center justify-center ${!isCmMode ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
            onPress={() => setIsCmMode(false)}>
            <View className="flex-row items-center">
              <Text
                className={`font-montserrat-medium text-sm ${!isCmMode ? "text-white" : "text-zinc-500"}`}>
                ft
              </Text>
              <Dot width={10} color={!isCmMode ? "#fff" : "#71717A"}></Dot>
              <Text
                className={`font-montserrat-medium text-sm ${!isCmMode ? "text-white" : "text-zinc-500"}`}>
                in
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="relative h-[300px]">
          <View
            className="absolute inset-0"
            style={{ opacity: isCmMode ? 1 : 0 }}
            pointerEvents={isCmMode ? "auto" : "none"}>
            <CmSliderRuler
              className="w-full"
              onReady={() => setIsCmRulerReady(true)}
              onValueChange={(v) => {
                cmValue.current = v;
              }}
            />
          </View>
          <View
            className="absolute inset-0"
            style={{ opacity: isCmMode ? 0 : 1 }}
            pointerEvents={isCmMode ? "none" : "auto"}>
            <FtSliderRuler
              className="w-full h-[300px]"
              onReady={() => setIsFtRulerReady(true)}
              onValueChange={(v) => {
                ftValue.current = v;
              }}
            />
          </View>
        </View>
      </View>
      <HealthRegisterNextButton
        title="Tiếp tục (Chọn mục tiêu)"
        onNext={onNext}
      />
    </View>
  );
}
