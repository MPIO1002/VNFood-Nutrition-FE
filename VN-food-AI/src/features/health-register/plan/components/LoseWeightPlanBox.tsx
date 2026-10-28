import { GoalPace } from "@/api/generated/model";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";
import { Circle, TrendingDown } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { PlanBox, PlanBoxProps } from "./PlanBox";

export interface LoseWeightPlanBoxProps extends PlanBoxProps {
  currentWeight: number;
  onWeightChange?: (value: number) => void;
  onModeChange?: (mode: GoalPace) => void;
}

export function LoseWeightPlanBox({
  currentWeight,
  onModeChange,
  onWeightChange,
  ...props
}: LoseWeightPlanBoxProps) {
  const [textValue, setTextValue] = useState("3.0");
  const [target, setTarget] = useState(currentWeight - 3);
  const [mode, setMode] = useState<GoalPace>("standard");
  const minValue = 0;
  const maxValue = 100;

  const getWeight = (text: string) => {
    const v = Number(text);
    if (v < minValue || !text) return minValue;
    else if (v > maxValue) return maxValue;

    return v;
  };

  const onValueChange = useMemo(
    () =>
      debounce((v: number) => {
        const t = currentWeight - v;
        setTarget(t < 0 ? 0 : t);
        onWeightChange?.(v);
      }, 300),
    [currentWeight],
  );
  useEffect(() => {
    return () => onValueChange.cancel();
  }, [onValueChange]);

  const handleChange = (text: string) => {
    const cleaned = text
      .replace(",", ".")
      .replace(/[^0-9.]/g, "")
      .replace(/^(\d*\.?\d*).*$/, "$1");

    setTextValue(cleaned);
    onValueChange(getWeight(cleaned));
  };

  const handleBlur = () => {
    const v = getWeight(textValue);
    setTextValue(`${v}`);
    onValueChange(v);
  };

  useEffect(() => {
    setTarget(currentWeight - getWeight(textValue));
  }, [currentWeight]);

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
            value={textValue}
            onChangeText={handleChange}
            onBlur={handleBlur}
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
            className="rounded-xl border-0 bg-transparent text-black text-2xl font-montserrat-bold"
          />
        </View>
        <Text className="font-montserrat-bold self-end">kg</Text>
      </View>
      <View className="w-full items-center justify-center mt-2">
        <Text className="font-montserrat-bold">Tốc độ thực hiện</Text>
      </View>
      <View className="w-full flex-row items-center justify-center gap-5">
        <Pressable
          className={`rounded-xl border px-3 py-2 ${mode === "standard" ? "border-green-500 bg-green-500" : "border-gray-300"}`}
          disabled={!props.activated}
          onPress={() => {
            setMode("standard");
            onModeChange?.("standard");
          }}>
          <Text
            className={`font-montserrat ${mode === "standard" ? "color-white" : "color-gray-500"}`}>
            Standard
          </Text>
        </Pressable>
        <Pressable
          className={`rounded-xl border px-3 py-2 ${mode === "gradual" ? "border-blue-400 bg-blue-400" : "border-gray-300"}`}
          disabled={!props.activated}
          onPress={() => {
            setMode("gradual");
            onModeChange?.("gradual");
          }}>
          <Text
            className={`font-montserrat ${mode === "gradual" ? "color-white" : "color-gray-500"}`}>
            Gradual
          </Text>
        </Pressable>
      </View>
      <View className="w-full flex-row overflow-hidden">
        <View className="shrink-0 items-center justify-center">
          <Text className="font-montserrat color-gray-400 text-sm text-center">
            {mode === "standard"
              ? "Điều chỉnh -500kcal/ngày, tương đương tốc độ an toàn ≈0.5 kg/tuần"
              : "Điều chỉnh -250 kcal/ngày, tương đương tốc độ nhẹ nhàng ≈0.25kg/tuần"}
          </Text>
        </View>
      </View>
      <View className="w-full flex-row items-center py-2">
        <View className="flex-1 gap-1 flex-row">
          <Text className="font-montserrat-medium text-sm">
            Đích đến dự kiến:
          </Text>
          <Text className="font-montserrat-bold text-sm">{target}kg</Text>
        </View>
        <View className="items-end">
          <Badge className="bg-green-200">
            <Icon
              as={Circle}
              size={10}
              fill={"#22c55e"}
              color={"#22c55e"}></Icon>
            <Text className="font-montserrat-medium text-sm text-green-500">
              {mode === "standard" ? "500 kcal/ngày" : "250 kcal/ngày"}
            </Text>
          </Badge>
        </View>
      </View>
    </PlanBox>
  );
}
