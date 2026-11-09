import { Award, Flame, Flag, Gauge } from "lucide-react-native";
import { Text, View } from "react-native";

function StatColumn({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  detail,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  suffix: string;
  color: string;
  detail: string;
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
      <Text className="mt-1 font-montserrat text-[11px] text-emerald-600">
        {detail}
      </Text>
    </View>
  );
}

export function WeeklyProgressCard() {
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
              Mục tiêu tuần
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2">
          <Award size={15} color="#059669" />
          <Text className="font-montserrat-bold text-xs text-emerald-600">
            Xuất sắc
          </Text>
        </View>
      </View>

      <View className="mt-7 flex-row items-end justify-between">
        <View>
          <Text className="font-montserrat-semibold text-xs uppercase tracking-wide text-zinc-400">
            Tiến độ nạp năng lượng
          </Text>
          <Text className="mt-1 font-montserrat-bold text-4xl text-charcoal-pure">
            94.3<Text className="text-2xl text-emerald-500">%</Text>
          </Text>
        </View>
        <View className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2">
          <Text className="font-montserrat-semibold text-xs text-emerald-600">
            ● Chuẩn tham hụt
          </Text>
        </View>
      </View>

      <View className="mt-4 h-6 overflow-hidden rounded-full bg-zinc-100 p-1">
        <View className="h-full w-[94%] rounded-full bg-emerald-500">
          <View className="absolute right-0 h-4 w-4 rounded-full border-4 border-white bg-emerald-600" />
        </View>
      </View>
      <View className="mt-2 flex-row justify-between">
        {["0%", "25%", "50%", "75%", "100% mục tiêu"].map((item) => (
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
          value="12.870"
          suffix="kcal"
          color="#F59E0B"
          detail="Thâm hụt -780 kcal an toàn"
        />
        <View className="mx-4 w-px bg-zinc-100" />
        <StatColumn
          icon={Flag}
          label="Kế hoạch tuần"
          value="13.650"
          suffix="kcal"
          color="#2563EB"
          detail="Định mức 1.950 kcal / ngày"
        />
      </View>
    </View>
  );
}
