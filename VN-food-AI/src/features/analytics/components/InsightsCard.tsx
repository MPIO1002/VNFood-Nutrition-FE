import { Lightbulb, Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";

export function InsightsCard() {
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
          Bạn đã hoàn thành{" "}
          <Text className="font-montserrat-bold text-charcoal-pure">94,3%</Text>{" "}
          chỉ tiêu calo tuần với tổng nạp{" "}
          <Text className="font-montserrat-bold text-charcoal-pure">
            12.870 kcal
          </Text>{" "}
          so với kế hoạch{" "}
          <Text className="font-montserrat-bold text-charcoal-pure">
            13.650 kcal
          </Text>
          , tạo thâm hụt nhẹ rất lý tưởng để duy trì vóc dáng săn chắc.
        </Text>
        <View className="my-3 h-px bg-zinc-200" />
        <Text className="font-montserrat text-sm leading-6 text-zinc-500">
          Chu kỳ ghi nhận đạt{" "}
          <Text className="font-montserrat-bold text-charcoal-pure">6 / 7</Text>{" "}
          ngày với{" "}
          <Text className="font-montserrat-bold text-charcoal-pure">
            19 bữa ăn
          </Text>{" "}
          được ghi nhận. Nhóm tinh bột và chất đạm được cân đối ổn định.
        </Text>
      </View>
    </View>
  );
}
