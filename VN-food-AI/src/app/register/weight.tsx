import {
  SliderRulerController,
  SliderRulerProps,
} from "@/components/slider/ruler/ruler";
import { WeightSliderRuler } from "@/components/slider/ruler/WeightSliderRuler";
import { router } from "expo-router";
import { ArrowRight, Minus, Plus } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function InputWeightScreen() {
  const [isKgMode, setIsKgMode] = useState(true);
  const kgRulerController = useRef<SliderRulerController | null>(null);
  const lbsRulerController = useRef<SliderRulerController | null>(null);

  const kgProps: SliderRulerProps = {
    min: 1,
    max: 300,
    initialValue: 1,
    step: 0.5,
    unitLabel: "kg",
    controlRef: kgRulerController,
  };

  const lbsProps = {
    min: 2.2,
    max: 661,
    initialValue: 2.2,
    step: 2.20462,
    unitLabel: "lbs",
    controlRef: lbsRulerController,
  };

  return (
    <View className="bg-gray-100 w-screen h-screen px-3">
      <View className="w-full">
        <Text className="font-montserrat-bold text-2xl">
          Cân nặng hiện tại của bạn là bao nhiêu ?
        </Text>
        <Text className="font-montserrat text-sm text-gray-400">
          CaloViet AI sử dụng chỉ số này để tính mức chuyển hóa cơ bản (BMR) và
          định lượng thâm hụt năng lượng chính xác.
        </Text>
      </View>
      <View className="flex-row w-full h-fit justify-center p-1.5">
        <TouchableOpacity
          className={`w-fit h-fit py-3 px-5 rounded-full items-center justify-center ${isKgMode ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
          onPress={() => setIsKgMode(true)}>
          <Text
            className={`font-montserrat-medium text-sm ${isKgMode ? "text-white" : "text-zinc-500"}`}>
            kg
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-fit h-fit py-3 px-5 rounded-full items-center justify-center ${!isKgMode ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
          onPress={() => setIsKgMode(false)}>
          <Text
            className={`font-montserrat-medium text-sm ${!isKgMode ? "text-white" : "text-zinc-500"}`}>
            lbs
          </Text>
        </TouchableOpacity>
      </View>
      {isKgMode ? (
        <View className="w-full h-[270px] p-3 bg-white rounded">
          <GestureHandlerRootView>
            <WeightSliderRuler {...kgProps} />
          </GestureHandlerRootView>
          <View className="w-full p-3 gap-2 flex-row justify-center items-center">
            <Pressable
              className="w-[50px] h-[50px] rounded-full bg-gray-300 items-center justify-center active:opacity-40"
              onPress={() => kgRulerController.current?.stepBy?.(-1)}>
              <Minus color={"black"}></Minus>
            </Pressable>
            <View className="flex-grow">
              <Text className="font-montserrat">{`Chạm để tinh chỉnh ±${kgProps.step || 0}kg`}</Text>
            </View>
            <Pressable
              className="w-[50px] h-[50px] rounded-full bg-gray-300 items-center justify-center active:opacity-40"
              onPress={() => kgRulerController.current?.stepBy?.(1)}>
              <Plus color={"black"}></Plus>
            </Pressable>
          </View>
        </View>
      ) : (
        <View className="w-full h-[270px] p-3 bg-white rounded">
          <GestureHandlerRootView>
            <WeightSliderRuler {...lbsProps} tickGap={40} />
          </GestureHandlerRootView>
          <View className="w-full p-3 gap-2 flex-row justify-center items-center">
            <Pressable
              className="w-[50px] h-[50px] rounded-full bg-gray-300 items-center justify-center active:opacity-40"
              onPress={() => lbsRulerController.current?.stepBy?.(-1)}>
              <Minus color={"black"}></Minus>
            </Pressable>
            <View className="flex-grow">
              <Text className="font-montserrat">{`Chạm để tinh chỉnh ±${lbsProps.step.toFixed(2) || 0}lbs`}</Text>
            </View>
            <Pressable
              className="w-[50px] h-[50px] rounded-full bg-gray-300 items-center justify-center active:opacity-40"
              onPress={() => lbsRulerController.current?.stepBy?.(1)}>
              <Plus color={"black"}></Plus>
            </Pressable>
          </View>
        </View>
      )}
      <Pressable
        className="w-full bg-charcoal-pure rounded-xl h-14 mt-10 flex-row items-center justify-center gap-2 active:opacity-40"
        onPress={() => router.push("/register/height")}>
        <Text className="font-montserrat-bold text-[15px] text-white">
          {"Tiếp tục (Chọn chiều cao)"}
        </Text>
        <ArrowRight size={18} color="#FFF" />
      </Pressable>
    </View>
  );
}
