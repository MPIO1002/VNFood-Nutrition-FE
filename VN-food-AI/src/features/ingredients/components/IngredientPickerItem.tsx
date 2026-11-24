import { IngredientItem } from "@/api/generated/model";
import { Text, View } from "react-native";

export interface IngredientPickerItemProps {
  data: IngredientItem;
  onPress?: (data: IngredientItem) => void;
}

export default function IngredientPickerItem({
  data,
  onPress,
}: IngredientPickerItemProps) {
  return (
    <View className="w-full p-3">
      <View className="p-3 rounded-xl border bg-white shadow shadow-gray-400">
        <Text>{data.name}</Text>
      </View>
    </View>
  );
}
