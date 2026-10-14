import { HeightSliderRuler } from "@/components/slider/ruler/HeightSliderRuler";
import {
  SliderRulerController,
  SliderRulerProps,
} from "@/components/slider/ruler/ruler";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight, Dot, Minus, Plus } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InputHeightScreen() {
  const [isCmMode, setIsCmMode] = useState(true);
  const cmRulerController = useRef<SliderRulerController | null>(null);
  const ftRulerController = useRef<SliderRulerController | null>(null);
  const screenScrollRef = useRef<ScrollView | null>(null);

  const cmProps: SliderRulerProps = {
    min: 100,
    max: 250,
    initialValue: 1,
    step: 1,
    unitLabel: "cm",
    controlRef: cmRulerController,
    externalScrollRef: screenScrollRef,
  };

  const ftProps = {
    min: 39,
    max: 98,
    initialValue: 1,
    step: 1,
    unitLabel: "in",
    controlRef: ftRulerController,
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FDFDFE]" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          ref={screenScrollRef}>
          <View className="bg-gray-100 w-screen flex-1 px-3">
            <View className="w-full">
              <Text className="font-montserrat-bold text-2xl">
                Cân nặng hiện tại của bạn là bao nhiêu ?
              </Text>
              <Text className="font-montserrat text-sm text-gray-400">
                CaloViet AI sử dụng chỉ số này để tính mức chuyển hóa cơ bản
                (BMR) và định lượng thâm hụt năng lượng chính xác.
              </Text>
            </View>
            <View className="flex-row w-full h-fit justify-center p-1.5">
              <TouchableOpacity
                className={`w-fit h-fit py-3 px-5 rounded-full items-center justify-center ${isCmMode ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
                onPress={() => setIsCmMode(true)}>
                <Text
                  className={`font-montserrat-medium text-sm ${isCmMode ? "text-white" : "text-zinc-500"}`}>
                  cm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`w-fit h-fit py-3 px-5 rounded-full items-center justify-center ${!isCmMode ? "bg-charcoal-pure shadow-sm" : "shadow-none"}`}
                onPress={() => setIsCmMode(false)}>
                <View className="flex-row justify-center items-center w-fit">
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
            <View className="w-full">
              <View className="w-full h-[300px] relative">
                <View
                  className="absolute inset-0 p-3 bg-white rounded"
                  style={{ opacity: isCmMode ? 1 : 0 }}
                  pointerEvents={isCmMode ? "auto" : "none"}>
                  <GestureHandlerRootView>
                    <HeightSliderRuler key="cm-ruler" {...cmProps} />
                  </GestureHandlerRootView>
                </View>
                <View
                  className="absolute inset-0 p-3 bg-white rounded"
                  style={{ opacity: isCmMode ? 0 : 1 }}
                  pointerEvents={isCmMode ? "none" : "auto"}>
                  <GestureHandlerRootView>
                    <HeightSliderRuler key="ft-ruler" {...ftProps} />
                  </GestureHandlerRootView>
                </View>
              </View>
              <View className="w-full p-3 gap-2 flex-row justify-center items-center">
                <Pressable
                  className="w-[50px] h-[50px] rounded-full bg-gray-300 items-center justify-center active:opacity-40"
                  onPress={() =>
                    (isCmMode
                      ? cmRulerController.current
                      : ftRulerController.current
                    )?.stepBy?.(-1)
                  }>
                  <Minus color={"black"} />
                </Pressable>
                <View className="flex-grow">
                  <Text className="font-montserrat text-center">
                    {`Chạm để tinh chỉnh ±${isCmMode ? cmProps.step : ftProps.step}${isCmMode ? cmProps.unitLabel : ftProps.unitLabel}`}
                  </Text>
                </View>
                <Pressable
                  className="w-[50px] h-[50px] rounded-full bg-gray-300 items-center justify-center active:opacity-40"
                  onPress={() =>
                    (isCmMode
                      ? cmRulerController.current
                      : ftRulerController.current
                    )?.stepBy?.(1)
                  }>
                  <Plus color={"black"} />
                </Pressable>
              </View>
            </View>
            <View className="w-full gap-2">
              <Pressable
                className="w-full bg-charcoal-pure rounded-xl h-14 mt-10 flex-row items-center justify-center gap-2 active:opacity-40"
                onPress={() => router.push("/register/plan")}>
                <Text className="font-montserrat-bold text-[15px] text-white">
                  {"Tiếp tục (Chọn chiều cao)"}
                </Text>
                <ArrowRight size={18} color="#FFF" />
              </Pressable>
              <Pressable
                className="w-full rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40"
                onPress={() => {
                  if (router.canGoBack()) router.back();
                }}>
                <ArrowLeft size={18} color="#9ca3af" />
                <Text className="font-montserrat-medium text-[15px] text-gray-400">
                  {"Quay lại bước 1 (Cân nặng)"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
