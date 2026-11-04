import { Text, View } from "react-native";

interface MacroCardColors {
  background: string;
  border: string;
  text: string;
  track: string;
  fill: string;
}

interface MacroCardProps {
  label: string;
  value: number;
  goal: number | null | undefined;
  colors: MacroCardColors;
}

export function MacroCard({
  label,
  value,
  goal,
  colors,
}: MacroCardProps) {
  const percentage = goal && goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const formattedValue = Math.round(value);
  const formattedGoal = goal == null ? "--" : `${Math.round(goal)}g`;

  return (
    <View
      className={`flex-1 rounded-2xl border p-3 ${colors.background} ${colors.border}`}>
      <View className="mb-2 flex-row items-center justify-between">
        <Text
          className={`font-montserrat-semibold text-[11px] ${colors.text}`}>
          {label}
        </Text>
        <Text className={`font-montserrat-bold text-[11px] ${colors.text}`}>
          {goal && goal > 0 ? `${Math.round(percentage)}%` : "--"}
        </Text>
      </View>
      <View
        className={`mb-2 h-[5px] overflow-hidden rounded-full ${colors.track}`}>
        <View
          className={`h-full ${colors.fill}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
      <Text className="font-montserrat-bold text-[13px] text-charcoal-pure">
        {formattedValue}
        <Text className="font-montserrat-medium text-[11px] text-zinc-400">
          /{formattedGoal}
        </Text>
      </Text>
    </View>
  );
}
