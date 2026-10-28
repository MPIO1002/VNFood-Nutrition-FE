import { useUserHealthInformationContext } from "@/features/health-register";
import KgSliderRuler from "@/features/health-register/weight/KgSliderRuler";
import LbsSliderRuler from "@/features/health-register/weight/LbsSliderRuler";
import { router } from "expo-router";
import { ArrowRight, LockIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputWeightScreen() {
  const insets = useSafeAreaInsets();
  const { markReady, assignMetabolismFieldData } =
    useUserHealthInformationContext();
  const [isKgMode, setIsKgMode] = useState(true);

  const [isKgRulerReady, setIsKgRulerReady] = useState(false);
  const kgValue = useRef(0);
  const [isLbsRulerReady, setIsLbsRulerReady] = useState(false);
  const lbsValue = useRef(0);

  useEffect(() => {
    if (isLbsRulerReady) markReady("weight");
  }, [isKgRulerReady, isLbsRulerReady]);

  const onNext = () => {
    assignMetabolismFieldData({
      field: "weight_kg",
      value: isKgMode ? kgValue.current : lbsValue.current,
    });

    router.push("/register/height");
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
            className={`py-1.5 px-4 rounded-full items-center justify-center ${isKgMode ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
            onPress={() => setIsKgMode(true)}>
            <Text
              className={`font-montserrat-medium text-sm ${isKgMode ? "text-white" : "text-zinc-500"}`}>
              kg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-1.5 px-4 rounded-full items-center justify-center ${!isKgMode ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
            onPress={() => setIsKgMode(false)}>
            <Text
              className={`font-montserrat-medium text-sm ${!isKgMode ? "text-white" : "text-zinc-500"}`}>
              lbs
            </Text>
          </TouchableOpacity>
        </View>
        <View className="relative">
          <View
            className="absolute inset-0"
            style={{ opacity: isKgMode ? 1 : 0 }}
            pointerEvents={isKgMode ? "auto" : "none"}>
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
            style={{ opacity: isKgMode ? 0 : 1 }}
            pointerEvents={isKgMode ? "none" : "auto"}>
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
      <View className="w-full gap-2.5">
        <Pressable
          className="w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40"
          onPress={onNext}>
          <Text className="font-montserrat-bold text-[15px] text-white">
            {"Tiếp tục (Chọn chiều cao)"}
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
    </View>
  );
}
