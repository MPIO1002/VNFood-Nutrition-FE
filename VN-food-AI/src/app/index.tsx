/**
 * CaloViet AI — Home Screen
 * Converted from Stitch AI HTML/Tailwind → React Native + TypeScript + Expo
 */

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Box,
  Camera,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sliders,
  Sparkles,
  User,
} from 'lucide-react-native';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressScale } from '../components/PressScale';
import { CalorieRing } from '../components/CalorieRing';

// ─── How-It-Works data ───────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    key: 'step1',
    badge: 'BƯỚC 1',
    Icon: Box,
    title: 'Chụp góc 45°',
    desc: 'Ước tính tự động độ sâu đĩa, kích cỡ tô phở và khẩu phần thực tế trên bàn ăn.',
    footerLabel: 'Cảm biến Depth-AI',
    FooterIcon: Sparkles,
  },
  {
    key: 'step2',
    badge: 'BƯỚC 2',
    Icon: Layers,
    title: 'Bóc tách món & topping',
    desc: 'Phân tách riêng rẽ: cơm, thịt nướng, chả trứng, rau thơm và nước xốt đi kèm.',
    footerLabel: 'Phân rã đa đối tượng',
    FooterIcon: Sliders,
  },
  {
    key: 'step3',
    badge: 'BƯỚC 3',
    Icon: BarChart3,
    title: 'Tính Calo & Macro',
    desc: 'Quy đổi thành khối lượng gram chuẩn viện dinh dưỡng và cộng dồn nhật ký trong ngày.',
    footerLabel: 'Độ chính xác 94.8%',
    FooterIcon: CheckCircle2,
  },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView edges={['top']} className="bg-surface/90 border-b border-border-hairline">
        <View className="h-16 px-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 32, height: 32 }}
              contentFit="contain"
            />
            <View>
              <Text className="font-montserrat-bold text-xl text-charcoal-pure tracking-tight leading-6">CaloViet</Text>
              <Text className="font-montserrat-medium text-xs text-zinc-500 tracking-wide">Nhật Ký</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable className="w-10 h-10 rounded-full items-center justify-center" accessibilityLabel="Thông báo">
              <Bell size={22} color="#52525B" />
            </Pressable>
            <View className="w-8 h-8 rounded-full bg-charcoal-pure overflow-hidden">
              <Image
                source={require('../../assets/images/avatartion.png')}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting row */}
        <View className="flex-row items-center justify-between pt-1">
          <View className="flex-row items-center gap-2.5 flex-1">
            <View className="flex-1 min-w-0">
              <Text className="font-montserrat-semibold text-base text-charcoal-pure tracking-tight">Chào Phúc, sẵn sàng chưa?</Text>
              <Text className="font-montserrat text-xs text-zinc-500 mt-0.5">
                Mục tiêu hôm nay:{' '}
                <Text className="font-montserrat-bold text-charcoal-pure">2,100 kcal</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Calorie Ring Hero Card */}
        <CalorieRing goal={2100} consumed={650} burned={320} />

        {/* Dark Banner */}
        <View className="rounded-[24px] overflow-hidden bg-charcoal-pure border border-zinc-800 shadow-lg relative">
          <Image
            source="https://lh3.googleusercontent.com/aida-public/AB6AXuDyg3hVrZMCHY4qzuuPofJUqtIWaH5Rj9_saw83EvBM3EeiVLE1a_hioeco98LMeJqxw3UpnLSdzIzB4Y9Qcgxr0uFQ_w0PPsc2vOwAuHAIL6ftQnk2IBI8wZVkE2fgPsYFL81iPRl97T6V3At8hzK2qHdisX7ea8TDw8Hy17LcmSDc5FNOsC2ox4amdoOlPBfaDCkQj5ZBmMBehQ_5S-5YIv1bejGuh0dUsdD-hMEJr0SzGrPINkF8xw"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            contentFit="cover"
          />
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-950/70" />
          <View className="p-5 z-10">
            <View className="flex-row items-center gap-1.5 self-start px-3 py-1.5 rounded-full bg-white/10 border border-white/15 mb-3">
              <Sparkles size={12} color="#E4E4E7" />
              <Text className="font-montserrat-bold text-[10px] text-white uppercase tracking-widest">AI Food Scanner</Text>
            </View>
            <Text className="font-montserrat-bold text-base text-white tracking-tight mb-1.5 leading-6">
              Nhận diện tức thì các món ăn Việt
            </Text>
            <Text className="font-montserrat text-[13px] text-zinc-300 leading-5 mb-3">
              Thuật toán chuyên sâu phân tách thành phần các món ăn tự động.
            </Text>
            <View className="self-start px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Text className="font-montserrat-medium text-xs text-zinc-200">
                Ước tính thể tích tô và độ sâu đĩa
              </Text>
            </View>
          </View>
        </View>

        {/* Snap CTA */}
        <PressScale onPress={() => router.push('/scan')}>
          <View className="rounded-2xl bg-charcoal-pure border border-zinc-700 shadow-xl h-14 flex-row items-center justify-center gap-2.5 px-6">
            <Camera size={24} color="#FFFFFF" />
            <Text className="font-montserrat-bold text-base text-white tracking-tight flex-1 text-center">Quét bữa ăn ngay</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </View>
        </PressScale>

        {/* How It Works */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between px-0.5">
            <View>
              <Text className="font-montserrat-bold text-base text-charcoal-pure tracking-tight">Cách CaloViet AI hoạt động</Text>
              <Text className="font-montserrat text-xs text-zinc-500 mt-0.5">Quy trình lượng hóa món ăn chỉ trong 2 giây</Text>
            </View>
            <Pressable>
              <Text className="font-montserrat-semibold text-xs text-charcoal-pure">Xem thêm</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 2, paddingRight: 16, gap: 14 }}
          >
            {HOW_STEPS.map(({ key, badge, Icon, title, desc, footerLabel, FooterIcon }) => (
              <View key={key} className="w-[240px] p-4 rounded-2xl bg-canvas-white border border-border-hairline justify-between shadow-sm">
                <View>
                  <View className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/80 items-center justify-center mb-3">
                    <Icon size={22} color="#18181B" />
                  </View>
                  <View className="self-start px-2 py-0.5 rounded bg-zinc-100 mb-1.5">
                    <Text className="font-montserrat-bold text-[10px] text-zinc-600">{badge}</Text>
                  </View>
                  <Text className="font-montserrat-bold text-[15px] text-charcoal-pure leading-snug mb-1.5">{title}</Text>
                  <Text className="font-montserrat text-xs text-zinc-500 leading-relaxed">{desc}</Text>
                </View>
                <View className="mt-4 pt-3 border-t border-zinc-100 flex-row items-center justify-between">
                  <Text className="font-montserrat-semibold text-[11px] text-charcoal-pure">{footerLabel}</Text>
                  <FooterIcon size={14} color="#18181B" />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent log */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between px-0.5">
            <View className="flex-row items-center gap-2">
              <Text className="font-montserrat-bold text-base text-charcoal-pure tracking-tight">Bữa sáng đã ghi nhận</Text>
              <View className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200">
                <Text className="font-montserrat-bold text-[11px] text-charcoal-pure">650 kcal</Text>
              </View>
            </View>
            <Pressable>
              <Text className="font-montserrat-semibold text-xs text-charcoal-pure">Chỉnh sửa</Text>
            </Pressable>
          </View>
          <View className="p-4 rounded-3xl bg-canvas-white border border-border-hairline flex-row items-center gap-3 shadow-sm">
            <View className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
              <Image
                source="https://lh3.googleusercontent.com/aida-public/AB6AXuBfkkjEakLFXs1rjrfu1h-DyUsiHkgnY1fy2sddlG_m_PRuSGCd6w8LfxN7v2KCQXX22BE5jHwp3YcHqptGe-StzVsUz1hS6Kj10nwYO_6pRzg9U42Q5NEiN_AOfqNvP6B06MPTmb-QKWPKEtywietai5HLV3wRScxqBrQ39pcH5Fre4MzQ7yB3AW2aK0ZImmdJBCjSVmJY0RtLX8aOwTgUz-_p2eTGuhi_pej84IqR"
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
            <View className="flex-1 min-w-0">
              <View className="flex-row items-center justify-between gap-1">
                <Text className="font-montserrat-bold text-[15px] text-charcoal-pure flex-1" numberOfLines={1}>Phở bò tái nạm gầu</Text>
                <Text className="font-montserrat-bold text-sm text-charcoal-pure shrink-0">520 kcal</Text>
              </View>
              <Text className="font-montserrat text-xs text-zinc-500 mt-1" numberOfLines={1}>
                1 tô vừa (580g) • Nước dùng trong, ít béo
              </Text>
              <View className="flex-row gap-1.5 mt-2">
                <View className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
                  <Text className="font-montserrat-bold text-[10px] text-slate-700">P: 34g</Text>
                </View>
                <View className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                  <Text className="font-montserrat-bold text-[10px] text-amber-800">C: 62g</Text>
                </View>
                <View className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
                  <Text className="font-montserrat-bold text-[10px] text-rose-800">F: 14g</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="h-28" />
      </ScrollView>
    </View>
  );
}
