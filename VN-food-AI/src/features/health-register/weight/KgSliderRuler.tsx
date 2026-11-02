import { AnimatedTextInput } from "@/components/animated-components";
import { HorizontalSliderRuler } from "@/components/slider/ruler/HorizontalSliderRuler";
import { Minus, Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useKgSliderRuler } from "./hooks/useKgSliderRuler";

export interface KgSliderRulerProps {
  className?: string;
  onReady?: () => void;
  onValueChange?: (v: number) => void;
}

export default function KgSliderRuler({
  className,
  onReady,
  onValueChange,
}: KgSliderRulerProps) {
  const { kgTextProps, kgProps, kgRulerController } = useKgSliderRuler({
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

      <View className="w-full flex-1 justify-end items-center my-2">
        <View className="w-full h-[150px]">
          <GestureHandlerRootView style={{ flex: 1 }}>
            <HorizontalSliderRuler key="kg-ruler" {...kgProps} />
          </GestureHandlerRootView>
        </View>
      </View>

      <View className="w-full flex-row justify-center items-center gap-3">
        <Pressable
          className="w-[44px] h-[44px] rounded-full bg-gray-200 items-center justify-center active:opacity-40"
          onPress={() => kgRulerController.current?.stepBy?.(-1)}>
          <Minus color={"black"} size={20} />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="font-montserrat text-xs text-zinc-500 text-center">
            {`Chạm để tinh chỉnh ±${kgProps.step}${kgProps.unitLabel}`}
          </Text>
        </View>
        <Pressable
          className="w-[44px] h-[44px] rounded-full bg-gray-200 items-center justify-center active:opacity-40"
          onPress={() => kgRulerController.current?.stepBy?.(1)}>
          <Plus color={"black"} size={20} />
        </Pressable>
      </View>
    </View>
  );
}
