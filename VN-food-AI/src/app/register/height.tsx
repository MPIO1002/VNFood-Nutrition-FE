import { AnimatedTextInput } from "@/components/animated-components";
import {
  HeightSliderRuler,
  HeightSliderRulerProps,
} from "@/components/slider/ruler/HeightSliderRuler";
import { SliderRulerController } from "@/components/slider/ruler/ruler";
import { useUserHealthInformationContextController } from "@/context/register/hooks/useUserHealthInformationContext";
import { router } from "expo-router";
import {
  ArrowRight,
  Dot,
  LockIcon,
  Minus,
  Plus,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAnimatedProps, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputHeightScreen() {
  const insets = useSafeAreaInsets();
  const { markReady } = useUserHealthInformationContextController();

  const [isCmMode, setIsCmMode] = useState(true);
  const [isCmRulerReady, setIsCmRulerReady] = useState(false);
  const cmRulerController = useRef<SliderRulerController | null>(null);
  const cmScreenValue = useSharedValue<number>(0);

  const [isFtRulerReady, setIsFtRulerReady] = useState(false);
  const ftScreenValue = useSharedValue<number>(0);
  const ftRulerController = useRef<SliderRulerController | null>(null);

  const cmProps: HeightSliderRulerProps = {
    min: 50,
    max: 250,
    initialValue: 160,
    minorPerMediumSegment: 0,
    mediumPerMajorSegment: 4,
    step: 1,
    unitLabel: "cm",
    screenValue: cmScreenValue,
    onFinishLoading: () => setIsCmRulerReady(true),
    controlRef: cmRulerController,
  };

  const ftProps: HeightSliderRulerProps = {
    min: 50,
    max: 250,
    initialValue: 160,
    minorPerMediumSegment: 0,
    mediumPerMajorSegment: 4,
    step: 1,
    unitLabel: "in",
    onFinishLoading: () => setIsFtRulerReady(true),
    screenValue: ftScreenValue,
    controlRef: ftRulerController,
  };

  const cmTextProps = useAnimatedProps(() => {
    const v = cmScreenValue.value;
    return {
      text: String(v),
      defaultValue: String(v),
    };
  });

  const ftTextProps = useAnimatedProps(() => {
    const v = ftScreenValue.value;
    return {
      text: String(v),
      defaultValue: String(v),
    };
  });

  useEffect(() => {
    if (isCmRulerReady && isFtRulerReady) markReady("height");
  }, [isCmRulerReady, isFtRulerReady]);

  return (
    <View
      className="bg-gray-100 flex-1 px-5"
      style={{
        paddingTop: 8,
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

      {/* Main Card expanding to fit between top content and bottom button */}
      <View className="w-full flex-1 my-3 p-5 bg-white rounded-[24px] shadow-sm justify-between">
        {/* Header row: Unit toggle and big display */}
        <View className="w-full flex-row items-center justify-between h-[52px]">
          <View className="flex-row rounded-full bg-gray-200 p-0.5">
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
                <Dot
                  width={10}
                  color={!isCmMode ? "#fff" : "#71717A"}></Dot>
                <Text
                  className={`font-montserrat-medium text-sm ${!isCmMode ? "text-white" : "text-zinc-500"}`}>
                  in
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Number display vertically centered in header row */}
          <View className="flex-row items-center justify-end h-full">
            <View
              className="flex-row items-baseline justify-end absolute right-0"
              style={{ opacity: isCmMode ? 1 : 0 }}
              pointerEvents={isCmMode ? "auto" : "none"}>
              <AnimatedTextInput
                editable={false}
                scrollEnabled={false}
                multiline={false}
                animatedProps={cmTextProps}
                className="text-[38px] font-montserrat-bold text-black text-right"
                style={{
                  fontFamily: "Montserrat_700Bold",
                  includeFontPadding: false,
                  padding: 0,
                  margin: 0,
                  minWidth: 120,
                  textAlign: "right",
                }}
              />
              {cmProps.unitLabel && (
                <Text className="text-[18px] font-montserrat-medium text-zinc-400 ml-1.5">
                  {cmProps.unitLabel}
                </Text>
              )}
            </View>
            <View
              className="flex-row items-baseline justify-end absolute right-0"
              style={{ opacity: !isCmMode ? 1 : 0 }}
              pointerEvents={!isCmMode ? "auto" : "none"}>
              <AnimatedTextInput
                editable={false}
                scrollEnabled={false}
                multiline={false}
                animatedProps={ftTextProps}
                className="text-[38px] font-montserrat-bold text-black text-right"
                style={{
                  fontFamily: "Montserrat_700Bold",
                  includeFontPadding: false,
                  padding: 0,
                  margin: 0,
                  minWidth: 120,
                  textAlign: "right",
                }}
              />
              {ftProps.unitLabel && (
                <Text className="text-[18px] font-montserrat-medium text-zinc-400 ml-1.5">
                  {ftProps.unitLabel}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Ruler filling the middle area of the card */}
        <View className="w-full flex-1 my-2 relative">
          <View
            className="absolute inset-0"
            style={{ opacity: isCmMode ? 1 : 0 }}
            pointerEvents={isCmMode ? "auto" : "none"}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <HeightSliderRuler key="cm-ruler" {...cmProps} />
            </GestureHandlerRootView>
          </View>
          <View
            className="absolute inset-0"
            style={{ opacity: isCmMode ? 0 : 1 }}
            pointerEvents={isCmMode ? "none" : "auto"}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <HeightSliderRuler key="ft-ruler" {...ftProps} />
            </GestureHandlerRootView>
          </View>
        </View>

        {/* Stepper buttons */}
        <View className="w-full flex-row justify-center items-center gap-3">
          <Pressable
            className="w-[44px] h-[44px] rounded-full bg-gray-200 items-center justify-center active:opacity-40"
            onPress={() =>
              (isCmMode
                ? cmRulerController.current
                : ftRulerController.current
              )?.stepBy?.(-1)
            }>
            <Minus color={"black"} size={20} />
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="font-montserrat text-xs text-zinc-500 text-center">
              {`Chạm để tinh chỉnh ±${isCmMode ? cmProps.step : ftProps.step}${isCmMode ? cmProps.unitLabel : ftProps.unitLabel}`}
            </Text>
          </View>
          <Pressable
            className="w-[44px] h-[44px] rounded-full bg-gray-200 items-center justify-center active:opacity-40"
            onPress={() =>
              (isCmMode
                ? cmRulerController.current
                : ftRulerController.current
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
          onPress={() => router.push("/register/plan")}>
          <Text className="font-montserrat-bold text-[15px] text-white">
            {"Tiếp tục (Chọn mục tiêu)"}
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
