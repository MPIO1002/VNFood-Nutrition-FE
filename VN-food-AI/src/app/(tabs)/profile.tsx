import { useAuthContext } from "@/features/auth";
import { router } from "expo-router";
import {
  LogIn,
  LogOut,
  Mail,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const {
    currentUser: user,
    isAuthenticated,
    isLoading,
    logOut,
  } = useAuthContext();

  const onLogOut = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            await logOut();
            router.replace("/");
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#18181B" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FDFDFE]" edges={["top"]}>
      <View className="px-5 py-4 border-b border-zinc-100 flex-row items-center justify-between">
        <Text className="font-montserrat-bold text-xl text-charcoal-pure">
          Hồ sơ cá nhân
        </Text>
      </View>

      <View className="p-5">
        {isAuthenticated && user ? (
          <>
            {/* User Card */}
            <View className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm mb-6 items-center">
              <View className="w-20 h-20 rounded-full bg-zinc-900 items-center justify-center mb-4">
                <UserIcon size={36} color="#FFF" />
              </View>
              <Text className="font-montserrat-bold text-lg text-charcoal-pure mb-1">
                {user.full_name || "Người dùng CaloViet"}
              </Text>
              <View className="flex-row items-center gap-1.5 mb-3">
                <Mail size={14} color="#71717A" />
                <Text className="font-montserrat text-sm text-zinc-500">
                  {user.email}
                </Text>
              </View>
              <View className="flex-row items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full">
                <ShieldCheck size={14} color="#059669" />
                <Text className="font-montserrat-medium text-xs text-emerald-700">
                  Tài khoản đã kích hoạt
                </Text>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={onLogOut}
              activeOpacity={0.8}
              className="flex-row items-center justify-center gap-2 bg-rose-50 border border-rose-200 py-3.5 rounded-xl">
              <LogOut size={18} color="#E11D48" />
              <Text className="font-montserrat-semibold text-rose-600 text-sm">
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm items-center">
            <View className="w-16 h-16 rounded-full bg-zinc-100 items-center justify-center mb-4">
              <UserIcon size={28} color="#71717A" />
            </View>
            <Text className="font-montserrat-bold text-lg text-charcoal-pure mb-1">
              Chưa đăng nhập
            </Text>
            <Text className="font-montserrat text-xs text-zinc-500 text-center mb-5 leading-5">
              Bạn đang sử dụng ứng dụng dưới tư cách Khách. Đăng nhập để lưu trữ
              lịch sử món ăn và theo dõi dinh dưỡng.
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/")}
              className="bg-charcoal-pure px-6 py-3 rounded-xl flex-row items-center gap-2">
              <LogIn size={16} color="#FFF" />
              <Text className="font-montserrat-semibold text-white text-sm">
                Đăng nhập ngay
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
