import { ReactNode } from "react";
import { Pressable } from "react-native";

export interface ConditionBoxProps {
  activated?: boolean;
  className?: string;
  children?: ReactNode;
  onPress?: () => void;
}

export function ConditionBox({
  activated = false,
  className,
  children,
  onPress,
}: ConditionBoxProps) {
  return (
    <Pressable
      className={`${className ?? ""} justify-center relative rounded-[20px] bg-white p-4 gap-2 border ${
        activated
          ? "border-charcoal-pure border-2"
          : "border-zinc-200 opacity-70"
      }`}
      onPress={onPress}>
      {children}
    </Pressable>
  );
}
