import { MonthlyDiaryItem } from "@/api/generated/model";
import { useMemo } from "react";
import { Text, useWindowDimensions, View } from "react-native";

export interface MonthViewProps {
  month: string;
  data?: MonthlyDiaryItem;
  active: boolean;
  onFinishedLoading?: () => void;
}

export function MonthView({
  month,
  data,
  active,
  onFinishedLoading,
}: MonthViewProps) {
  const { width } = useWindowDimensions();
  const cellSize = (width - 50) / 7;
  const [y, m] = month.split("-").map(Number);
  const offset = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();

  const daysHaveData = useMemo<Set<number>>(() => {
    const days =
      data?.days.map((data) => {
        const [_y, _m, d] = data.date.split("-");
        const day = Number(d);

        return isNaN(day) ? -1 : day;
      }) ?? [];

    return new Set(days);
  }, [data]);

  const getMonthLabel = () => {
    const monthNames = [
      "January",
      "Feburary",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthLabel =
      isNaN(m) || !monthNames[m - 1] ? "Unknown Month" : monthNames[m - 1];

    return `${monthLabel} ${y}`;
  };

  return (
    <View className="justify-center w-full rounded-3xl bg-surface shadow shadow-slate-800 items-center overflow-hidden">
      <View className="p-2 pl-5 justify-center bg-black w-full">
        <Text className="font-montserrat-bold text-white">
          {getMonthLabel()}
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-1 w-full pl-2 py-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <View
            key={`e${i}`}
            className="justify-center items-center"
            style={{ width: cellSize, height: cellSize }}>
            <Text className="font-montserrat">
              {i === 0 ? "Sun" : `T${i + 1}`}
            </Text>
          </View>
        ))}
      </View>
      {data ? (
        <View className="flex-row flex-wrap gap-1 w-full pl-2 py-2">
          {Array.from({ length: offset }).map((_, i) => (
            <View
              key={`e${i}`}
              className="justify-center items-center mb-2"
              style={{ width: cellSize, height: cellSize }}>
              <View
                className="rounded-full bg-gray-500"
                style={{ width: cellSize / 8, height: cellSize / 8 }}
              />
            </View>
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            return (
              <View
                key={day}
                className="mb-2"
                style={{
                  width: cellSize,
                  height: cellSize,
                  padding: 1,
                }}>
                <View className="w-full h-full rounded-xl border justify-center items-center">
                  {daysHaveData.has(day) ? (
                    <Text className="font-montserrat">yes</Text>
                  ) : (
                    <Text className="font-montserrat">no</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}
