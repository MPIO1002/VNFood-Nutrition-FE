import { CalendarCheck, Flame, Utensils } from "lucide-react-native";
import { Text, View } from "react-native";
import type { AnalyticsMetrics } from "../hooks/useAnalytics";
import type { AnalyticsPeriod } from "../utils/date-range";

const numberFormat = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
const percentFormat = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 1,
});

function LogStat({
  icon: Icon,
  value,
  label,
  detail,
  color,
}: {
  icon: typeof Flame;
  value: string;
  label: string;
  detail: string;
  color: string;
}) {
  return (
    <View className="flex-1 items-center">
      <Icon size={21} color={color} />
      <Text className="mt-2 font-montserrat-bold text-2xl text-charcoal-pure">
        {value}
      </Text>
      <Text className="font-montserrat-semibold text-xs text-charcoal-pure">
        {label}
      </Text>
      <Text className="mt-1 text-center font-montserrat text-[10px] text-zinc-400">
        {detail}
      </Text>
    </View>
  );
}

export function WeeklyLogCard({
  period,
  metrics,
}: {
  period: AnalyticsPeriod;
  metrics: AnalyticsMetrics;
}) {
  const periodLabel = period === "week" ? "tuần" : "tháng";

  return (
    <View className="rounded-[24px] border border-border-hairline bg-canvas-white p-5">
      <View className="flex-row items-center justify-between">
        <Text className="font-montserrat-semibold text-xs uppercase tracking-wider text-zinc-400">
          Nhật ký {periodLabel}
        </Text>
        <Text className="font-montserrat text-xs text-zinc-500">
          {metrics.adherencePercent === null
            ? "Chưa có mục tiêu"
            : `Đạt mục tiêu ${percentFormat.format(metrics.adherencePercent)}%`}
        </Text>
      </View>
      <View className="mt-5 flex-row">
        <LogStat
          icon={Utensils}
          value={numberFormat.format(metrics.mealCount)}
          label="Bữa ăn"
          detail="đã ghi nhận"
          color="#52525B"
        />
        <View className="w-px bg-zinc-100" />
        <LogStat
          icon={CalendarCheck}
          value={`${metrics.daysLogged}/${metrics.daysInPeriod}`}
          label="Ngày log"
          detail="ngày có bữa ăn"
          color="#059669"
        />
        <View className="w-px bg-zinc-100" />
        <LogStat
          icon={Flame}
          value={numberFormat.format(metrics.averageDailyCalories)}
          label="TB / ngày"
          detail="kcal mỗi ngày"
          color="#F59E0B"
        />
      </View>
    </View>
  );
}
