import { Lightbulb, Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";
import type { AnalyticsMetrics } from "../hooks/useAnalytics";
import type { AnalyticsPeriod } from "../utils/date-range";

const numberFormat = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
const percentFormat = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 1,
});

export function InsightsCard({
  period,
  metrics,
}: {
  period: AnalyticsPeriod;
  metrics: AnalyticsMetrics;
}) {
  const periodLabel = period === "week" ? "tuần" : "tháng";
  const goalDifference =
    metrics.targetCalories === null
      ? null
      : metrics.targetCalories - metrics.totalCalories;
  const completion =
    metrics.adherencePercent ??
    (metrics.targetCalories && metrics.targetCalories > 0
      ? (metrics.totalCalories / metrics.targetCalories) * 100
      : null);

  return (
    <View className="rounded-[24px] border border-border-hairline bg-canvas-white p-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Lightbulb size={22} color="#059669" />
          <Text className="font-montserrat-bold text-base text-charcoal-pure">
            Nhận xét
          </Text>
        </View>
        <Sparkles size={22} color="#F59E0B" />
      </View>
      <View className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
        <Text className="font-montserrat text-sm leading-6 text-zinc-500">
          {metrics.targetCalories === null
            ? `Trong ${periodLabel}, bạn đã ghi nhận `
            : `Trong ${periodLabel}, bạn đã nạp `}
          <Text className="font-montserrat-bold text-charcoal-pure">
            {numberFormat.format(metrics.totalCalories)} kcal
          </Text>{" "}
          {metrics.targetCalories === null ? (
            <>và chưa có mục tiêu calo cho kỳ này.</>
          ) : (
            <>
              trên mục tiêu{" "}
              <Text className="font-montserrat-bold text-charcoal-pure">
                {numberFormat.format(metrics.targetCalories)} kcal
              </Text>
              {completion !== null && (
                <>
                  {" "}(
                  <Text className="font-montserrat-bold text-charcoal-pure">
                    {percentFormat.format(completion)}%
                  </Text>
                  )
                </>
              )}
              . {goalDifference !== null &&
                (goalDifference > 0
                  ? `Còn ${numberFormat.format(goalDifference)} kcal tới mục tiêu.`
                  : goalDifference < 0
                    ? `Vượt mục tiêu ${numberFormat.format(Math.abs(goalDifference))} kcal.`
                    : "Vừa đạt mục tiêu.")}
            </>
          )}
        </Text>
        <View className="my-3 h-px bg-zinc-200" />
        <Text className="font-montserrat text-sm leading-6 text-zinc-500">
          Nhật ký có dữ liệu trong{" "}
          <Text className="font-montserrat-bold text-charcoal-pure">
            {metrics.daysLogged} / {metrics.daysInPeriod}
          </Text>{" "}
          ngày, gồm{" "}
          <Text className="font-montserrat-bold text-charcoal-pure">
            {numberFormat.format(metrics.mealCount)} bữa ăn
          </Text>{" "}
          được ghi nhận trong kỳ.
        </Text>
      </View>
    </View>
  );
}
