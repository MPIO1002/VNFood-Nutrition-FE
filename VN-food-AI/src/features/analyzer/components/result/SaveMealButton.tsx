import { PressScale } from "@/components/PressScale";
import { BookmarkCheck } from "lucide-react-native";
import { Text, View } from "react-native";

export interface SaveMealButtonProps {
  disabled?: boolean;
  state: "idle" | "saving" | "saved";
  onPress: () => void;
}

export function SaveMealButton({
  disabled = false,
  state,
  onPress,
}: SaveMealButtonProps) {
  return (
    <View style={{ marginTop: 16, marginHorizontal: 16 }}>
      <PressScale disabled={disabled} onPress={onPress} toValue={0.99}>
        <View
          className={`h-16 flex-row items-center px-6 rounded-2xl shadow-sm ${state === "saved" ? "bg-green-600" : "bg-charcoal-pure"}`}>
          <View className="flex-row items-center gap-3">
            <BookmarkCheck size={24} color="#FFFFFF" />
            <Text className="font-montserrat-bold text-base text-white">
              {state === "saved"
                ? "Đã lưu bữa ăn vào nhật ký !"
                : state === "saving"
                  ? "Đang lưu..."
                  : "Lưu nhật ký"}
            </Text>
          </View>
        </View>
      </PressScale>
    </View>
  );
}
