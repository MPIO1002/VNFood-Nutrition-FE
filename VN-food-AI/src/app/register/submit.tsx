import LoadingDot from "@/components/LoadingDot";
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
import { useUserHealthInformationContext } from "@/features/health-register";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";

export default function SubmitHealthRegisterScreen() {
  const { submitMetabolismData } = useUserHealthInformationContext();
  const [isBackAlert, setIsBackAlert] = useState(false);
  const [isDoneSubmitted, setIsDoneSubmitted] = useState(false);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!isDoneSubmitted) setIsBackAlert(true);
      else {
        router.dismissTo("/");
      }
      return true;
    });

    submitMetabolismData({
      options: {
        onSuccess: () => {
          setIsDoneSubmitted(true);
        },
        onError: (e) => {
          console.log(e.response?.data.detail);
        },
      },
    });
    return () => sub.remove();
  }, []);

  const onMoveToApp = () => {
    if (router.canDismiss()) router.dismissTo("/");
    router.replace("/(tabs)");
  };

  const onBackAuthPage = () => {
    if (router.canDismiss()) router.dismissTo("/");
  };

  return (
    <View className="w-full h-full">
      <View className="bg-white w-full h-full absolute justify-center items-center p-4">
        <Animated.View
          layout={LinearTransition.duration(600)}
          className="w-20 h-20 mb-4 relative shadow-lg">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
          />
        </Animated.View>
        {!isDoneSubmitted ? (
          <Animated.View
            className="flex-row gap-1 justify-center items-center"
            exiting={FadeOutUp.duration(500)}>
            <Text className="font-montserrat text-center">
              Dữ liệu đang được xử lý. Đợi chút nhé
            </Text>
            <View className="flex-row gap-2 items-end h-full mb-3">
              <LoadingDot className="font-montserrat" y={-5} duration={1000} />
              <LoadingDot
                className="font-montserrat"
                y={-5}
                duration={1000}
                delay={150}
              />
              <LoadingDot
                className="font-montserrat"
                y={-5}
                duration={1000}
                delay={300}
              />
            </View>
          </Animated.View>
        ) : (
          <View className="gap-6 w-full">
            <Animated.View
              className="justify-center items-center"
              entering={FadeInUp.duration(500).delay(1000)}>
              <Text className="font-montserrat text-center">
                Đăng ký hồ sơ thành công, chúc bạn một hành trình thú vị cùng
                chúng tôi
              </Text>
            </Animated.View>
            <Animated.View
              className={`w-full justify-center`}
              entering={FadeInUp.duration(600)
                .delay(1500)
                .easing(Easing.out(Easing.ease))}>
              <Pressable
                className="bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-70"
                onPress={onMoveToApp}>
                <Text className="font-montserrat-bold text-lg text-white">
                  Khám phá CaloViet AI ngay
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        )}
      </View>
      <AlertDialog open={isBackAlert}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-montserrat-bold">
              Bạn có chắc chắn muốn quay lại trang đăng ký không ?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-montserrat">
              Dữ liệu đang được xử lý, nếu thoát có thể sẽ gây ra mất dữ liệu.
              Bạn vẫn muốn chứ ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-black"
              onPress={() => setIsBackAlert(false)}>
              <Text className="font-montserrat text-white">Ở lại</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500"
              onPress={() => onBackAuthPage()}>
              <Text className="font-montserrat text-white">Quay lại</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
