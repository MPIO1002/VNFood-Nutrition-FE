import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import type { AnalyticsDateRange } from "../utils/date-range";

export function DateRangeCard({
  range,
  onPrevious,
  onNext,
  canGoNext,
}: {
  range: AnalyticsDateRange;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl border border-border-hairline bg-canvas-white px-3 py-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kỳ trước"
        className="h-9 w-9 items-center justify-center"
        onPress={onPrevious}>
        <ChevronLeft size={22} color="#18181B" />
      </Pressable>
      <View className="items-center">
        <Text className="font-montserrat-bold text-base text-charcoal-pure">
          {range.label}
        </Text>
        <Text className="mt-1 font-montserrat text-xs text-zinc-400">
          {range.subtitle}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kỳ tiếp theo"
        accessibilityState={{ disabled: !canGoNext }}
        className={`h-9 w-9 items-center justify-center ${canGoNext ? "" : "opacity-30"}`}
        disabled={!canGoNext}
        onPress={onNext}>
        <ChevronRight size={22} color={canGoNext ? "#18181B" : "#A1A1AA"} />
      </Pressable>
    </View>
  );
}
