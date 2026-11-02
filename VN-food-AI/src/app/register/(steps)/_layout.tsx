import { useProgressStep } from "@/components/progress/step/hooks/useProgressStep";
import ProgressStep from "@/components/progress/step/ProgressStep";
import {
  HEALTH_STEPS,
  HealthSteps,
} from "@/features/health-register/constant/register";
import { router, Tabs, usePathname } from "expo-router";
import { ArrowLeft, DotIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function InputUserHealthInformationTopPanel() {
  const DISABLE_BACK_BUTTON_MS = 1000;
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [backButtonDisable, setBackButtonDisable] = useState(false);
  const backButtionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const currentStepName = pathname.split("/").pop() ?? "gender";

  useEffect(() => {
    return () => {
      if (backButtionTimerRef.current)
        clearTimeout(backButtionTimerRef.current);
    };
  }, []);

  const onDisableBackButton = () => {
    setBackButtonDisable(true);
    backButtionTimerRef.current = setTimeout(
      () => setBackButtonDisable(false),
      DISABLE_BACK_BUTTON_MS,
    );
  };

  useEffect(() => {
    onDisableBackButton();
  }, [pathname]);

  const handleBack = () => {
    if (backButtonDisable) return;

    onDisableBackButton();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

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
          onPress={handleBack}
          disabled={backButtonDisable}
          hitSlop={12}
          className={`z-10 p-2 -ml-2 active:opacity-40 ${backButtonDisable && "opacity-40"}`}>
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
  const stepLength = HEALTH_STEPS.length;
  const { currentStep, setStep } = useProgressStep({
    steps: stepLength,
  });
  const pathname = usePathname();
  const isValidStep = (step: string): step is HealthSteps =>
    (HEALTH_STEPS as readonly string[]).includes(step);

  useEffect(() => {
    const name = pathname.split("/").pop() ?? "";
    if (isValidStep(name)) setStep(HEALTH_STEPS.indexOf(name));
    else setStep(0);
  }, [pathname]);

  const stepCategory =
    currentStep === 2 ? "Mục tiêu cá nhân" : "Thể trạng ban đầu";

  return (
    <View className="w-full bg-gray-100 h-15 justify-center px-5 pt-4 pb-2">
      <View className="w-full flex-row items-center">
        <Text className="font-montserrat text-xs text-zinc-500">
          Bước {currentStep + 1} trên {stepLength}
        </Text>
        <DotIcon size={16} color="#71717a" />
        <Text className="font-montserrat text-xs text-zinc-500">
          {stepCategory}
        </Text>
      </View>
      <View className="w-full mt-1.5">
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
  return (
    <View className="bg-white w-full h-full">
      <InputUserHealthInformationTopPanel></InputUserHealthInformationTopPanel>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Tabs
          backBehavior="history"
          screenOptions={{
            lazy: false,
            freezeOnBlur: true,
            headerShown: false,
            animation: "shift",
            tabBarStyle: { display: "none" },
          }}>
          {HEALTH_STEPS.map((name, i) => (
            <Tabs.Screen key={i} name={name} />
          ))}
        </Tabs>
      </GestureHandlerRootView>
    </View>
  );
}
