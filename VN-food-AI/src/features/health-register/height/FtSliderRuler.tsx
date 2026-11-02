import { AnimatedTextInput } from "@/components/animated-components";
import { VerticalSliderRuler } from "@/components/slider/ruler/VerticalSliderRuler";
import { Minus, Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFtSliderRuler } from "./hooks/useFtSliderRuler";

export interface FtSliderRulerProps {
  className?: string;
  onReady?: () => void;
  onValueChange?: (v: number) => void;
}

export default function FtSliderRuler({
  className,
  onReady,
  onValueChange,
}: FtSliderRulerProps) {
  const { ftProps, ftRulerController, ftTextProps } = useFtSliderRuler({
    onReady,
    onValueChange,
  });

  return (
    <View className={className ?? ""} style={{ position: "relative" }}>
      <View className="flex-row items-baseline justify-end">
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
      <View className="w-full my-2">
        <View className="w-full h-[230px]">
          <GestureHandlerRootView style={{ flex: 1 }}>
            <VerticalSliderRuler key="cm-ruler" {...ftProps} />
          </GestureHandlerRootView>
        </View>
      </View>
      <View className="w-full flex-row justify-center items-center gap-3 mt-2">
        <Pressable
          className="w-[44px] h-[44px] rounded-full bg-gray-200 items-center justify-center active:opacity-40"
          onPress={() => ftRulerController.current?.stepBy?.(-1)}>
          <Minus color={"black"} size={20} />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="font-montserrat text-xs text-zinc-500 text-center">
            {`Chạm để tinh chỉnh ±${ftProps.step}${ftProps.unitLabel}`}
          </Text>
        </View>
        <Pressable
          className="w-[44px] h-[44px] rounded-full bg-gray-200 items-center justify-center active:opacity-40"
          onPress={() => ftRulerController.current?.stepBy?.(1)}>
          <Plus color={"black"} size={20} />
        </Pressable>
      </View>
    </View>
  );
}
