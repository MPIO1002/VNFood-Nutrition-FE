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

  return (
    <View
      className="w-full h-fit gap-1 top-0 bg-white"
      style={{
        paddingTop: insets.top,
      }}>
      <View className="flex-row h-20 gap-1 px-3">
        <View className="w-fit h-full justify-center">
          <Pressable
            onPress={() => {
              if (router.canDismiss()) router.dismissAll();
              router.replace("/");
            }}
            className="active:opacity-40">
            <ArrowLeft size={18} color="black" />
          </Pressable>
        </View>
        <View className="w-fit h-full justify-center ml-1">
          <Image
            source={require("@/../assets/images/logo.png")}
            style={{ width: 32, height: 32 }}
            contentFit="contain"
          />
        </View>
        <View className="h-full justify-center gap-0">
          <Text className="font-montserrat text-sm text-charcoal-pure leading-none">
            CaloViet
          </Text>
          <Text className="font-montserrat text-sm text-charcoal-pure">AI</Text>
        </View>
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
    setStep(HEALTH_INFORMATION_STEPS.indexOf(name));
  }, [pathname]);

  return (
    <View className="w-full bg-gray-100 h-15 justify-center px-3 pt-5">
      <View className="w-full flex-row items-center">
        <Text className="font-montserrat">
          Bước {currentStep + 1} trên {stepLength}
        </Text>
        <DotIcon />
        <Text className="font-montserrat">Thể trạng ban đầu</Text>
      </View>
      <View className="w-full">
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
              freezeOnBlur: true,
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
