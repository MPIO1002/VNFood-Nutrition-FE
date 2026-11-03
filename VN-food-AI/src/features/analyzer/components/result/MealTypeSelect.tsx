import { Icon } from "@/components/ui/icon";
import {
  Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
} from "@/components/ui/select";
import {
  SunIcon,
  SunriseIcon,
  SunsetIcon,
  UtensilsIcon,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import MealSelectItem, { MealSelectItemProps } from "./MealSelectItem";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealTypeSelectProps {
  disabled?: boolean;
  onMealTypeChange?: (type: MealType) => void;
}

export default function MealTypeSelect({
  disabled = false,
  onMealTypeChange,
}: MealTypeSelectProps) {
  const options: MealSelectItemProps[] = [
    {
      value: "breakfast",
      label: "Bữa sáng",
      textColor: "#92f6fc",
      checkColor: "#92f6fc",
      icon: SunriseIcon,
      iconColor: "#92f6fc",
      iconFillColor: "yellow",
      iconSize: 15,
      className: "bg-orange-300 rounded-none",
    },
    {
      value: "lunch",
      label: "Bữa trưa",
      textColor: "#2391FF",
      checkColor: "#2391FF",
      icon: SunIcon,
      iconColor: "#2391FF",
      iconFillColor: "orange",
      iconSize: 15,
      className: "bg-yellow-300 rounded-none",
    },
    {
      value: "dinner",
      label: "Bữa tối",
      textColor: "#e8817f",
      checkColor: "#e8817f",
      icon: SunsetIcon,
      iconColor: "#e8817f",
      iconFillColor: "orange",
      iconSize: 15,
      className: "bg-[#5a336e] rounded-none",
    },
    {
      value: "snack",
      label: "Bữa phụ",
      textColor: "white",
      checkColor: "white",
      icon: UtensilsIcon,
      iconColor: "white",
      iconFillColor: "white",
      iconSize: 15,
      className: "bg-black rounded-none",
    },
  ];

  const [mealType, setMealType] = useState<Option>(options[0]);
  const selected = options.find((o) => o.value === mealType?.value);

  useEffect(() => {
    onMealTypeChange?.((mealType?.value as MealType) ?? "breakfast");
  }, [mealType]);

  return (
    <View className="w-full justify-center items-center p-3 bg-white rounded-3xl shadow-sm border border-zinc-100 gap-4">
      <View className="flex-row justify-center items-center">
        <View className="flex-1 w-full">
          <Text className="font-montserrat-semibold">Bữa ăn này là</Text>
        </View>
        <View>
          <Select
            disabled={disabled}
            onValueChange={setMealType}
            className={`${disabled && "opacity-70"}`}>
            <SelectTrigger
              chevronColor={selected?.iconColor}
              className={`w-[150px] border-0 ${selected?.className} rounded-full`}>
              <View className="flex-row items-center gap-2">
                {selected?.icon && (
                  <Icon
                    as={selected?.icon}
                    color={selected.iconColor ?? "black"}
                    fill={selected.iconFillColor ?? "black"}
                    size={selected.iconSize ?? 10}
                  />
                )}
                <Text
                  className="font-montserrat"
                  style={{ color: selected?.textColor }}>
                  {selected?.label ?? "Chọn bữa ăn"}
                </Text>
              </View>
            </SelectTrigger>
            <SelectContent className="w-[160px] bg-white p-0 overflow-hidden">
              <SelectGroup>
                {options.map((o) => (
                  <MealSelectItem key={o.value} {...o} />
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
      </View>
    </View>
  );
}
