import { Circle, TrendingDown } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { Badge } from "../ui/badge";
import { Icon } from "../ui/icon";
import { Input } from "../ui/input";
import { PlanBox, PlanBoxProps } from "./PlanBox";

export function LoseWeightPlanBox(props: PlanBoxProps) {
  const [value, setValue] = useState("3.0");

  const handleChange = (text: string) => {
    const cleaned = text
      .replace(",", ".")
      .replace(/[^0-9.]/g, "")
      .replace(/^(\d*\.?\d*).*$/, "$1");
    setValue(cleaned);
  };

  return (
    <PlanBox {...props}>
      <View className="flex-row w-full justify-center items-center gap-2">
        <View
          className={`rounded-md p-3 ${props.activated ? "bg-black" : "bg-gray-300"} items-center justify-center`}>
          <TrendingDown
            color={props.activated ? "white" : "black"}
            size={20}></TrendingDown>
        </View>
        <View className="flex-1">
          <Text className="font-montserrat-bold">Giảm cân & Giảm mỡ</Text>
          <Text className="font-montserrat text-sm">
            Tốc độ bền vững: ~0.5kg/tuần
          </Text>
        </View>
      </View>
      <Text className="font-montserrat text-sm">
        Thâm hụt calo an toàn, bảo toàn tối đa khối lượng cơ bắp với thực đơn
        giàu protein từ món Việt thanh nhẹ.
      </Text>
      <View className="flex-row rounded-md bg-gray-200 w-full p-2">
        <View className="flex-1">
          <Text className="font-montserrat">Mục tiêu giảm cân</Text>
          <Input
            value={value}
            onChangeText={handleChange}
            editable={props.activated}
            keyboardType="decimal-pad"
            maxLength={4}
            style={{
              paddingVertical: 0,
              paddingTop: 0,
              paddingBottom: 0,
              includeFontPadding: false,
              textAlignVertical: "center",
            }}
            className="rounded-xl border-0 bg-transparent text-black text-2xl font-montserrat-bold"
          />
        </View>
        <Text className="font-montserrat-bold self-end">kg</Text>
      </View>
      <View className="w-full flex-row items-center py-2">
        <View className="flex-1 gap-1 flex-row">
          <Text className="font-montserrat-medium text-sm">
            Đích đến dự kiến:
          </Text>
          <Text className="font-montserrat-bold text-sm">67.0kg</Text>
        </View>
        <View className="items-end">
          <Badge className="bg-green-200">
            <Icon
              as={Circle}
              size={10}
              fill={"#22c55e"}
              color={"#22c55e"}></Icon>
            <Text className="font-montserrat-medium text-sm text-green-500">
              1.850 kcal/ngày
            </Text>
          </Badge>
        </View>
      </View>
    </PlanBox>
  );
}
