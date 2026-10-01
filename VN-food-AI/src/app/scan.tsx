/**
 * CaloViet AI — Chi tiết món ăn (Scan Result Screen)
 * Converted from Stitch AI HTML/Tailwind → React Native + TypeScript + Expo
 */

import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Beef,
  BookmarkCheck,
  Camera,
  Check,
  ChevronLeft,
  Egg,
  Leaf,
  LucideIcon,
  Plus,
  Sliders,
  User,
  Wheat,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressScale } from '../components/PressScale';
import { GramStepper } from '../components/GramStepper';

// ─── Ingredient data ──────────────────────────────────────────────────────────
type IngredientKey = 'rice' | 'pork' | 'egg' | 'veg';

interface Ingredient {
  key: IngredientKey;
  name: string;
  baseKcal: number;
  proteinPer100g: number;
  carbPer100g: number;
  fatPer100g: number;
  defaultG: number;
  stepG: number;
  macroLabel: string;
  Icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

const INGREDIENTS: Ingredient[] = [
  {
    key: 'rice',
    name: 'Cơm tấm trắng',
    baseKcal: 1.3,
    proteinPer100g: 2.7,
    carbPer100g: 28,
    fatPer100g: 0.3,
    defaultG: 200,
    stepG: 10,
    macroLabel: '5.4g P • 56g C',
    Icon: Wheat,
    iconColor: '#92400E',
    iconBg: '#FEF3C7',
  },
  {
    key: 'pork',
    name: 'Sườn nướng mật ong',
    baseKcal: 2.22,
    proteinPer100g: 20,
    carbPer100g: 2,
    fatPer100g: 13,
    defaultG: 110,
    stepG: 10,
    macroLabel: '22.0g P • 15g F',
    Icon: Beef,
    iconColor: '#9F1239',
    iconBg: '#FFF1F2',
  },
  {
    key: 'egg',
    name: 'Chả trứng hấp mộc nhĩ',
    baseKcal: 1.96,
    proteinPer100g: 10,
    carbPer100g: 3,
    fatPer100g: 13,
    defaultG: 60,
    stepG: 5,
    macroLabel: '6.2g P • 8g F',
    Icon: Egg,
    iconColor: '#B45309',
    iconBg: '#FFFBEB',
  },
  {
    key: 'veg',
    name: 'Dưa leo & đồ chua',
    baseKcal: 0.55,
    proteinPer100g: 2,
    carbPer100g: 11,
    fatPer100g: 0.2,
    defaultG: 40,
    stepG: 5,
    macroLabel: '0.8g P • 4.5g C',
    Icon: Leaf,
    iconColor: '#065F46',
    iconBg: '#ECFDF5',
  },
];

// ─── Modifier chips ───────────────────────────────────────────────────────────
interface Modifier {
  id: string;
  label: string;
  delta: number; // negative = subtract kcal
}

const MODIFIERS: Modifier[] = [
  { id: 'mod-1', label: 'Không chan mỡ hành', delta: -45 },
  { id: 'mod-2', label: 'Bỏ bớt mỡ sườn', delta: -70 },
  { id: 'mod-3', label: 'Chấm vơi nước mắm', delta: -35 },
  { id: 'mod-4', label: 'Bỏ bớt 1/2 cơm', delta: -130 },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ScanResultScreen() {
  const router = useRouter();

  // Gram state
  const [grams, setGrams] = useState<Record<IngredientKey, number>>({
    rice: 200,
    pork: 110,
    egg: 60,
    veg: 40,
  });

  // Active modifiers
  const [activeMods, setActiveMods] = useState<Set<string>>(
    new Set(['mod-1'])
  );

  // Save state
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Computed totals
  const totals = useMemo(() => {
    let kcal =
      grams.rice * 1.3 +
      grams.pork * 2.22 +
      grams.egg * 1.96 +
      grams.veg * 0.55;

    for (const mod of MODIFIERS) {
      if (activeMods.has(mod.id)) kcal += mod.delta;
    }

    kcal = Math.max(150, Math.round(kcal));

    const protein = Math.round(
      grams.rice * 0.027 +
      grams.pork * 0.2 +
      grams.egg * 0.1 +
      grams.veg * 0.02
    );
    const carbs = Math.round(
      grams.rice * 0.28 +
      grams.pork * 0.02 +
      grams.egg * 0.03 +
      grams.veg * 0.11
    );
    const fat = Math.round(
      grams.rice * 0.003 +
      grams.pork * 0.13 +
      grams.egg * 0.13 +
      grams.veg * 0.002
    );

    return { kcal, protein, carbs, fat };
  }, [grams, activeMods]);

  function toggleMod(id: string) {
    setActiveMods((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSave() {
    setSaveState('saving');
    setTimeout(() => setSaveState('saved'), 700);
  }

  return (
    <View className="flex-1 bg-surface">
      {/* ── Safe-area top (header) ── */}
      <SafeAreaView edges={['top']} className="bg-white/85 border-b border-border-hairline z-10">
        <View className="h-16 px-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Pressable
              className="w-11 h-11 rounded-full items-center justify-center -ml-2"
              onPress={() => router.back()}
              accessibilityLabel="Quay lại"
            >
              <ChevronLeft size={22} color="#18181B" />
            </Pressable>
            <Text className="font-montserrat-semibold text-lg text-charcoal-pure tracking-tight">Chi tiết món ăn</Text>
          </View>
          <View className="w-8 h-8 rounded-full bg-charcoal-pure overflow-hidden">
            <Image
              source={require('../../assets/images/avatartion.png')}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. FOOD IMAGE + OVERLAY ── */}
        <View className="h-[260px] rounded-2xl overflow-hidden bg-charcoal-surface mb-[-16px]">
          <Image
            source={require('../../assets/images/com-tam-plate.jpg')}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          {/* Gradient fade bottom-to-top using LinearGradient */}
          <LinearGradient
            colors={['transparent', 'rgba(24,24,27,0.55)', 'rgba(24,24,27,0.80)']}
            locations={[0, 0.55, 1]}
            className="absolute bottom-0 left-0 right-0 h-[60%]"
          />

          {/* Floating actions bar */}
          <View className="absolute top-3 left-3 right-3 flex-row items-center justify-between gap-2 z-10">
            {/* Retake button */}
            <PressScale onPress={() => router.back()}>
              <View className="flex-row items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-900/85">
                <Camera size={14} color="#FFFFFF" />
                <Text className="font-montserrat-semibold text-xs text-white">Chụp lại</Text>
              </View>
            </PressScale>

            {/* AI confidence chip */}
            <View className="flex-row items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-900/85 border border-white/10 shrink">
              <View className="w-2 h-2 rounded-full bg-white/80" />
              <Text className="font-montserrat-semibold text-[11px] text-white shrink">AI 98% • Cơm Tấm Sườn Chả</Text>
            </View>
          </View>
        </View>

        {/* ── 2. MACRO SUMMARY BAR ── */}
        <View className="mx-2 z-20 bg-white rounded-2xl p-4 flex-row items-center justify-between gap-2 shadow-lg border border-border-hairline mb-6">
          {/* Total energy */}
          <View className="flex-1 min-w-0">
            <Text className="font-montserrat-semibold text-[10px] text-zinc-600 uppercase tracking-widest">TỔNG NĂNG LƯỢNG</Text>
            <View className="flex-row items-baseline mt-0.5">
              <Text className="font-montserrat-bold text-[26px] text-charcoal-pure leading-8 tracking-tight">{totals.kcal}</Text>
              <Text className="font-montserrat-semibold text-[11px] text-zinc-600 mb-[3px] ml-0.5"> kcal</Text>
            </View>
          </View>

          {/* Macro trio */}
          <View className="flex-row gap-1.5">
            {/* Protein — dark filled */}
            <View className="items-center px-2.5 py-2 rounded-xl min-w-[58px] bg-charcoal-pure">
              <View className="flex-row items-center gap-1">
                <Text className="font-montserrat-bold text-[11px] text-white">Protein</Text>
              </View>
              <Text className="font-montserrat-semibold text-xs text-white mt-0.5">
                {totals.protein}g
              </Text>
            </View>

            {/* Carbs */}
            <View className="items-center px-2.5 py-2 rounded-xl min-w-[58px] bg-surface-container border border-border-hairline">
              <View className="flex-row items-center gap-1">
                <Text className="font-montserrat-bold text-[11px] text-charcoal-pure">Carb</Text>
              </View>
              <Text className="font-montserrat-semibold text-xs text-charcoal-pure mt-0.5">
                {totals.carbs}g
              </Text>
            </View>

            {/* Fat */}
            <View className="items-center px-2.5 py-2 rounded-xl min-w-[58px] bg-surface-container border border-border-hairline">
              <View className="flex-row items-center gap-1">
                <Text className="font-montserrat-bold text-[11px] text-charcoal-pure">Fat</Text>
              </View>
              <Text className="font-montserrat-semibold text-xs text-charcoal-pure mt-0.5">
                {totals.fat}g
              </Text>
            </View>
          </View>
        </View>

        {/* ── 3. INGREDIENT LIST ── */}
        <View className="mb-6">
          <View className="flex-row items-end justify-between mb-3 px-0.5">
            <View>
              <Text className="font-montserrat-bold text-[17px] text-charcoal-pure tracking-tight">Thành phần chi tiết</Text>
              <Text className="font-montserrat text-xs text-zinc-500 mt-0.5">
                Chạm +/- để cân đối khẩu phần thực tế
              </Text>
            </View>
            <Text className="font-montserrat-semibold text-xs text-charcoal-pure">4 món nhận diện</Text>
          </View>

          <View className="gap-2.5">
            {INGREDIENTS.map((item) => (
              <View key={item.key} className="bg-white p-3.5 rounded-xl border border-border-subtle flex-row items-center justify-between gap-3 shadow-sm">
                {/* Icon + name */}
                <View className="flex-row items-center gap-3 flex-1 min-w-0">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center shrink-0"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <item.Icon size={22} color={item.iconColor} />
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className="font-montserrat-semibold text-[15px] text-charcoal-pure" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text className="font-montserrat text-xs text-zinc-500 mt-0.5" numberOfLines={1}>
                      <Text className="font-montserrat-bold text-charcoal-pure text-xs">
                        {Math.round(grams[item.key] * item.baseKcal)}
                      </Text>
                      {' kcal • '}
                      {item.macroLabel}
                    </Text>
                  </View>
                </View>

                {/* Stepper */}
                <GramStepper
                  value={grams[item.key]}
                  step={item.stepG}
                  onChange={(v) =>
                    setGrams((prev) => ({ ...prev, [item.key]: v }))
                  }
                />
              </View>
            ))}
          </View>
        </View>

        {/* ── 4. MODIFIER CHIPS ── */}
        <View className="mb-6 bg-zinc-50 -mx-4 px-4 py-5 border-y border-border-hairline">
          <View className="flex-row items-center gap-1.5 mb-1 px-1">
            <Sliders size={18} color="#18181B" />
            <Text className="font-montserrat-semibold text-[15px] text-charcoal-pure tracking-tight">
              Thói quen ăn uống & Gia vị ẩm thực
            </Text>
          </View>
          <Text className="font-montserrat text-xs text-zinc-500 px-1 mb-3">
            Chọn để AI khấu trừ chính xác lượng calo ẩn của món Việt:
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
          >
            {MODIFIERS.map((mod) => {
              const active = activeMods.has(mod.id);
              return (
                <PressScale
                  key={mod.id}
                  onPress={() => toggleMod(mod.id)}
                  toValue={0.96}
                >
                  <View className={`flex-row items-center px-3 py-2.5 rounded-full border ${active ? 'bg-charcoal-pure border-charcoal-pure' : 'bg-white border-zinc-200'}`}>
                    {active ? (
                      <Check
                        size={15}
                        color="#FFFFFF"
                      />
                    ) : (
                      <Plus size={15} color="#71717A" />
                    )}
                    <Text
                      className={`font-montserrat-semibold text-[13px] ml-1.5 mr-2 ${active ? 'text-white' : 'text-charcoal-pure'}`}
                    >
                      {mod.label}
                    </Text>
                    <View
                      className={`px-1.5 py-0.5 rounded ${active ? 'bg-white/15' : 'bg-zinc-100'}`}
                    >
                      <Text
                        className={`font-montserrat-bold text-[10px] ${active ? 'text-zinc-100' : 'text-zinc-500'}`}
                      >
                        {mod.delta} kcal
                      </Text>
                    </View>
                  </View>
                </PressScale>
              );
            })}
          </ScrollView>
        </View>

        {/* ── 5. BOTTOM ACTIONS ── */}
        <View className="gap-3">
          {/* Add manual item */}
          <PressScale>
            <View className="h-12 flex-row items-center justify-center gap-2 px-4 rounded-2xl bg-zinc-100 border border-zinc-200">
              <Plus size={20} color="#18181B" />
              <View style={{ flexShrink: 1 }}>
                <Text
                  className="font-montserrat-semibold text-sm text-charcoal-pure"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Thêm món thủ công hoặc nước uống
                </Text>
              </View>
            </View>
          </PressScale>

          {/* Save to diary */}
          <PressScale onPress={handleSave} toValue={0.99}>
            <View className={`h-14 flex-row items-center justify-between px-5 rounded-2xl ${saveState === 'saved' ? 'bg-macro-burned border-green-700' : 'bg-charcoal-pure border-zinc-800'}`}>
              <View className="flex-row items-center gap-2.5">
                <BookmarkCheck size={24} color="#FFFFFF" />
                <Text className="font-montserrat-bold text-base text-white">
                  {saveState === 'saved'
                    ? 'Đã ghi vào bữa trưa!'
                    : saveState === 'saving'
                      ? 'Đang lưu dữ liệu...'
                      : 'Lưu vào nhật ký'}
                </Text>
              </View>
              {saveState === 'idle' && (
                <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10">
                  <View className="flex-row items-baseline gap-0.5">
                    <Text className="font-montserrat-bold text-[15px] text-white">{totals.kcal}</Text>
                    <Text className="font-montserrat-semibold text-[10px] text-zinc-300"> kcal</Text>
                  </View>
                  <ArrowRight size={16} color="#FFFFFF" />
                </View>
              )}
            </View>
          </PressScale>
        </View>

        <View className="h-28" />
      </ScrollView>
    </View>
  );
}
