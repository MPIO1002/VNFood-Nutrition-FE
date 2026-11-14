import {
  CoffeeIcon,
  MoonIcon,
  SunIcon,
  SunriseIcon,
} from "lucide-react-native";
import { MealType, MealTypeOption } from "../type/meal";

export const MEAL_TYPE_OPTIONS = {
  breakfast: {
    value: "breakfast",
    label: "Sáng",
    icon: SunriseIcon,
    color: "#F59E0B",
  },
  lunch: {
    value: "lunch",
    label: "Trưa",
    icon: SunIcon,
    color: "#EA580C",
  },
  dinner: {
    value: "dinner",
    label: "Tối",
    icon: MoonIcon,
    color: "#818CF8",
  },
  snack: {
    value: "snack",
    label: "Phụ",
    icon: CoffeeIcon,
    color: "#10B981",
  },
} as const satisfies Record<MealType, MealTypeOption>;
