import { useFocusEffect } from "expo-router";
import { ArrowRightIcon, LockIcon } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";

export interface HealthRegisterNextButtonProps {
  onNext: () => void;
  disabled?: boolean;
  title?: string;
}

export default function HealthRegisterNextButton({
  onNext,
  title,
  disabled: disabledProp = false,
}: HealthRegisterNextButtonProps) {
  const [disabled, setDisabled] = useState(false);
  const DISABLE_MS = 1000;

  useFocusEffect(
    useCallback(() => {
      setDisabled(true);
      const timer = setTimeout(() => setDisabled(false), DISABLE_MS);
      return () => clearTimeout(timer);
    }, []),
  );

  return (
    <View className="w-full gap-2.5 mt-3">
      <Pressable
        className={`w-full bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2 active:opacity-40 ${disabled && "opacity-40"}`}
        disabled={disabled || disabledProp}
        onPress={onNext}>
        <Text className="font-montserrat-bold text-[15px] text-white">
          {title}
        </Text>
        <ArrowRightIcon size={18} color="#FFF" />
      </Pressable>
      <View className="w-full flex-row items-center justify-center gap-1.5 pb-1">
        <LockIcon size={12} color={"#9ca3af"} />
        <Text className="text-xs font-montserrat text-center text-gray-400">
          Dữ liệu được bảo mật an toàn cho lộ trình cá nhân
        </Text>
      </View>
    </View>
  );
}
