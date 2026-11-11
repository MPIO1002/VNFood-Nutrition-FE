import { Icon } from "@/components/ui/icon";
import {
  ClockIcon,
  CoffeeIcon,
  MoonIcon,
  SunIcon,
  SunriseIcon,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealTypeSelectProps {
  disabled?: boolean;
  onMealTypeChange?: (type: MealType) => void;
}

const mealOptions = [
  {
    value: "breakfast",
    label: "Sáng",
    icon: SunriseIcon,
    color: "#F59E0B",
  },
  {
    value: "lunch",
    label: "Trưa",
    icon: SunIcon,
    color: "#EA580C",
  },
  {
    value: "dinner",
    label: "Tối",
    icon: MoonIcon,
    color: "#818CF8",
  },
  {
    value: "snack",
    label: "Phụ",
    icon: CoffeeIcon,
    color: "#10B981",
  },
] as const satisfies readonly {
  value: MealType;
  label: string;
  icon: typeof SunriseIcon;
  color: string;
}[];

const styles = StyleSheet.create({
  option: {
    minHeight: 48,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingHorizontal: 6,
  },
  selectedOption: {
    backgroundColor: "#18181B",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledOption: {
    opacity: 0.6,
  },
  optionLabel: {
    color: "#18181B",
    fontFamily: "Montserrat_400Regular",
  },
  selectedOptionLabel: {
    color: "#FFFFFF",
    fontFamily: "Montserrat_600SemiBold",
  },
});

function getSuggestedMealType(date: Date): MealType {
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 15) return "lunch";
  if (hour >= 17 && hour < 22) return "dinner";
  return "snack";
}

export default function MealTypeSelect({
  disabled = false,
  onMealTypeChange,
}: MealTypeSelectProps) {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [mealType, setMealType] = useState<MealType>(() =>
    getSuggestedMealType(new Date()),
  );
  const [isManuallySelected, setIsManuallySelected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (!isManuallySelected) {
        setMealType(getSuggestedMealType(now));
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [isManuallySelected]);

  useEffect(() => {
    onMealTypeChange?.(mealType);
  }, [mealType, onMealTypeChange]);

  const formattedTime = currentTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <View className="w-full gap-3 rounded-[28px] border border-zinc-200 bg-white p-3 shadow-sm mb-5">
      <View className="flex-row items-center justify-between gap-2 px-1">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <Icon as={ClockIcon} color="#18181B" size={22} />
          <Text
            numberOfLines={1}
            className="shrink font-montserrat-semibold text-[12px] text-zinc-900">
            Phân loại bữa ăn
          </Text>
        </View>
        <View className="shrink-0 flex-row items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-2">
          <View className="size-2 rounded-full bg-amber-500" />
          <Text className="font-montserrat text-xs text-zinc-600">
            {formattedTime} •{" "}
            {isManuallySelected ? "Đã chọn thủ công" : "Đề xuất tự động"}
          </Text>
        </View>
      </View>

      <View
        accessibilityRole="radiogroup"
        className="flex-row items-center justify-between rounded-[24px] border border-zinc-200 bg-zinc-100 p-1.5">
        {mealOptions.map((option) => {
          const isSelected = mealType === option.value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={`Bữa ${option.label.toLowerCase()}`}
              accessibilityState={{ checked: isSelected, disabled }}
              disabled={disabled}
              onPress={() => {
                setIsManuallySelected(true);
                setMealType(option.value);
              }}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                disabled && styles.disabledOption,
              ]}>
              <Icon
                as={option.icon}
                color={option.color}
                size={21}
              />
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.selectedOptionLabel,
                ]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
