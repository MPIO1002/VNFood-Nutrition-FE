import { ScrollView, Text, View } from "react-native";
import {
  DateRangeCard,
  InsightsCard,
  MacroDistributionCard,
  PeriodToggle,
  WeeklyLogCard,
  WeeklyProgressCard,
} from "@/features/analytics";

export default function AnalyticsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 132,
        gap: 14,
      }}
      showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 font-montserrat text-sm text-zinc-500">
          Hiệu suất dinh dưỡng vượt kỳ vọng
        </Text>
        <PeriodToggle />
      </View>
      <DateRangeCard />
      <WeeklyProgressCard />
      <WeeklyLogCard />
      <MacroDistributionCard />
      <InsightsCard />
    </ScrollView>
  );
}
