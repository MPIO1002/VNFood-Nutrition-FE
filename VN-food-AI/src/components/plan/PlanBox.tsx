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
        className={`${className ?? ""} relative rounded-2xl bg-white p-3.5 gap-2 border ${
          activated ? "border-charcoal-pure border-2" : "border-zinc-200"
        }`}>
        <View className="absolute right-3 top-3">
          {activated ? (
            <CircleCheck size={24} fill={"black"} color={"white"} />
          ) : (
            <Circle size={24} fill={"#e4e4e7"} strokeWidth={0} />
          )}
        </View>
        {children}
      </View>
    </Pressable>
  );
}
