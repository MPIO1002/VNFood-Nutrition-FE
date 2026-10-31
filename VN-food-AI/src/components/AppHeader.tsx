import { Image } from "expo-image";
import { Bell, Settings, LogOut } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type AppHeaderProps = {
  pageTitle: string;
  avatarUri?: string | null;
  onAvatarPress?: () => void;
  onSettingsPress?: () => void;
  onLogoutPress?: () => void;
};

export function AppHeader({
  pageTitle,
  avatarUri,
  onAvatarPress,
  onSettingsPress,
  onLogoutPress,
}: AppHeaderProps) {
  const hasMenu = Boolean(onSettingsPress || onLogoutPress);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <SafeAreaView
      edges={["top"]}
      className="z-20 border-b border-border-hairline bg-surface/90">
      <View className="relative h-16 flex-row items-center justify-between px-4">
        <View className="flex-row items-center gap-2">
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 32, height: 32 }}
            contentFit="contain"
          />
          <View>
            <Text className="font-montserrat-bold text-xl leading-6 tracking-tight text-charcoal-pure">
              CaloViet
            </Text>
            <Text className="font-montserrat-medium text-xs tracking-wide text-zinc-500">
              {pageTitle}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full"
            accessibilityLabel="Thông báo">
            <Bell size={22} color="#52525B" />
          </Pressable>
          <Pressable
            className="h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-100"
            accessibilityLabel="Mở tài khoản"
            onPress={() => {
              if (hasMenu) setMenuOpen((open) => !open);
              onAvatarPress?.();
            }}>
            <Image
              source={
                avatarUri
                  ? { uri: avatarUri }
                  : require("../../assets/images/avatartion.png")
              }
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </Pressable>
        </View>
        {hasMenu && menuOpen && (
          <View
            className="absolute right-4 top-[58px] w-44 rounded-2xl border border-zinc-100 bg-white p-1.5"
            style={{
              elevation: 8,
              shadowColor: "#18181B",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
            }}>
            <Pressable
              className="flex-row items-center gap-3 rounded-xl px-3 py-3"
              onPress={onSettingsPress}>
              <Settings size={17} color="#52525B" />
              <Text className="font-montserrat-medium text-sm text-charcoal-pure">Cài đặt</Text>
            </Pressable>
            <Pressable
              className="flex-row items-center gap-3 rounded-xl px-3 py-3"
              onPress={onLogoutPress}>
              <LogOut size={17} color="#E11D48" />
              <Text className="font-montserrat-medium text-sm text-rose-600">Đăng xuất</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
