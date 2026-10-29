import { BabyIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { ConditionBox, ConditionBoxProps } from "./ConditionBox";

export default function PregnantConditionBox(props: ConditionBoxProps) {
  return (
    <ConditionBox {...props}>
      <View className="w-full justify-center items-center">
        <View
          className={`rounded-md p-3 ${props.activated ? "bg-black" : "bg-gray-300"} items-center justify-center`}>
          <BabyIcon color={props.activated ? "white" : "black"} size={20} />
        </View>
      </View>
      <View className="w-full justify-center">
        <Text className="font-montserrat-bold text-sm text-center">
          Đang mang thai
        </Text>
      </View>
      <View className="w-full justify-center">
        <Text className="font-montserrat text-gray-400 text-base text-center">
          Đang trong giai đoạn mang thai hoặc nuôi con bằng sữa mẹ
        </Text>
      </View>
    </ConditionBox>
  );
}
