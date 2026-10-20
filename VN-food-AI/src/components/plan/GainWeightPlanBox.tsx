import { Circle, TrendingDown } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { Badge } from "../ui/badge";
import { Icon } from "../ui/icon";
import { Input } from "../ui/input";
import { PlanBox, PlanBoxProps } from "./PlanBox";

export function GainWeightPlanBox(props: PlanBoxProps) {
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
          <Text className="font-montserrat-bold">Tăng cân & Tăng cơ</Text>
          <Text className="font-montserrat text-sm">
            {"Tăng trưởng khối cơ thuần (Lean Bulk)"}
          </Text>
        </View>
      </View>
      <Text className="font-montserrat text-sm">
        Thặng dư năng lượng lành mạnh với tỷ lệ đạm tối ưu, phân bổ calo tập
        trung vào các bữa ăn phục hồi cơ bắp.
      </Text>
      <View className="flex-row rounded-md bg-gray-200 w-full p-2">
        <View className="flex-1">
          <Text className="font-montserrat">Mục tiêu tăng nạc</Text>
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
              fontFamily: "Montserrat_700Bold",
            }}
            className="border-0 rounded-xl bg-transparent text-black text-2xl font-montserrat-bold"
          />
        </View>
        <Text className="font-montserrat-bold self-end">kg</Text>
      </View>
      <View className="w-full flex-row items-center py-2">
        <View className="flex-1 gap-1 flex-row">
          <Text className="font-montserrat-medium text-sm">
            Đích đến dự kiến:
          </Text>
          <Text className="font-montserrat-bold text-sm">68.0kg</Text>
        </View>
        <View className="items-end">
          <Badge className="bg-red-200">
            <Icon
              as={Circle}
              size={10}
              fill={"#ef4444"}
              color={"#ef4444"}></Icon>
            <Text className="font-montserrat-medium text-sm text-red-500">
              2.550 kcal/ngày
            </Text>
          </Badge>
        </View>
      </View>
    </PlanBox>
  );
}
