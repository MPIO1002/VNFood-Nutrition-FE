import { useUserHealthInformationContextController } from "@/context/register/hooks/useUserHealthInformationContext";
import { router } from "expo-router";
import { ArrowRight, Check, Lock } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Line, Polyline } from "react-native-svg";

function MarsIcon({ color = "#18181B", size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Circle cx="10" cy="14" r="5" />
      <Line x1="13.5" y1="10.5" x2="20" y2="4" />
      <Polyline points="15 4 20 4 20 9" />
    </Svg>
  );
}

function VenusIcon({ color = "#18181B", size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Circle cx="12" cy="9" r="5" />
      <Line x1="12" y1="14" x2="12" y2="21" />
      <Line x1="9" y1="18" x2="15" y2="18" />
    </Svg>
  );
}

export default function InputGenderScreen() {
  const insets = useSafeAreaInsets();
  const { markReady, data, updateData } =
    useUserHealthInformationContextController();

  const [selectedGender, setSelectedGender] = useState<"male" | "female">(
    data?.gender || "male",
  );

  useEffect(() => {
    markReady("gender");
  }, []);

  const handleSelect = (gender: "male" | "female") => {
    setSelectedGender(gender);
    updateData({ gender });
  };

  const isMale = selectedGender === "male";

  return (
    <View
      className="bg-gray-100 flex-1 px-5"
      style={{
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 16),
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingBottom: 8,
        }}>
        <View className="w-full gap-4">
          {/* Header Title & Subtitle */}
          <View className="w-full">
            <Text className="font-montserrat-bold text-2xl text-charcoal-pure">
              Giới tính sinh học của bạn là gì?
            </Text>
            <Text className="font-montserrat text-sm text-gray-400 mt-1 leading-5">
              Giới tính sinh học quyết định trực tiếp đến tỷ lệ trao đổi chất cơ bản
              (BMR) và công thức tính năng lượng tiêu hao chuẩn khoa học.
            </Text>
          </View>

          {/* Options: Male & Female */}
          <View className="w-full gap-3 mt-1">
            {/* Nam giới */}
            <Pressable
              onPress={() => handleSelect("male")}
              className={`w-full p-4 rounded-2xl bg-white flex-row items-center justify-between shadow-sm active:opacity-90 ${isMale ? "border-2 border-charcoal-pure" : "border border-gray-100"
                }`}>
              <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center">
                  <MarsIcon size={22} color="#18181B" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-montserrat-bold text-base text-charcoal-pure">
                      Nam giới
                    </Text>
                    <View className="bg-gray-100 rounded-full px-2 py-0.5">
                      <Text className="font-montserrat-medium text-[11px] text-zinc-500">
                        XY
                      </Text>
                    </View>
                  </View>
                  <Text
                    numberOfLines={1}
                    className="font-montserrat text-xs text-zinc-400 mt-1">
                    Hệ số chuyển hóa BMR cao hơn do khối lượng cơ tự nhiên.
                  </Text>
                </View>
              </View>

              {/* Radio check */}
              <View
                className={`w-6 h-6 rounded-full items-center justify-center ${isMale ? "bg-charcoal-pure" : "border-2 border-gray-200 bg-white"
                  }`}>
                {isMale && <Check size={14} color="#FFF" strokeWidth={3} />}
              </View>
            </Pressable>

            {/* Nữ giới */}
            <Pressable
              onPress={() => handleSelect("female")}
              className={`w-full p-4 rounded-2xl bg-white flex-row items-center justify-between shadow-sm active:opacity-90 ${!isMale ? "border-2 border-charcoal-pure" : "border border-gray-100"
                }`}>
              <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center">
                  <VenusIcon size={22} color="#18181B" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-montserrat-bold text-base text-charcoal-pure">
                      Nữ giới
                    </Text>
                    <View className="bg-gray-100 rounded-full px-2 py-0.5">
                      <Text className="font-montserrat-medium text-[11px] text-zinc-500">
                        XX
                      </Text>
                    </View>
                  </View>
                  <Text
                    numberOfLines={1}
                    className="font-montserrat text-xs text-zinc-400 mt-1">
                    Tỷ lệ mỡ thiết yếu tự nhiên và chu kỳ nội tiết.
                  </Text>
                </View>
              </View>

              {/* Radio check */}
              <View
                className={`w-6 h-6 rounded-full items-center justify-center ${!isMale ? "bg-charcoal-pure" : "border-2 border-gray-200 bg-white"
                  }`}>
                {!isMale && <Check size={14} color="#FFF" strokeWidth={3} />}
              </View>
            </Pressable>
          </View>

          {/* HỆ SỐ CƠ BẢN DỰ BÁO Card */}
          <View className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 gap-3 mt-1">
            <View className="w-full flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                <Text className="font-montserrat-bold text-xs text-charcoal-pure uppercase tracking-wider">
                  HỆ SỐ CƠ BẢN DỰ BÁO
                </Text>
              </View>
              <Text className="font-montserrat text-xs text-zinc-400">
                Mifflin-St Jeor
              </Text>
            </View>

            <View className="w-full flex-row gap-3">
              <View className="flex-1 bg-zinc-50 rounded-xl p-3">
                <Text className="font-montserrat text-xs text-zinc-500">
                  BMR Căn Bản
                </Text>
                <Text className="font-montserrat-bold text-base text-charcoal-pure mt-1">
                  {isMale ? "~ 1,680 kcal" : "~ 1,380 kcal"}
                </Text>
              </View>

              <View className="flex-1 bg-zinc-50 rounded-xl p-3">
                <Text className="font-montserrat text-xs text-zinc-500">
                  Hệ Số Chuyển Hóa
                </Text>
                <Text className="font-montserrat-bold text-base text-emerald-600 mt-1">
                  {isMale ? "+5 kcal" : "-161 kcal"}
                </Text>
              </View>
            </View>
          </View>

          {/* Privacy Note Card */}
          <View className="w-full bg-[#FAF9FC] rounded-2xl p-3.5 flex-row items-center gap-3 border border-gray-100">
            <Lock size={16} color="#4B5563" />
            <Text className="font-montserrat text-xs text-zinc-500 flex-1 leading-4">
              Dữ liệu giới tính chỉ dùng để cá nhân hóa công thức BMR (Mifflin-St Jeor)
              và bảo mật tuyệt đối.
            </Text>
          </View>
        </View>

        {/* Bottom Button */}
        <View className="w-full gap-2.5 mt-6">
          <Pressable
            className="w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40"
            onPress={() => router.push("/register/age")}>
            <Text className="font-montserrat-bold text-[15px] text-white">
              Tiếp tục (Nhập độ tuổi)
            </Text>
            <ArrowRight size={18} color="#FFF" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
