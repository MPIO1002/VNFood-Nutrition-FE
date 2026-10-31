import { AppHeader } from "@/components/AppHeader";
import { useAuthContext } from "@/features/auth";
import { useProfileQuery } from "@/features/profile/hooks/profile.queries";
import { ProfileContent } from "@/features/profile/components/ProfileContent";
import { router } from "expo-router";
import { AlertCircle, UserRound } from "lucide-react-native";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const colors = { ink: "#18181B", muted: "#71717A", rose: "#E11D48" };

export default function ProfileScreen() {
  const { isAuthenticated, isLoading: authLoading, logOut } = useAuthContext();
  const profileQuery = useProfileQuery();

  if (authLoading || profileQuery.isLoading) {
    return <View className="flex-1 items-center justify-center bg-surface"><ActivityIndicator size="large" color={colors.ink} /></View>;
  }
  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface px-6">
        <UserRound size={42} color={colors.muted} />
        <Text className="mt-4 font-montserrat-semibold text-lg text-charcoal-pure">Chưa đăng nhập</Text>
        <Text className="mt-2 text-center font-montserrat text-xs leading-5 text-zinc-500">Đăng nhập để xem hồ sơ và theo dõi chỉ số dinh dưỡng.</Text>
        <Pressable className="mt-5 rounded-xl bg-charcoal-pure px-6 py-3" onPress={() => router.replace("/")}><Text className="font-montserrat-semibold text-sm text-white">Đăng nhập ngay</Text></Pressable>
      </SafeAreaView>
    );
  }
  if (profileQuery.isError || !profileQuery.data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface px-6">
        <AlertCircle size={36} color={colors.rose} />
        <Text className="mt-3 text-center font-montserrat text-sm text-charcoal-pure">Không thể tải hồ sơ.</Text>
        <Pressable className="mt-4 rounded-xl bg-charcoal-pure px-5 py-3" onPress={() => profileQuery.refetch()}><Text className="font-montserrat-semibold text-sm text-white">Thử lại</Text></Pressable>
      </SafeAreaView>
    );
  }

  const logout = () => Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
    { text: "Hủy" },
    { text: "Đăng xuất", style: "destructive", onPress: async () => { await logOut(); router.replace("/"); } },
  ]);

  return (
    <View className="flex-1 bg-surface">
      <AppHeader
        pageTitle="Cá nhân"
        avatarUri={profileQuery.data.avatar_url}
        onSettingsPress={() => Alert.alert("Cài đặt", "Tính năng cài đặt hồ sơ đang được phát triển.")}
        onLogoutPress={logout}
      />
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <ProfileContent key={profileQuery.data.updated_at} profile={profileQuery.data} />
      </ScrollView>
    </View>
  );
}
