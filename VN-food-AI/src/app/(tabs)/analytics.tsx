import { RefreshableScrollView } from "@/components/RefreshableScrollView";
import type { AnalyticsPeriod } from "@/features/analytics";
import {
  DateRangeCard,
  InsightsCard,
  MacroDistributionCard,
  PeriodToggle,
  WeeklyLogCard,
  WeeklyProgressCard,
  getAnalyticsDateRange,
  useAnalytics,
} from "@/features/analytics";
import { AnalyticsSkeleton } from "@/features/analytics/components/skeleton";
import { useState } from "react";
import {
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
  FadeOut,
} from "react-native-reanimated";

const PREVIOUS_PERIOD_TRANSITION = FadeInLeft.duration(260).easing(
  Easing.out(Easing.cubic),
);
const NEXT_PERIOD_TRANSITION = FadeInRight.duration(260).easing(
  Easing.out(Easing.cubic),
);
const PERIOD_TRANSITION_EXIT = FadeOut.duration(140);

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("week");
  const [periodOffset, setPeriodOffset] = useState(0);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const range = getAnalyticsDateRange(period, periodOffset);
  const { metrics, isLoading, isError, refetch } = useAnalytics(
    period,
    range,
  );

  return (
    <RefreshableScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 132,
        gap: 14,
      }}
      showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between">
        <View className="mr-2 flex-1">
          <Text className="font-montserrat-bold text-base text-charcoal-pure">
            Thống kê dinh dưỡng
          </Text>
          <Text className="mt-1 font-montserrat text-xs text-zinc-500">
            Theo dõi tiến độ và nhật ký bữa ăn
          </Text>
        </View>
        <PeriodToggle
          period={period}
          onChange={(value) => {
            setDirection(value === "month" ? 1 : -1);
            setPeriod(value);
            setPeriodOffset(0);
          }}
        />
      </View>
      <Animated.View
        key={`${period}:${range.startDate}`}
        entering={
          direction > 0
            ? NEXT_PERIOD_TRANSITION
            : PREVIOUS_PERIOD_TRANSITION
        }
        exiting={PERIOD_TRANSITION_EXIT}
        style={{ gap: 14 }}>
        <DateRangeCard
          range={range}
          canGoNext={periodOffset < 0}
          onPrevious={() => {
            setDirection(-1);
            setPeriodOffset((offset) => offset - 1);
          }}
          onNext={() => {
            setDirection(1);
            setPeriodOffset((offset) => Math.min(offset + 1, 0));
          }}
        />
        {isLoading ? (
          <AnalyticsSkeleton />
        ) : isError ? (
          <View className="items-center gap-3 rounded-2xl border border-rose-200 bg-white px-5 py-8">
            <Text className="text-center font-montserrat text-sm text-rose-700">
              Không thể tải thống kê cho kỳ này.
            </Text>
            <Pressable
              accessibilityRole="button"
              className="rounded-lg bg-charcoal-pure px-4 py-2"
              onPress={() => void refetch()}>
              <Text className="font-montserrat-semibold text-sm text-white">
                Thử lại
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {metrics.mealCount === 0 && (
              <View className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <Text className="font-montserrat text-sm text-zinc-600">
                  Chưa có bữa ăn nào được ghi nhận trong kỳ này.
                </Text>
              </View>
            )}
            <WeeklyProgressCard period={period} metrics={metrics} />
            <WeeklyLogCard period={period} metrics={metrics} />
            <MacroDistributionCard period={period} metrics={metrics} />
            <InsightsCard period={period} metrics={metrics} />
          </>
        )}
      </Animated.View>
    </RefreshableScrollView>
  );
}
