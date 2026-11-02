import { Badge } from "@/components/ui/badge";
import { CircleIcon, DumbbellIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { ActivityLevelBox, ActivityLevelBoxProps } from "./ActivityLevelBox";

export default function ModerateLevelBoxLevelBox(props: ActivityLevelBoxProps) {
  return (
    <ActivityLevelBox {...props}>
      <View className="flex-row w-full justify-center items-center gap-3">
        <View className="items-start h-full">
          <View
            className={`rounded-md p-3 ${props.activated ? "bg-black" : "bg-gray-300"} items-center`}>
            <DumbbellIcon
              color={props.activated ? "white" : "black"}
              size={20}
            />
          </View>
        </View>
        <View className="flex-1">
          <View className="flex-row gap-2 items-center">
            <Text className="font-montserrat-bold">Vận động vừa</Text>
            <Badge className="bg-green-200">
              <Text className="font-montserrat-bold text-green-500 text-xs">
                Khuyên dùng
              </Text>
            </Badge>
          </View>
          <Text className="font-montserrat text-xs text-gray-400">
            Tập thể thao, gym hoặc chạy bộ vừa phải khoảng 3–5 ngày/tuần
          </Text>
          <View className="flex-row items-center gap-2 mt-2 w-full">
            <CircleIcon
              size={10}
              fill={props.activated ? "green" : "gray"}
              color={props.activated ? "green" : "gray"}
            />
            <Text
              className={`font-montserrat-medium text-xs ${props.activated ? "black" : "text-gray-500"}`}>
              Hệ số PAL: 1.55 • Tối ưu chuyển hoá
            </Text>
          </View>
        </View>
      </View>
    </ActivityLevelBox>
  );
}
