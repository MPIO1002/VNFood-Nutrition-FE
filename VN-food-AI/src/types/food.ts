// ─────────────────────────────────────────────────────────────
//  Food data types & mock dataset for MealScanAdjustScreen
// ─────────────────────────────────────────────────────────────

export interface FoodComponent {
  id: string;
  name: string;
  nameEn: string;
  defaultWeightG: number;
  currentWeightG: number;
  minWeightG: number;
  maxWeightG: number;
  calPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbPer100g: number;
  emoji: string;
}

export interface QuickToggle {
  id: string;
  label: string;
  kcalDelta: number; // negative = reduce calories
  enabled: boolean;
}

export const INITIAL_MEAL_DATA: FoodComponent[] = [
  {
    id: 'comp_1',
    name: 'Cơm tấm',
    nameEn: 'Broken Rice',
    defaultWeightG: 200,
    currentWeightG: 200,
    minWeightG: 50,
    maxWeightG: 400,
    calPer100g: 130,
    proteinPer100g: 2.7,
    fatPer100g: 0.3,
    carbPer100g: 28.2,
    emoji: '🍚',
  },
  {
    id: 'comp_2',
    name: 'Sườn nướng',
    nameEn: 'Grilled Pork Chop',
    defaultWeightG: 110,
    currentWeightG: 110,
    minWeightG: 50,
    maxWeightG: 300,
    calPer100g: 240,
    proteinPer100g: 20.0,
    fatPer100g: 17.0,
    carbPer100g: 1.0,
    emoji: '🥩',
  },
  {
    id: 'comp_3',
    name: 'Chả trứng hấp',
    nameEn: 'Steamed Egg Meatloaf',
    defaultWeightG: 60,
    currentWeightG: 60,
    minWeightG: 30,
    maxWeightG: 150,
    calPer100g: 160,
    proteinPer100g: 11.0,
    fatPer100g: 11.0,
    carbPer100g: 4.0,
    emoji: '🥚',
  },
  {
    id: 'comp_4',
    name: 'Dưa leo & Cà chua',
    nameEn: 'Cucumber & Tomato',
    defaultWeightG: 50,
    currentWeightG: 50,
    minWeightG: 0,
    maxWeightG: 150,
    calPer100g: 18,
    proteinPer100g: 0.8,
    fatPer100g: 0.2,
    carbPer100g: 3.5,
    emoji: '🥒',
  },
];

export const INITIAL_QUICK_TOGGLES: QuickToggle[] = [
  { id: 'toggle_1', label: 'Không chan mỡ hành', kcalDelta: -45, enabled: true },
  { id: 'toggle_2', label: 'Bỏ da / bớt mỡ', kcalDelta: -80, enabled: false },
  { id: 'toggle_3', label: 'Không húp hết nước dùng', kcalDelta: 0, enabled: false },
];

// ─── Helper: compute macros for a single component ───────────
export function calcMacros(comp: FoodComponent) {
  const ratio = comp.currentWeightG / 100;
  return {
    kcal: Math.round(comp.calPer100g * ratio),
    protein: +(comp.proteinPer100g * ratio).toFixed(1),
    fat: +(comp.fatPer100g * ratio).toFixed(1),
    carbs: +(comp.carbPer100g * ratio).toFixed(1),
  };
}
