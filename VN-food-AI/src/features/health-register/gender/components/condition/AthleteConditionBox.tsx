import { BicepsFlexedIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { ConditionBox, ConditionBoxProps } from "./ConditionBox";

export default function AthleteConditionBox(props: ConditionBoxProps) {
  return (
    <ConditionBox {...props}>
      <View className="w-full justify-center items-center">
        <View
          className={`rounded-md p-3 ${props.activated ? "bg-black" : "bg-gray-300"} items-center justify-center`}>
          <BicepsFlexedIcon
            color={props.activated ? "white" : "black"}
            size={20}
          />
        </View>
      </View>
      <View className="w-full justify-center">
        <Text className="font-montserrat-bold text-base text-center">
          Vận động viên
        </Text>
      </View>
      <View className="w-full justify-center">
        <Text className="font-montserrat text-gray-400 text-base text-center">
          Tập luyện hoặc thi đấu thể thao với cường độ cao thường xuyên
        </Text>
      </View>
    </ConditionBox>
  );
}
