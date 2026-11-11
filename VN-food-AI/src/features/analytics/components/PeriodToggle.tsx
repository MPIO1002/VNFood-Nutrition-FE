import { Pressable, Text, View } from "react-native";
import type { AnalyticsPeriod } from "../utils/date-range";

export function PeriodToggle({
  period,
  onChange,
}: {
  period: AnalyticsPeriod;
  onChange: (period: AnalyticsPeriod) => void;
}) {
  return (
    <View className="flex-row items-center rounded-full bg-zinc-100 p-1">
      {(["week", "month"] as const).map((value) => {
        const selected = period === value;
        return (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className={`rounded-full px-5 py-2 ${selected ? "bg-charcoal-pure" : ""}`}
            onPress={() => onChange(value)}>
            <Text
              className={`font-montserrat-semibold text-xs ${selected ? "font-montserrat-bold text-white" : "text-zinc-500"}`}>
              {value === "week" ? "Tuần" : "Tháng"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
