import "../global.css";

import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { PortalHost } from "@rn-primitives/portal";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Appearance, LogBox, useColorScheme } from "react-native";

import LoadingScreen from "@/components/LoadingScreen";
import { AuthProvider, useAuthContext } from "@/features/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// REMINDER: Kill this if u want log show on u app
LogBox.ignoreAllLogs();
SplashScreen.preventAutoHideAsync();

const AppScreens = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="scan"
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="meal_detail"
            options={{ animation: "simple_push" }}
          />
          <Stack.Screen
            name="register"
            options={{ animation: "slide_from_right" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated} redirectTo={"/home"}>
          <Stack.Screen name="index" />
        </Stack.Protected>
      </Stack>
      <LoadingScreen show={isLoading} />
    </>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  //REMINDER: Force light mode for testing, remember to remove in the fututre
  Appearance.setColorScheme("light");

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <StatusBar style="auto"></StatusBar>
          <AppScreens />
          <PortalHost />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
