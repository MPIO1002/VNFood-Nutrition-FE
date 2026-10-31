import StepLoadingScreen from "@/features/health-register/components/StepLoadingScreen";
import { HEALTH_STEPS } from "@/features/health-register/constant/register";
import UserHealthInformationContextProvider from "@/features/health-register/context/UserHealthInformationContextProvider";
import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function HealthRegisterLayout() {
  const [loadingStepsProgress, setLoadingStepsProgress] = useState(0);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onAllStepsReady = () => {
    timerRef.current = setTimeout(() => setIsLoadingSteps(false), 500);
  };

  return (
    <UserHealthInformationContextProvider
      totalSteps={HEALTH_STEPS.length}
      startLoading={() => setIsLoadingSteps(true)}
      onLoadingProgressChange={(progress) => setLoadingStepsProgress(progress)}
      onAllReady={() => onAllStepsReady()}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="condition" />
        <Stack.Screen name="(steps)" />
        <Stack.Screen name="submit" />
      </Stack>
      {isLoadingSteps && <StepLoadingScreen progress={loadingStepsProgress} />}
    </UserHealthInformationContextProvider>
  );
}
