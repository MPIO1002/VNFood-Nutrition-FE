import { BicepsFlexedIcon, CircleIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { ActivityLevelBox, ActivityLevelBoxProps } from "./ActivityLevelBox";

export default function VeryActiveLevelBoxLevelBox(
  props: ActivityLevelBoxProps,
) {
  return (
    <ActivityLevelBox {...props}>
      <View className="flex-row w-full justify-center items-center gap-3">
        <View className="items-start h-full">
          <View
            className={`rounded-md p-3 ${props.activated ? "bg-black" : "bg-gray-300"} items-center`}>
            <BicepsFlexedIcon
              color={props.activated ? "white" : "black"}
              size={20}
            />
          </View>
        </View>
        <View className="flex-1">
          <Text className="font-montserrat-bold">
            Lao động thể lực nặng hoặc tập nặng nhiều lần/ngày
          </Text>
          <Text className="font-montserrat text-xs text-gray-400">
            Vận động viên thi đấu hoặc công việc thể lực nặng nhọc liên tục
          </Text>
          <View className="flex-row items-center gap-2 mt-2 w-full">
            <CircleIcon
              size={10}
              fill={props.activated ? "green" : "gray"}
              color={props.activated ? "green" : "gray"}
            />
            <Text
              className={`font-montserrat-medium text-xs ${props.activated ? "black" : "text-gray-500"}`}>
              Hệ số PAL: 1.9 • Cường độ cực cao
            </Text>
          </View>
        </View>
      </View>
    </ActivityLevelBox>
  );
}
