import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import * as SelectPrimitive from "@rn-primitives/select";
import { CheckIcon, LucideIcon } from "lucide-react-native";
import { ColorValue, Platform, View } from "react-native";

export interface MealSelectItemProps extends React.ComponentProps<
  typeof SelectPrimitive.Item
> {
  checkColor?: ColorValue;
  textColor?: ColorValue;
  icon?: LucideIcon;
  iconColor?: ColorValue;
  iconSize?: number;
  iconFillColor?: ColorValue;
}

export default function MealSelectItem({
  className,
  children,
  checkColor,
  textColor,
  icon,
  iconSize,
  iconColor,
  iconFillColor,
  ...props
}: MealSelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "active:bg-accent group relative flex w-full flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 sm:py-1.5",
        Platform.select({
          web: "focus:bg-accent focus:text-accent-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 cursor-default outline-none data-[disabled]:pointer-events-none [&_svg]:pointer-events-none",
        }),
        props.disabled && "opacity-50",
        className,
      )}
      {...props}>
      <View className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon
            as={CheckIcon}
            color={checkColor ?? "black"}
            className="text-muted-foreground size-4 shrink-0"
          />
        </SelectPrimitive.ItemIndicator>
      </View>
      <View className="w-full flex-row items-center gap-2">
        {icon && (
          <Icon
            as={icon}
            color={iconColor ?? "black"}
            fill={iconFillColor ?? "black"}
            size={iconSize ?? 10}
          />
        )}
        <SelectPrimitive.ItemText
          className="text-foreground group-active:text-accent-foreground select-none text-sm font-montserrat"
          style={{
            color: textColor ?? "black",
          }}
        />
      </View>
    </SelectPrimitive.Item>
  );
}
