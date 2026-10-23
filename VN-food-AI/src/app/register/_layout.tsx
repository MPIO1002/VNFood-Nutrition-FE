import { useProgressStep } from "@/components/progress/step/hooks/useProgressStep";
import ProgressStep from "@/components/progress/step/ProgressStep";
import { HEALTH_INFORMATION_STEPS } from "@/constants/register";
import { Image } from "expo-image";
import { router, Tabs, usePathname } from "expo-router";
import { ArrowLeft, DotIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserHealthInformationContextProvider from "../../context/register/UserHealthInformationContextProvider";

function InputUserHealthInformationTopPanel() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const currentStepName = pathname.split("/").pop() ?? "gender";

  const getPageTitle = (step: string) => {
    switch (step) {
      case "gender":
        return "Giới tính";
      case "age":
        return "Độ tuổi";
      case "weight":
        return "Cân nặng";
      case "height":
        return "Chiều cao";
      case "activity":
        return "Mức độ vận động";
      case "plan":
        return "Mục tiêu vóc dáng";
      default:
        return "Thông tin cá nhân";
    }
  };

  return (
    <View
      className="w-full h-fit gap-1 top-0 bg-white"
      style={{
        paddingTop: insets.top,
      }}>
      <View className="flex-row items-center justify-between h-14 px-5 relative">
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          }}
          hitSlop={12}
          className="z-10 p-2 -ml-2 active:opacity-40">
          <ArrowLeft size={20} color="black" />
        </Pressable>

        <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <Text className="font-montserrat-bold text-base text-charcoal-pure">
            {getPageTitle(currentStepName)}
          </Text>
        </View>

        {/* Empty placeholder to balance the flex-row layout */}
        <View className="w-8" />
      </View>
      <UserProgress></UserProgress>
    </View>
  );
}

function UserProgress() {
  const stepLength = HEALTH_INFORMATION_STEPS.length;
  const { currentStep, setStep } = useProgressStep({
    steps: stepLength,
  });
  const pathname = usePathname();
  useEffect(() => {
    const name = pathname.split("/").pop() ?? "";
    const index = HEALTH_INFORMATION_STEPS.indexOf(name);
    if (index !== -1) {
      setStep(index);
    }
  }, [pathname]);

  const getStepCategory = (step: number) => {
    switch (step) {
      case 0:
      case 1:
        return "THÔNG TIN BAN ĐẦU";
      case 2:
      case 3:
        return "THỂ TRẠNG BAN ĐẦU";
      case 4:
        return "THÓI QUEN SINH HOẠT";
      case 5:
        return "MỤC TIÊU CÁ NHÂN";
      default:
        return "THÔNG TIN BAN ĐẦU";
    }
  };

  return (
    <View className="w-full bg-gray-100 justify-center px-5 pt-3 pb-2">
      <View className="w-full flex-row items-center">
        <Text className="font-montserrat-bold text-xs text-zinc-500 uppercase">
          BƯỚC {currentStep + 1} TRÊN {stepLength}
        </Text>
        <DotIcon size={16} color="#71717a" />
        <Text className="font-montserrat-bold text-xs text-zinc-500 uppercase">
          {getStepCategory(currentStep)}
        </Text>
      </View>
      <View className="w-full mt-2">
        <ProgressStep
          currentStep={currentStep}
          totalSteps={stepLength}
          color={"#E4E4E7"}
          currentColor={"#000000"}
          finishedColor={"#000000"}></ProgressStep>
      </View>
    </View>
  );
}

export default function InputUserHealthInformationLayout() {
  const [isLoading, setIsLoading] = useState(true);

  // Safety fallback so loading overlay never gets stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <UserHealthInformationContextProvider
      totalSteps={HEALTH_INFORMATION_STEPS.length}
      onAllReady={() => setIsLoading(false)}>
      <View className="bg-white w-full h-full">
        <InputUserHealthInformationTopPanel></InputUserHealthInformationTopPanel>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Tabs
            backBehavior="history"
            screenOptions={{
              lazy: false,
              freezeOnBlur: false,
              headerShown: false,
              animation: "shift",
              tabBarStyle: { display: "none" },
            }}>
            {HEALTH_INFORMATION_STEPS.map((name, i) => (
              <Tabs.Screen key={i} name={name}></Tabs.Screen>
            ))}
          </Tabs>
        </GestureHandlerRootView>
      </View>
      {isLoading && (
        <View className="bg-white w-full h-full z-50 absolute justify-center items-center">
          <ActivityIndicator size={"large"} color={"black"}></ActivityIndicator>
        </View>
      )}
    </UserHealthInformationContextProvider>
  );
}
