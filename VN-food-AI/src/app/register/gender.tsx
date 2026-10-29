import { MetabolismRequest, SexForEquation } from "@/api/generated/model";
import { Separator } from "@/components/ui/separator";
import { useUserHealthInformationContext } from "@/features/health-register";
import AthleteConditionBox from "@/features/health-register/gender/components/condition/AthleteConditionBox";
import MetabolismConditionBox from "@/features/health-register/gender/components/condition/MetabolismConditionBox";
import PregnantConditionBox from "@/features/health-register/gender/components/condition/PregnantConditionBox";
import FemaleGenderBox from "@/features/health-register/gender/components/FemaleGenderBox";
import MaleGenderBox from "@/features/health-register/gender/components/MaleGenderBox";
import { router } from "expo-router";
import { ArrowRight, LockIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputGenderScreen() {
  const insets = useSafeAreaInsets();
  const { markReady, assginMultipleMetabolismFieldData } =
    useUserHealthInformationContext();
  const [choice, setChoice] = useState<SexForEquation>("male");
  const [isAthlete, setIsAthlete] = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);
  const [isHaveMetabolismCondition, setIsHaveMetabolismCondition] =
    useState(false);

  useEffect(() => {
    markReady("gender");
  }, []);

  const onNext = () => {
    const data: Partial<MetabolismRequest> = {
      sex_for_equation: choice,
      competitive_athlete: false,
      pregnant_or_breastfeeding: false,
      metabolism_affecting_condition: false,
    };

    if (isAthlete) {
      data.competitive_athlete = true;
    }
    if (isPregnant) {
      data.pregnant_or_breastfeeding = true;
    }
    if (isHaveMetabolismCondition) {
      data.metabolism_affecting_condition = true;
    }

    assginMultipleMetabolismFieldData(data);
    router.push("/register/age");
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
        paddingBottom: Math.max(insets.bottom, 16),
      }}
      showsVerticalScrollIndicator={false}>
      <View
        className="bg-gray-100 flex-1 px-5 gap-2"
        style={{
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 16),
        }}>
        <View className="w-full">
          <Text className="font-montserrat-bold text-xl text-charcoal-pure">
            Giới tính sinh học của bạn là gì ?
          </Text>
          <Text className="font-montserrat text-sm text-gray-400 mt-1">
            Giới tính sinh học quyết định trực tiếp đến tỷ lệ trao đổi chất cơ
            bản (BMR) và công thức tính năng lượng tiêu hao chuẩn khoa học.
          </Text>
        </View>
        <View className="w-full gap-5 mt-2">
          <MaleGenderBox
            activated={choice === "male"}
            onPress={() => {
              setChoice("male");
              setIsPregnant(false);
            }}
          />
          <FemaleGenderBox
            activated={choice === "female"}
            onPress={() => setChoice("female")}
          />
        </View>
        <View className="w-full justify-center items-center my-2 flex-row gap-2">
          <View className="flex-1 ml-3">
            <Separator className="bg-gray-300" />
          </View>
          <Text className="font-montserrat-bold text-xl">
            Tình trạng cơ thể
          </Text>
          <View className="flex-1 mr-3">
            <Separator className="bg-gray-300" />
          </View>
        </View>
        <View className="w-full flex-row flex-wrap items-center justify-center gap-2">
          <Animated.View
            className="min-w-32 max-w-40 flex-1 h-72"
            layout={LinearTransition.duration(250)}
            entering={FadeIn}
            exiting={FadeOut.duration(200)}>
            <AthleteConditionBox
              className="min-w-32 max-w-40 h-72"
              activated={isAthlete}
              onPress={() => {
                setIsAthlete((prev) => !prev);
              }}
            />
          </Animated.View>
          {choice == "female" && (
            <Animated.View
              className="min-w-32 max-w-40 flex-1 h-72"
              layout={LinearTransition.duration(250)}
              entering={FadeIn}
              exiting={FadeOut.duration(200)}>
              <PregnantConditionBox
                className="min-w-32 max-w-40 h-72"
                activated={isPregnant}
                onPress={() => {
                  setIsPregnant((prev) => !prev);
                }}
              />
            </Animated.View>
          )}
          <Animated.View
            className="min-w-32 max-w-40 flex-1 h-72"
            layout={LinearTransition.duration(250)}
            entering={FadeIn}
            exiting={FadeOut.duration(200)}>
            <MetabolismConditionBox
              className="min-w-32 max-w-40 h-72"
              activated={isHaveMetabolismCondition}
              onPress={() => {
                setIsHaveMetabolismCondition((prev) => !prev);
              }}
            />
          </Animated.View>
        </View>
        <View className="w-full gap-2.5 mt-3">
          <Pressable
            className="w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40"
            onPress={onNext}>
            <Text className="font-montserrat-bold text-[15px] text-white">
              {"Tiếp tục (Chọn độ tuổi)"}
            </Text>
            <ArrowRight size={18} color="#FFF" />
          </Pressable>
          <View className="w-full flex-row items-center justify-center gap-1.5 pb-1">
            <LockIcon size={12} color={"#9ca3af"} />
            <Text className="text-xs font-montserrat text-center text-gray-400">
              Dữ liệu được bảo mật an toàn cho lộ trình cá nhân
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
