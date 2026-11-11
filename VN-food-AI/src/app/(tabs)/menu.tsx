import { RefreshableScrollView } from "@/components/RefreshableScrollView";
import { Text, View } from "react-native";

export default function MenuScreen() {
  return (
    <RefreshableScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center" }}>
      <View className="items-center px-6">
        <Text className="font-montserrat-semibold text-lg text-charcoal-pure">
          Đang phát triển
        </Text>
      </View>
    </RefreshableScrollView>
  );
}
