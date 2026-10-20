import { Circle, CircleCheck } from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";

export interface PlanBoxProps {
  activated?: boolean;
  className?: string;
  children?: ReactNode;
  onPress?: () => void;
}

export function PlanBox({
  activated = false,
  className,
  children,
  onPress,
}: PlanBoxProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`${className ?? ""} relative rounded-lg bg-white p-2 gap-2 shadow-xl`}>
        <View className="absolute right-2 top-2">
          {activated ? (
            <CircleCheck size={30} fill={"black"} color={"white"}></CircleCheck>
          ) : (
            <Circle size={30} fill={"#d1d5db"} strokeWidth={0}></Circle>
          )}
        </View>
        {children}
      </View>
    </Pressable>
  );
}
