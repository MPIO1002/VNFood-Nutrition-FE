import { CircleDot, Droplets, Dumbbell, Wheat } from "lucide-react-native";
import { Text, View } from "react-native";
import type { AnalyticsMetrics } from "../hooks/useAnalytics";
import type { AnalyticsPeriod } from "../utils/date-range";

const numberFormat = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });

export function MacroDistributionCard({
  period,
  metrics,
}: {
  period: AnalyticsPeriod;
  metrics: AnalyticsMetrics;
}) {
  const macros = [
    {
      label: "Chất đạm (Protein)",
      grams: metrics.totalProteinGrams,
      color: "#2563EB",
      Icon: Dumbbell,
    },
    {
      label: "Tinh bột (Carb)",
      grams: metrics.totalCarbGrams,
      color: "#F59E0B",
      Icon: Wheat,
    },
    {
      label: "Chất béo (Fat)",
      grams: metrics.totalFatGrams,
      color: "#F43F5E",
      Icon: Droplets,
    },
  ];
  const totalGrams = macros.reduce((total, macro) => total + macro.grams, 0);

  return (
    <View className="rounded-[24px] border border-border-hairline bg-canvas-white p-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <CircleDot size={22} color="#18181B" />
          <View>
            <Text className="font-montserrat-bold text-base text-charcoal-pure">
              Phân bố dinh dưỡng
            </Text>
            <Text className="mt-1 font-montserrat text-xs text-zinc-400">
              Tỷ trọng khối lượng theo kỳ
            </Text>
          </View>
        </View>
        <View className="rounded-lg bg-zinc-100 px-3 py-2">
          <Text className="font-montserrat-semibold text-xs text-zinc-600">
            {period === "week" ? "Tuần" : "Tháng"}
          </Text>
        </View>
      </View>
      <View className="mt-5 h-2 flex-row overflow-hidden rounded-full">
        {macros.map(({ label, grams, color }) => (
          <View
            key={label}
            style={{
              width: `${totalGrams > 0 ? (grams / totalGrams) * 100 : 0}%`,
              backgroundColor: color,
            }}
          />
        ))}
      </View>
      <View className="mt-4">
        {macros.map(({ label, grams, color, Icon }, index) => {
          const percentage = totalGrams > 0 ? (grams / totalGrams) * 100 : 0;
          return (
          <View
            key={label}
            className={`flex-row items-center py-3 ${index < macros.length - 1 ? "border-b border-zinc-100" : ""}`}>
            <Icon size={18} color={color} />
            <Text className="ml-3 flex-1 font-montserrat-semibold text-xs text-charcoal-pure">
              {label}
            </Text>
            <Text className="mr-5 font-montserrat text-xs text-zinc-400">
              {numberFormat.format(percentage)}%
            </Text>
            <Text className="font-montserrat-bold text-sm text-charcoal-pure">
              {numberFormat.format(grams)}g
            </Text>
          </View>
          );
        })}
      </View>
    </View>
  );
}
