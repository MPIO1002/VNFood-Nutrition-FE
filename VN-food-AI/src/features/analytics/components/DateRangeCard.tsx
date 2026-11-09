import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export function DateRangeCard() {
  return (
    <View className="flex-row items-center justify-between rounded-2xl border border-border-hairline bg-canvas-white px-3 py-4">
      <Pressable className="h-9 w-9 items-center justify-center">
        <ChevronLeft size={22} color="#18181B" />
      </Pressable>
      <View className="items-center">
        <Text className="font-montserrat-bold text-base text-charcoal-pure">
          19/10 — 25/10/2026
        </Text>
        <Text className="mt-1 font-montserrat text-xs text-zinc-400">
          Chu kỳ ghi nhận tiêu chuẩn
        </Text>
      </View>
      <Pressable className="h-9 w-9 items-center justify-center">
        <ChevronRight size={22} color="#18181B" />
      </Pressable>
    </View>
  );
}
