import { Portal } from "@rn-primitives/portal";
import { router } from "expo-router";
import { CheckCircle2Icon, HomeIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  LinearTransition,
  SlideInRight,
  SlideOutDown,
} from "react-native-reanimated";

export default function MealSaveCompleteScreen({ show }: { show?: boolean }) {
  const onBackToHome = () => {
    if (router.canDismiss()) router.dismiss();
    else router.replace("/");
  };

  const [showRest, setShowRest] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowRest(true);
    }, 1000);
  }, [show]);

  return (
    show && (
      <Portal name="meal_saved_screen">
        <Animated.View
          className="w-full h-full bg-white justify-center items-center gap-3"
          entering={SlideInRight.duration(300)}
          exiting={SlideOutDown.duration(300).delay(100)}>
          <Animated.View
            layout={LinearTransition.easing(Easing.out(Easing.ease)).duration(
              700,
            )}>
            <CheckCircle2Icon size={120} color={"white"} fill={"green"} />
          </Animated.View>
          {showRest && (
            <Animated.View
              entering={FadeInDown.duration(700).easing(
                Easing.out(Easing.ease),
              )}
              className="justify-center items-center w-full gap-5 px-4">
              <Text className="font-montserrat text-xl">
                Bữa ăn đã lưu thành công
              </Text>
              <Pressable
                className={`w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40`}
                onPress={onBackToHome}>
                <HomeIcon size={18} color="#FFF" />
                <Text className="font-montserrat-bold text-[15px] text-white">
                  Quay về trang chủ
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>
      </Portal>
    )
  );
}
