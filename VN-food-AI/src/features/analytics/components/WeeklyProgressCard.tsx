import { Award, Flag, Flame, Gauge } from "lucide-react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { AnalyticsMetrics } from "../hooks/useAnalytics";
import type { AnalyticsPeriod } from "../utils/date-range";

const numberFormat = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
const percentFormat = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 1,
});

function StatColumn({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  detail,
  detailColor = "text-emerald-600",
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  suffix: string;
  color: string;
  detail: string;
  detailColor?: string;
}) {
  return (
    <View className="flex-1">
      <View className="mb-2 flex-row items-center gap-2">
        <Icon size={18} color={color} />
        <Text className="font-montserrat text-xs text-zinc-500">{label}</Text>
      </View>
      <View className="flex-row items-baseline">
        <Text className="font-montserrat-bold text-xl text-charcoal-pure">
          {value}
        </Text>
        <Text className="ml-1 font-montserrat text-xs text-zinc-500">
          {suffix}
        </Text>
      </View>
      <Text className={`mt-1 font-montserrat text-[11px] ${detailColor}`}>
        {detail}
      </Text>
    </View>
  );
}

export function WeeklyProgressCard({
  period,
  metrics,
}: {
  period: AnalyticsPeriod;
  metrics: AnalyticsMetrics;
}) {
  const progressPercent =
    metrics.adherencePercent ??
    (metrics.targetCalories && metrics.targetCalories > 0
      ? (metrics.totalCalories / metrics.targetCalories) * 100
      : null);
  const progressWidth = Math.min(Math.max(progressPercent ?? 0, 0), 100);
  const difference =
    metrics.targetCalories === null
      ? null
      : metrics.targetCalories - metrics.totalCalories;
  const status =
    progressPercent === null
      ? "Chưa có mục tiêu"
      : progressPercent >= 100
        ? "Đã đạt mục tiêu"
        : "Đang thực hiện";
  const periodLabel = period === "week" ? "tuần" : "tháng";
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progressWidth, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [animatedProgress, progressWidth]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  return (
    <View className="rounded-[24px] border border-border-hairline bg-canvas-white p-5">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2">
          <Gauge size={22} color="#059669" />
          <View>
            <Text className="font-montserrat-semibold text-xs uppercase tracking-wider text-zinc-400">
              Tiến độ dinh dưỡng
            </Text>
            <Text className="mt-1 font-montserrat-bold text-xl text-charcoal-pure">
              Mục tiêu {periodLabel}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2">
          <Award size={15} color="#059669" />
          <Text className="font-montserrat-bold text-xs text-emerald-600">
            {status}
          </Text>
        </View>
      </View>

      <View className="mt-7 flex-row items-end justify-between">
        <View>
          <Text className="font-montserrat-semibold text-xs uppercase tracking-wide text-zinc-400">
            Tiến độ nạp năng lượng
          </Text>
          <Text className="mt-1 font-montserrat-bold text-4xl text-charcoal-pure">
            {progressPercent === null ? "—" : percentFormat.format(progressPercent)}
            {progressPercent !== null && (
              <Text className="text-2xl text-emerald-500">%</Text>
            )}
          </Text>
        </View>
        <View className="max-w-[46%] rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2">
          <Text className="font-montserrat-semibold text-xs text-emerald-600" numberOfLines={1}>
            {status}
          </Text>
        </View>
      </View>

      <View className="mt-4 h-6 overflow-hidden rounded-full bg-zinc-100 p-1">
        <Animated.View
          className="h-full rounded-full bg-emerald-500"
          style={animatedProgressStyle}>
          <View className="absolute right-0 h-4 w-4 rounded-full border-4 border-white bg-emerald-600" />
        </Animated.View>
      </View>
      <View className="mt-2 flex-row justify-between">
        {["0%", "25%", "50%", "75%", "100%"].map((item) => (
          <Text key={item} className="font-montserrat text-[10px] text-zinc-400">
            {item}
          </Text>
        ))}
      </View>

      <View className="my-5 h-px bg-zinc-100" />
      <View className="flex-row">
        <StatColumn
          icon={Flame}
          label="Tổng nạp"
          value={numberFormat.format(metrics.totalCalories)}
          suffix="kcal"
          color="#F59E0B"
          detail={
            difference === null
              ? "Chưa có mục tiêu"
              : difference < 0
                ? `Vượt ${numberFormat.format(Math.abs(difference))} kcal`
                : difference === 0
                  ? "Vừa đạt mục tiêu"
                  : `Còn ${numberFormat.format(difference)} kcal`
          }
          detailColor={
            difference !== null && difference < 0
              ? "text-amber-600"
              : undefined
          }
        />
        <View className="mx-4 w-px bg-zinc-100" />
        <StatColumn
          icon={Flag}
          label={`Mục tiêu ${periodLabel}`}
          value={
            metrics.targetCalories === null
              ? "—"
              : numberFormat.format(metrics.targetCalories)
          }
          suffix="kcal"
          color="#2563EB"
          detail={
            metrics.targetCalories === null
              ? "Cập nhật hồ sơ để đặt mục tiêu"
              : `${numberFormat.format(metrics.targetCalories / metrics.daysInPeriod)} kcal/ngày`
          }
          detailColor="text-zinc-500"
        />
      </View>
    </View>
  );
}
