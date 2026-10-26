import { AnimatedTextInput } from "@/components/animated-components";
import { SliderRulerController } from "@/components/slider/ruler/ruler";
import {
  WeightSliderRuler,
  WeightSliderRulerProps,
} from "@/components/slider/ruler/WeightSliderRuler";
import { useUserHealthInformationContext } from "@/features/health-register";
import { router } from "expo-router";
import { ArrowRight, LockIcon, Minus, Plus } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAnimatedProps, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputWeightScreen() {
  const insets = useSafeAreaInsets();
  const { markReady } = useUserHealthInformationContext();
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
    initialValue: 50,
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
    initialValue: 50,
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

  useEffect(() => {
    if (isKgRulerReady && isLbsRulerReady) markReady("weight");
  }, [isKgRulerReady, isLbsRulerReady]);

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

      {/* Main Card expanding to fit between top content and bottom button */}
      <View className="w-full flex-1 my-3 p-5 bg-white rounded-[24px] shadow-sm justify-between">
        {/* Header row: Switch & Big number */}
        <View className="w-full flex-row items-center justify-between h-[52px]">
          <View className="flex-row rounded-full bg-gray-200 p-0.5">
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

          {/* Number display vertically centered in header row */}
          <View className="flex-row items-center justify-end h-full">
            <View
              className="flex-row items-baseline justify-end absolute right-0"
              style={{ opacity: isKgMode ? 1 : 0 }}
              pointerEvents={isKgMode ? "auto" : "none"}>
              <AnimatedTextInput
                editable={false}
                scrollEnabled={false}
                multiline={false}
                animatedProps={kgTextProps}
                className="text-[38px] font-montserrat-bold text-black text-right"
                style={{
                  fontFamily: "Montserrat_700Bold",
                  includeFontPadding: false,
                  padding: 0,
                  margin: 0,
                  minWidth: 140,
                  textAlign: "right",
                }}
              />
              {kgProps.unitLabel && (
                <Text className="text-[18px] font-montserrat-medium text-zinc-400 ml-1.5">
                  {kgProps.unitLabel}
                </Text>
              )}
            </View>
            <View
              className="flex-row items-baseline justify-end absolute right-0"
              style={{ opacity: !isKgMode ? 1 : 0 }}
              pointerEvents={!isKgMode ? "auto" : "none"}>
              <AnimatedTextInput
                editable={false}
                scrollEnabled={false}
                multiline={false}
                animatedProps={lbsTextProps}
                className="text-[38px] font-montserrat-bold text-black text-right"
                style={{
                  fontFamily: "Montserrat_700Bold",
                  includeFontPadding: false,
                  padding: 0,
                  margin: 0,
                  minWidth: 140,
                  textAlign: "right",
                }}
              />
              {lbsProps.unitLabel && (
                <Text className="text-[18px] font-montserrat-medium text-zinc-400 ml-1.5">
                  {lbsProps.unitLabel}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Ruler area centered in available card space */}
        <View className="w-full flex-1 justify-center items-center my-2">
          <View className="w-full h-[150px] relative">
            <View
              className="absolute inset-0"
              style={{ opacity: isKgMode ? 1 : 0 }}
              pointerEvents={isKgMode ? "auto" : "none"}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <WeightSliderRuler key="kg-ruler" {...kgProps} />
              </GestureHandlerRootView>
            </View>
            <View
              className="absolute inset-0"
              style={{ opacity: isKgMode ? 0 : 1 }}
              pointerEvents={isKgMode ? "none" : "auto"}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <WeightSliderRuler key="lbs-ruler" {...lbsProps} />
              </GestureHandlerRootView>
            </View>
          </View>
        </View>

        {/* Stepper buttons */}
        <View className="w-full flex-row justify-center items-center gap-3">
          <Pressable
            className="w-[44px] h-[44px] rounded-full bg-gray-200 items-center justify-center active:opacity-40"
            onPress={() =>
              (isKgMode
                ? kgRulerController.current
                : lbsRulerController.current
              )?.stepBy?.(-1)
            }>
            <Minus color={"black"} size={20} />
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="font-montserrat text-xs text-zinc-500 text-center">
              {`Chạm để tinh chỉnh ±${isKgMode ? kgProps.step : lbsProps.step?.toFixed(2)}${isKgMode ? kgProps.unitLabel : lbsProps.unitLabel}`}
            </Text>
          </View>
          <Pressable
            className="w-[44px] h-[44px] rounded-full bg-gray-200 items-center justify-center active:opacity-40"
            onPress={() =>
              (isKgMode
                ? kgRulerController.current
                : lbsRulerController.current
              )?.stepBy?.(1)
            }>
            <Plus color={"black"} size={20} />
          </Pressable>
        </View>
      </View>

      {/* Bottom section */}
      <View className="w-full gap-2.5">
        <Pressable
          className="w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40"
          onPress={() => router.push("/register/height")}>
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
