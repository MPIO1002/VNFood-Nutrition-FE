import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Circle, Scale } from "lucide-react-native";
import { Text, View } from "react-native";
import { PlanBox, PlanBoxProps } from "./PlanBox";

export function BalancedPlanBox(props: PlanBoxProps) {
  return (
    <PlanBox {...props}>
      <View className="flex-row w-full justify-center items-center gap-2">
        <View
          className={`rounded-md p-3 ${props.activated ? "bg-black" : "bg-gray-300"} items-center justify-center`}>
          <Scale color={props.activated ? "white" : "black"} size={20}></Scale>
        </View>
        <View className="flex-1">
          <Text className="font-montserrat-bold">Giữ cân & Săn chắc</Text>
          <Text className="font-montserrat text-sm">
            Tái cấu trúc cơ thể & Tăng trao đổi chất
          </Text>
        </View>
      </View>
      <Text className="font-montserrat text-sm">
        Cân bằng hoàn hảo giữa năng lượng nạp vào và tiêu hao, kích thích đốt mỡ
        nền và săn chắc cơ thể mà không gây kiệt sức.
      </Text>
      <View className="w-full">
        <Badge className="bg-gray-200 self-start">
          <Icon as={Circle} size={10} fill={"black"} color={"black"}></Icon>
          <Text className="font-montserrat-medium text-sm text-black">
            Khuyến nghị: 2.200 kcal/ngày
          </Text>
        </Badge>
      </View>
      <View className="w-full flex-row items-center py-2 gap-2">
        <Badge className="bg-blue-100 self-start">
          <Icon as={Circle} size={10} fill={"#3b82f6"} color={"#3b82f6"}></Icon>
          <Text className="font-montserrat-medium text-sm text-blue-500">
            BMR: 1.620 kcal
          </Text>
        </Badge>
        <View className="items-end">
          <Badge className="bg-[#fcf3e8]">
            <Icon
              as={Circle}
              size={10}
              fill={"#D97706"}
              color={"#D97706"}></Icon>
            <Text className="font-montserrat-medium text-sm text-macro-carbs">
              TDEE: 2.200 kcal
            </Text>
          </Badge>
        </View>
      </View>
    </PlanBox>
  );
}
