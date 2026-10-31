import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserHealthInformationContext } from "@/features/health-register";
import AthleteConditionBox from "@/features/health-register/condition/AthleteConditionBox";
import MetabolismConditionBox from "@/features/health-register/condition/MetabolismConditionBox";
import PregnantConditionBox from "@/features/health-register/condition/PregnantConditionBox";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { Easing, FadeIn, FadeInUp } from "react-native-reanimated";

export default function ConditionCheckScreen() {
  const { startLoading } = useUserHealthInformationContext();

  const ANIMATE_DURATION = 400;
  const ANIMATE_DELAY_DURATION = 500;
  const ANIMATE_DELAY_CHAIN_MS = (n: number) =>
    ANIMATE_DELAY_DURATION * n + 100;

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isHavingCondition, setIsHavingCondition] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setButtonDisabled(false);
    }, []),
  );

  const onBackAuthPage = () => {
    if (buttonDisabled) return;
    setButtonDisabled(true);
    if (router.canDismiss()) router.dismissTo("/");
  };
  const onNext = () => {
    if (buttonDisabled) return;
    setButtonDisabled(true);
    startLoading?.();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        router.push("/register/(steps)/gender");
      });
    });
  };

  return (
    <View className="w-full h-full justify-center items-center p-4 gap-10">
      <Animated.View
        className="w-full"
        entering={FadeIn.duration(ANIMATE_DURATION)
          .delay(ANIMATE_DELAY_CHAIN_MS(1))
          .easing(Easing.out(Easing.ease))}>
        <Text className="font-montserrat-semibold text-lg text-center">
          Bạn có đang thuộc các trường hợp nào sau đây không ?
        </Text>
      </Animated.View>
      <Animated.View
        className="w-full flex-row gap-2 flex-wrap justify-center"
        entering={FadeInUp.duration(ANIMATE_DURATION)
          .delay(ANIMATE_DELAY_CHAIN_MS(2))
          .easing(Easing.out(Easing.ease))}>
        <AthleteConditionBox className="min-w-32 max-w-40" activated />
        <PregnantConditionBox className="min-w-32 max-w-40" activated />
        <MetabolismConditionBox className="min-w-32 max-w-40" activated />
      </Animated.View>
      <Animated.View
        className={`w-full gap-5 justify-center ${buttonDisabled && "opacity-60"}`}
        entering={FadeInUp.duration(ANIMATE_DURATION)
          .delay(ANIMATE_DELAY_CHAIN_MS(3))
          .easing(Easing.out(Easing.ease))}>
        <Pressable
          className="bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-70"
          disabled={buttonDisabled}
          onPress={() => setIsHavingCondition(true)}>
          <Text className="font-montserrat-bold text-lg text-white">Có</Text>
        </Pressable>
        <Pressable
          className="border border-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-70"
          disabled={buttonDisabled}
          onPress={onNext}>
          <Text className="font-montserrat-bold text-lg text-charcoal-pure">
            Không
          </Text>
        </Pressable>
      </Animated.View>
      <AlertDialog open={isHavingCondition}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-montserrat-bold">
              Nếu bạn thuộc trường hợp đặc biệt
            </AlertDialogTitle>
            <AlertDialogDescription className="font-montserrat">
              Các trường hợp này cần đánh giá chuyên môn hoặc công thức chuyên
              biệt, ứng dụng của chúng tôi không thể đáp ứng các trường hợp trên
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-black"
              onPress={() => onBackAuthPage()}>
              <Text className="font-montserrat text-white">Quay lại</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
