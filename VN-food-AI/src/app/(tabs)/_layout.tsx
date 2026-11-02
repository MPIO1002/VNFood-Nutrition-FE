import { AppHeader } from "@/components/AppHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthContext } from "@/features/auth";
import { useProfileQuery } from "@/features/profile";
import { router, Tabs } from "expo-router";
import { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import {
  Book,
  ScanText,
  TrendingUp,
  UserCircle,
  UtensilsCrossed,
} from "lucide-react-native";
import { useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressScale } from "../../components/PressScale";

function navigateToTab(routeName: string) {
  switch (routeName) {
    case "analytics":
      router.navigate("/(tabs)/analytics");
      break;
    case "scan":
      router.navigate("/scan");
      break;
    case "menu":
      router.navigate("/(tabs)/menu");
      break;
    case "profile":
      router.navigate("/(tabs)/profile");
      break;
    default:
      router.navigate("/(tabs)");
  }
}

function CustomTabBar({ state, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedKey = state.routes[state.index].key;
  const routes = state.routes.toSpliced(2, 0, {
    key: "scan",
    name: "scan",
  } as (typeof state.routes)[number]);

  return (
    <View
      className="absolute bottom-0 w-full flex-row bg-white border-t border-zinc-200 shadow-sm"
      style={{
        paddingBottom: Platform.OS === "ios" ? Math.max(insets.bottom, 12) : 12,
        paddingTop: 12,
      }}>
      {routes.map((route) => {
        const isFocused = focusedKey === route.key;

        const onPress = () => {
          if (!isFocused) {
            navigateToTab(route.name);
          }
        };

        // Configuration based on route name
        let Icon = Book;
        let label = "Trang chủ";

        if (route.name === "analytics") {
          Icon = TrendingUp;
          label = "Phân tích";
        } else if (route.name === "scan") {
          Icon = ScanText;
          label = "Quét AI";
        } else if (route.name === "menu") {
          Icon = UtensilsCrossed;
          label = "Nhật ký";
        } else if (route.name === "profile") {
          Icon = UserCircle;
          label = "Cá nhân";
        }

        const color = isFocused ? "#18181B" : "#71717A";

        // Special FAB layout for scan tab
        if (route.name === "scan") {
          return (
            <View key={route.key} className="flex-1 items-center justify-start">
              <PressScale onPress={onPress} toValue={0.95}>
                <View className="items-center -mt-8">
                  <View
                    className="w-[60px] h-[60px] rounded-full bg-charcoal-pure items-center justify-center border-4 border-canvas-white shadow-lg"
                    style={{
                      shadowColor: "#18181B",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 12,
                      elevation: 8,
                    }}>
                    <Icon size={26} color="#FFFFFF" />
                  </View>
                  <Text className="font-montserrat-semibold text-[11px] text-charcoal-pure mt-1">
                    {label}
                  </Text>
                </View>
              </PressScale>
            </View>
          );
        }

        const { options } = descriptors[route.key];
        // Normal tab layout
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            className="flex-1 items-center justify-center gap-1.5 pt-1">
            <Icon size={24} color={color} strokeWidth={isFocused ? 2.5 : 2} />
            <Text
              className={`font-montserrat text-[10px] ${isFocused ? "font-montserrat-semibold text-charcoal-pure" : "text-zinc-500"}`}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  const [isShowLogOutAlert, setIsShowLogOutAlert] = useState(false);
  const { logOut } = useAuthContext();
  const profileQuery = useProfileQuery();

  const onLogout = async () => {
    setIsShowLogOutAlert(false);
    await logOut();
  };

  return (
    <View className="w-full h-full">
      <AppHeader
        pageTitle="Cá nhân"
        avatarUri={profileQuery?.data?.avatar_url}
        onSettingsPress={() =>
          Alert.alert(
            "Cài đặt",
            "Tính năng cài đặt hồ sơ đang được phát triển.",
          )
        }
        onLogoutPress={() => setIsShowLogOutAlert(true)}
      />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="analytics" />
        <Tabs.Screen name="menu" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <AlertDialog open={isShowLogOutAlert}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-montserrat-bold">
              Đăng xuất
            </AlertDialogTitle>
            <AlertDialogDescription className="font-montserrat">
              Bạn có chắc chắn muốn đăng xuất ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end">
            <AlertDialogAction
              className="bg-charcoal-pure"
              onPress={() => onLogout()}>
              <Text className="font-montserrat text-white">Đăng xuất</Text>
            </AlertDialogAction>
            <AlertDialogCancel
              className="border-0"
              onPress={() => setIsShowLogOutAlert(false)}>
              <Text className="font-montserrat text-charcoal-pure">Hủy</Text>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
