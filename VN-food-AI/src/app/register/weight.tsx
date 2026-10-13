import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function InputWeightScreen() {
  return (
    <View className="bg-gray-100 w-screen h-screen">
      <Pressable
        className="w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2"
        onPress={() => router.push("/register/height")}>
        <Text className="font-montserrat-bold text-[15px] text-white">
          NEXT
        </Text>
        <ArrowRight size={18} color="#FFF" />
      </Pressable>
    </View>
  );
}
