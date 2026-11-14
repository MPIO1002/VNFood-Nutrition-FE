import { MonthlyDiaryItem } from "@/api/generated/model";
import { YearMonth } from "@/types/date";
import { LucideIcon } from "lucide-react-native";

export type MonthlyMealItem = {
  key: YearMonth;
  data?: MonthlyDiaryItem;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealTypeOption = {
  value: MealType;
  label: string;
  icon: LucideIcon;
  color: string;
};
