import { CircleDot, Droplets, Dumbbell, Wheat } from "lucide-react-native";
import { Text, View } from "react-native";

const MACROS = [
  {
    label: "Chất đạm (Protein)",
    percentage: "34%",
    value: "924g",
    color: "#2563EB",
    Icon: Dumbbell,
  },
  {
    label: "Tinh bột (Carbs)",
    percentage: "51%",
    value: "1.380g",
    color: "#F59E0B",
    Icon: Wheat,
  },
  {
    label: "Chất béo (Lipid)",
    percentage: "15%",
    value: "396g",
    color: "#F43F5E",
    Icon: Droplets,
  },
];

export function MacroDistributionCard() {
  return (
    <View className="rounded-[24px] border border-border-hairline bg-canvas-white p-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <CircleDot size={22} color="#18181B" />
          <View>
            <Text className="font-montserrat-bold text-base text-charcoal-pure">
              Phân Bố Dinh Dưỡng
            </Text>
            <Text className="mt-1 font-montserrat text-xs text-zinc-400">
              Tỷ lệ khối lượng 3 nhóm chất
            </Text>
          </View>
        </View>
        <View className="rounded-lg bg-zinc-100 px-3 py-2">
          <Text className="font-montserrat-semibold text-xs text-zinc-600">
            Toàn tuần
          </Text>
        </View>
      </View>
      <View className="mt-5 h-2 flex-row overflow-hidden rounded-full">
        <View className="w-[34%] bg-blue-600" />
        <View className="w-[51%] bg-amber-500" />
        <View className="w-[15%] bg-rose-500" />
      </View>
      <View className="mt-4">
        {MACROS.map(({ label, percentage, value, color, Icon }, index) => (
          <View
            key={label}
            className={`flex-row items-center py-3 ${index < MACROS.length - 1 ? "border-b border-zinc-100" : ""}`}>
            <Icon size={18} color={color} />
            <Text className="ml-3 flex-1 font-montserrat-semibold text-xs text-charcoal-pure">
              {label}
            </Text>
            <Text className="mr-5 font-montserrat text-xs text-zinc-400">
              {percentage}
            </Text>
            <Text className="font-montserrat-bold text-sm text-charcoal-pure">
              {value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
