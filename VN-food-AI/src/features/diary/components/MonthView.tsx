import { DayCellResponse, MonthlyDiaryItem } from "@/api/generated/model";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { dateUtils } from "@/lib/utils";
import { YearMonth, YearMonthDay } from "@/types/date";
import { Image } from "expo-image";
import { CircleIcon } from "lucide-react-native";
import { useMemo } from "react";
import { Text, useWindowDimensions, View } from "react-native";

export interface MonthViewProps {
  month: YearMonth;
  data?: MonthlyDiaryItem;
}

export function MonthView({ month, data }: MonthViewProps) {
  const { width } = useWindowDimensions();
  const cellSize = (width - 84) / 7;
  const [y, m] = dateUtils.getFromDateFormat(month).map(Number);
  const offset = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();

  const dayHasData = useMemo<Map<number, DayCellResponse | null>>(() => {
    const d =
      data?.days.map((data): [number, DayCellResponse | null] => {
        const [_y, _m, d] = dateUtils.getFromDateFormat(
          data.date as YearMonthDay,
        );
        const day = Number(d);

        return isNaN(day) ? [-1, null] : [day, data];
      }) ?? [];

    return new Map(d);
  }, [data]);

  const loadImageCell = (day: number) => {
    const data = dayHasData.get(day);
    return data && data.representative_image_url ? (
      <View className="rounded-xl overflow-hidden h-full w-full">
        <Image
          source={{
            uri: data.representative_image_url,
          }}
          cachePolicy="memory"
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          recyclingKey={`${y}-${m}-${day}-img`}
        />
      </View>
    ) : (
      <View className="w-full h-full bg-gray-400" />
    );
  };

  return (
    <View className="mx-2.5 justify-center rounded-3xl border border-border-hairline bg-white shadow-sm shadow-slate-500/50 items-center overflow-hidden">
      <View className="p-4 border-b border-b-slate-200 items-center mb-2 w-full flex-row">
        <Text className="flex-1 font-montserrat-bold text-black text-lg">
          {`${dateUtils.getMonthLabel(m)} năm ${y}`}
        </Text>
        <Badge className="bg-[#333333]">
          <Icon as={CircleIcon} size={10} fill={"#FFC928"} color={"#FFC928"} />
          <Text className="font-montserrat-medium text-sm text-white">
            {`${data?.total_kcal ?? 0} kcal/ngày`}
          </Text>
        </Badge>
      </View>
      <View className="flex-row flex-wrap gap-1 w-full pl-2 py-2">
        {Array.from({ length: offset }).map((_, i) => (
          <View
            key={`e${i}`}
            className="justify-center items-center mb-2"
            style={{ width: cellSize, height: cellSize }}
          />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          return data ? (
            <View
              key={day}
              className="mb-2"
              style={{
                width: cellSize,
                height: cellSize,
                padding: 1,
              }}>
              {dayHasData.has(day) ? (
                loadImageCell(day)
              ) : (
                <View
                  key={`e${i}`}
                  className="justify-center items-center mb-2"
                  style={{ width: cellSize, height: cellSize }}>
                  <View
                    className="rounded-full bg-zinc-200"
                    style={{ width: cellSize / 6, height: cellSize / 6 }}
                  />
                </View>
              )}
            </View>
          ) : (
            <View
              key={day}
              className="mb-2"
              style={{
                width: cellSize,
                height: cellSize,
                padding: 1,
              }}>
              <View className="w-full h-full rounded-xl border-0 justify-center items-center bg-gray-300" />
            </View>
          );
        })}
      </View>
    </View>
  );
}
