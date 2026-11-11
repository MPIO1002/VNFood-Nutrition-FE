/**
 * CaloViet AI — Home Screen
 * Converted from Stitch AI HTML/Tailwind → React Native + TypeScript + Expo
 */

import { PressScale } from "@/components/PressScale";
import { RefreshableScrollView } from "@/components/RefreshableScrollView";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/features/auth";
import {
  CalorieRing,
  DailyMealList,
  useDailyMealsQuery,
} from "@/features/meal";
import { CalorieRingSkeleton } from "@/features/meal/components/skeleton";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  BarChart3,
  Box,
  Camera,
  CheckCircle2,
  Layers,
  Sliders,
  Sparkles,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

// ─── How-It-Works data ───────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    key: "step1",
    badge: "BƯỚC 1",
    Icon: Box,
    title: "Chụp & chọn vật đựng",
    desc: "Chụp món ăn góc từ trên xuống (90 độ) và chọn loại bát/đĩa.",
    footerLabel: "Thao tác đơn giản",
    FooterIcon: Sparkles,
  },
  {
    key: "step2",
    badge: "BƯỚC 2",
    Icon: Layers,
    title: "AI đo lường",
    desc: "AI tự động nhận diện món ăn và đo khối lượng qua thuật toán fill-ratio.",
    footerLabel: "Phân tích chuyên sâu",
    FooterIcon: Sliders,
  },
  {
    key: "step3",
    badge: "BƯỚC 3",
    Icon: BarChart3,
    title: "Trả kết quả",
    desc: "Truy xuất Database để tính lượng Calo, Protein, Fat, Carb thực tế theo khối lượng.",
    footerLabel: "Chi tiết dinh dưỡng",
    FooterIcon: CheckCircle2,
  },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const dailyMealsQuery = useDailyMealsQuery();
  const dailyMeals = dailyMealsQuery.data;
  const consumed = dailyMeals?.total_calories ?? 0;
  const goal = dailyMeals?.target_kcal_per_day ?? 2100;
  const displayName = currentUser?.full_name?.trim() || "bạn";

  return (
    <View className="flex-1 bg-surface">
      <RefreshableScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Greeting row */}
        <View className="flex-row items-center justify-between pt-1">
          <View className="flex-row items-center gap-2.5 flex-1">
            <View className="flex-1 min-w-0">
              <Text className="font-montserrat-semibold text-base text-charcoal-pure tracking-tight">
                Chào {displayName}, sẵn sàng chưa?
              </Text>
              <View className="mt-0.5 flex-row items-center">
                <Text className="font-montserrat text-xs text-zinc-500">
                  Mục tiêu hôm nay:{" "}
                </Text>
                {dailyMealsQuery.isLoading ? (
                  <Skeleton className="h-3 w-16" />
                ) : (
                  <Text className="font-montserrat-bold text-xs text-charcoal-pure">
                    {goal.toLocaleString()} kcal
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Calorie Ring Hero Card */}
        {dailyMealsQuery.isLoading ? (
          <CalorieRingSkeleton />
        ) : (
          <CalorieRing
            goal={goal}
            consumed={consumed}
            animationKey={dailyMealsQuery.dataUpdatedAt}
            protein={dailyMeals?.total_protein_g}
            proteinGoal={dailyMeals?.target_protein_g}
            carbs={dailyMeals?.total_carb_g}
            carbsGoal={dailyMeals?.target_carb_g}
            fat={dailyMeals?.total_fat_g}
            fatGoal={dailyMeals?.target_fat_g}
            burned={0}
          />
        )}

        {/* Dark Banner */}
        <View className="rounded-[24px] overflow-hidden bg-charcoal-pure border border-zinc-800 shadow-lg relative">
          <Image
            source="https://lh3.googleusercontent.com/aida-public/AB6AXuDyg3hVrZMCHY4qzuuPofJUqtIWaH5Rj9_saw83EvBM3EeiVLE1a_hioeco98LMeJqxw3UpnLSdzIzB4Y9Qcgxr0uFQ_w0PPsc2vOwAuHAIL6ftQnk2IBI8wZVkE2fgPsYFL81iPRl97T6V3At8hzK2qHdisX7ea8TDw8Hy17LcmSDc5FNOsC2ox4amdoOlPBfaDCkQj5ZBmMBehQ_5S-5YIv1bejGuh0dUsdD-hMEJr0SzGrPINkF8xw"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            contentFit="cover"
          />
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-950/70" />
          <View className="p-5 z-10">
            <View className="flex-row items-center gap-1.5 self-start px-3 py-1.5 rounded-full bg-white/10 border border-white/15 mb-3">
              <Sparkles size={12} color="#E4E4E7" />
              <Text className="font-montserrat-bold text-[10px] text-white uppercase tracking-widest">
                AI Food Scanner
              </Text>
            </View>
            <Text className="font-montserrat-bold text-base text-white tracking-tight mb-1.5 leading-6">
              Nhận diện tức thì các món ăn Việt
            </Text>
            <Text className="font-montserrat text-[13px] text-zinc-300 leading-5 mb-3">
              Thuật toán nội suy thể tích ước lượng khối lượng món ăn tự động.
            </Text>
            <View className="self-start px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Text className="font-montserrat-medium text-xs text-zinc-200">
                Ước tính các chất dinh dưỡng của món ăn
              </Text>
            </View>
          </View>
        </View>

        {/* Snap CTA */}
        <PressScale onPress={() => router.push("/scan")}>
          <View className="rounded-2xl bg-charcoal-pure border border-zinc-700 shadow-xl h-14 flex-row items-center justify-center gap-2.5 px-6">
            <Camera size={24} color="#FFFFFF" />
            <Text className="font-montserrat-bold text-base text-white tracking-tight flex-1 text-center">
              Quét bữa ăn ngay
            </Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </View>
        </PressScale>

        {/* How It Works */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between px-0.5">
            <View>
              <Text className="font-montserrat-bold text-base text-charcoal-pure tracking-tight">
                Cách CaloViet AI hoạt động
              </Text>
              <Text className="font-montserrat text-xs text-zinc-500 mt-0.5">
                Quy trình lượng hóa món ăn chỉ trong 2 giây
              </Text>
            </View>
            <Pressable>
              <Text className="font-montserrat-semibold text-xs text-charcoal-pure">
                Xem thêm
              </Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: 2,
              paddingRight: 16,
              gap: 14,
            }}>
            {HOW_STEPS.map(
              ({ key, badge, Icon, title, desc, footerLabel, FooterIcon }) => (
                <View
                  key={key}
                  className="w-[240px] p-4 rounded-2xl bg-canvas-white border border-border-hairline justify-between shadow-sm">
                  <View>
                    <View className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/80 items-center justify-center mb-3">
                      <Icon size={22} color="#18181B" />
                    </View>
                    <View className="self-start px-2 py-0.5 rounded bg-zinc-100 mb-1.5">
                      <Text className="font-montserrat-bold text-[10px] text-zinc-600">
                        {badge}
                      </Text>
                    </View>
                    <Text className="font-montserrat-bold text-[15px] text-charcoal-pure leading-snug mb-1.5">
                      {title}
                    </Text>
                    <Text className="font-montserrat text-xs text-zinc-500 leading-relaxed">
                      {desc}
                    </Text>
                  </View>
                  <View className="mt-4 pt-3 border-t border-zinc-100 flex-row items-center justify-between">
                    <Text className="font-montserrat-semibold text-[11px] text-charcoal-pure">
                      {footerLabel}
                    </Text>
                    <FooterIcon size={14} color="#18181B" />
                  </View>
                </View>
              ),
            )}
          </ScrollView>
        </View>

        <DailyMealList
          meals={dailyMeals?.meals ?? []}
          isLoading={dailyMealsQuery.isLoading}
          isError={dailyMealsQuery.isError}
        />

        <View className="h-28" />
      </RefreshableScrollView>
    </View>
  );
}
