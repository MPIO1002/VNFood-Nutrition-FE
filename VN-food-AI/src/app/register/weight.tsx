import { AnimatedTextInput } from "@/components/animated-components";
import { SliderRulerController } from "@/components/slider/ruler/ruler";
import {
  WeightSliderRuler,
  WeightSliderRulerProps,
} from "@/components/slider/ruler/WeightSliderRuler";
import { router } from "expo-router";
import { ArrowRight, Minus, Plus } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAnimatedProps, useSharedValue } from "react-native-reanimated";

export default function InputWeightScreen() {
  const [isKgMode, setIsKgMode] = useState(true);

  const [isKgRulerReady, setIsKgRulerReady] = useState(false);
  const kgRulerController = useRef<SliderRulerController | null>(null);
  const kgScreenValue = useSharedValue<number>(0);

  const [isLbsRulerReady, setIsLbsRulerReady] = useState(false);
  const lbsRulerController = useRef<SliderRulerController | null>(null);
  const lbsScreenValue = useSharedValue<number>(0);

  const kgProps: WeightSliderRulerProps = {
    min: 10,
    max: 300,
    initialValue: 1,
    step: 0.5,
    minorPerMediumSegment: 1,
    mediumPerMajorSegment: 4,
    unitLabel: "kg",
    screenValue: kgScreenValue,
    onFinishLoading: () => setIsKgRulerReady(true),
    controlRef: kgRulerController,
  };

  const lbsProps: WeightSliderRulerProps = {
    min: 10,
    max: 300,
    initialValue: 2.2,
    step: 0.5,
    minorPerMediumSegment: 1,
    mediumPerMajorSegment: 4,
    unitLabel: "lbs",
    screenValue: lbsScreenValue,
    onFinishLoading: () => setIsLbsRulerReady(true),
    controlRef: lbsRulerController,
  };

  const kgTextProps = useAnimatedProps(() => {
    const v = kgScreenValue.value;
    return {
      text: v.toFixed(1),
      defaultValue: v.toFixed(1),
    };
  });

  const lbsTextProps = useAnimatedProps(() => {
    const v = lbsScreenValue.value;
    return {
      text: v.toFixed(1),
      defaultValue: v.toFixed(1),
    };
  });

  return (
    <View className="bg-gray-100 w-screen h-screen px-3 gap-5">
      <View className="w-full">
        <Text className="font-montserrat-bold text-2xl">
          Cân nặng hiện tại của bạn là bao nhiêu ?
        </Text>
        <Text className="font-montserrat text-sm text-gray-400">
          CaloViet AI sử dụng chỉ số này để tính mức chuyển hóa cơ bản (BMR) và
          định lượng thâm hụt năng lượng chính xác.
        </Text>
      </View>
      <View className="w-full p-3 bg-white rounded-2xl">
        <View className="w-full flex-row items-center px-2">
          <View className="w-1/2 flex-row">
            <View className="flex-row rounded-full bg-gray-200">
              <TouchableOpacity
                className={`py-2 px-5 rounded-full items-center justify-center ${isKgMode ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
                onPress={() => setIsKgMode(true)}>
                <Text
                  className={`font-montserrat-medium text-sm ${isKgMode ? "text-white" : "text-zinc-500"}`}>
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-2 px-5 rounded-full items-center justify-center ${!isKgMode ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
                onPress={() => setIsKgMode(false)}>
                <Text
                  className={`font-montserrat-medium text-sm ${!isKgMode ? "text-white" : "text-zinc-500"}`}>
                  lbs
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-1/2 justify-center">
            <View
              className="w-full flex-row absolute justify-end items-center"
              style={{ opacity: isKgMode ? 1 : 0 }}>
              <AnimatedTextInput
                editable={false}
                animatedProps={kgTextProps}
                className="text-[42px] font-mono text-black"
              />
              {kgProps.unitLabel && (
                <Text className="text-[20px] font-montserrat mt-5 opacity-50">
                  {kgProps.unitLabel}
                </Text>
              )}
            </View>
            <View
              className="w-full flex-row absolute justify-end items-center"
              style={{ opacity: !isKgMode ? 1 : 0 }}>
              <AnimatedTextInput
                editable={false}
                animatedProps={lbsTextProps}
                className="text-[42px] font-mono text-black"
              />
              {lbsProps.unitLabel && (
                <Text className="text-[20px] font-montserrat mt-5 opacity-50">
                  {lbsProps.unitLabel}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View className="w-full h-[200px] relative p-3 mt-10">
          <View
            className="absolute inset-0 p-3"
            style={{ opacity: isKgMode ? 1 : 0 }}
            pointerEvents={isKgMode ? "auto" : "none"}>
            <GestureHandlerRootView>
              <WeightSliderRuler key="kg-ruler" {...kgProps} />
            </GestureHandlerRootView>
          </View>
          <View
            className="absolute inset-0 p-3"
            style={{ opacity: isKgMode ? 0 : 1 }}
            pointerEvents={isKgMode ? "none" : "auto"}>
            <GestureHandlerRootView>
              <WeightSliderRuler key="lbs-ruler" {...lbsProps} />
            </GestureHandlerRootView>
          </View>
          <View className="absolute left-0 right-0 bottom-0 p-3 gap-2 flex-row justify-center items-center">
            <Pressable
              className="w-[50px] h-[50px] rounded-full bg-gray-300 items-center justify-center active:opacity-40"
              onPress={() =>
                (isKgMode
                  ? kgRulerController.current
                  : lbsRulerController.current
                )?.stepBy?.(-1)
              }>
              <Minus color={"black"} />
            </Pressable>
            <View className="flex-grow">
              <Text className="font-montserrat">
                {`Chạm để tinh chỉnh ±${isKgMode ? kgProps.step : lbsProps.step?.toFixed(2)}${isKgMode ? kgProps.unitLabel : lbsProps.unitLabel}`}
              </Text>
            </View>
            <Pressable
              className="w-[50px] h-[50px] rounded-full bg-gray-300 items-center justify-center active:opacity-40"
              onPress={() =>
                (isKgMode
                  ? kgRulerController.current
                  : lbsRulerController.current
                )?.stepBy?.(1)
              }>
              <Plus color={"black"} />
            </Pressable>
          </View>
        </View>
      </View>
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
