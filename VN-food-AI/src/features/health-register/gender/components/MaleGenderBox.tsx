import { MarsIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { GenderBox, GenderBoxProps } from "./GenderBox";

export default function MaleGenderBox(props: GenderBoxProps) {
  return (
    <GenderBox {...props}>
      <View className="flex-row w-full justify-center items-center gap-4">
        <View
          className={`rounded-md p-3 ${props.activated ? "bg-black" : "bg-gray-300"} items-center justify-center`}>
          <MarsIcon color={props.activated ? "white" : "black"} size={22} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-1">
            <Text className="font-montserrat-bold items-center">Nam giới</Text>
            <View className="bg-gray-300 py-1 px-2 rounded-2xl -translate-y-0.5">
              <Text className="font-montserrat text-xs text-gray-500">XY</Text>
            </View>
          </View>
          <Text className="font-montserrat text-xs text-gray-400 leading-none">
            Hệ số chuyển hóa BMR cao hơn
          </Text>
        </View>
      </View>
    </GenderBox>
  );
}
