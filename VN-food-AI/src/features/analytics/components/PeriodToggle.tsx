import { Pressable, Text, View } from "react-native";

export function PeriodToggle() {
  return (
    <View className="flex-row items-center rounded-full bg-zinc-100 p-1">
      <Pressable className="rounded-full bg-charcoal-pure px-5 py-2">
        <Text className="font-montserrat-bold text-xs text-white">Tuần</Text>
      </Pressable>
      <Pressable className="px-5 py-2">
        <Text className="font-montserrat-semibold text-xs text-zinc-500">
          Tháng
        </Text>
      </Pressable>
    </View>
  );
}
