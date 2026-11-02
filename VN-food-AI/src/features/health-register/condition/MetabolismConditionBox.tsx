import { DnaIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { ConditionBox, ConditionBoxProps } from "./ConditionBox";

export default function MetabolismConditionBox(props: ConditionBoxProps) {
  return (
    <ConditionBox {...props}>
      <View className="w-full justify-center items-center">
        <View
          className={`rounded-md p-3 ${props.activated ? "bg-black" : "bg-gray-300"} items-center justify-center`}>
          <DnaIcon color={props.activated ? "white" : "black"} size={20} />
        </View>
      </View>
      <View className="w-full justify-center">
        <Text className="font-montserrat-bold text-base text-center">
          Tình trạng bệnh lý
        </Text>
      </View>
    </ConditionBox>
  );
}
