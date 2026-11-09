import { Text, useWindowDimensions, View } from "react-native";

export interface MonthViewProps {
  month: string;
  active: boolean;
  onFinishedLoading?: () => void;
}

export function MonthView({
  month,
  active,
  onFinishedLoading,
}: MonthViewProps) {
  const { width } = useWindowDimensions();
  const cellSize = (width - 50) / 7;
  const [y, m] = month.split("-").map(Number);
  const offset = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();

  // const { data } = useQuery({
  //   queryKey: ['photos-month', month],
  //   queryFn: () => fetchMonth(month),
  //   enabled: active,                       // <- only fetch once visible
  //   staleTime: 1000 * 60 * 10,
  //   gcTime: 1000 * 60 * 60 * 24,
  // })

  // const byDay = new Map(data?.map((p) => [p.day, p]))

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
          // const photo = byDay.get(day)
          return (
            <View
              key={day}
              className="mb-2"
              style={{
                width: cellSize,
                height: cellSize,
                padding: 1,
              }}>
              {/* {photo ? (
                <Image
                  source={{ uri: photo.thumbUrl, cacheKey: photo.id + '_thumb' }}
                  placeholder={photo.blurhash ? { blurhash: photo.blurhash } : undefined}
                  cachePolicy="memory-disk"
                  contentFit="cover"
                  recyclingKey={photo.id}
                  style={{ flex: 1, borderRadius: 4 }}
                />
              ) : (
                <Text style={{ color: '#666', fontSize: 11 }}>{day}</Text>
              )} */}
              <View className="w-full h-full rounded-xl border justify-center items-center">
                <Text className="font-montserrat">{day}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
