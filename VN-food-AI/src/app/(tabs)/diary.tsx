import { Skeleton } from "@/components/ui/skeleton";
import { MonthView } from "@/features/diary/components/MonthView";
import { useDiary } from "@/features/diary/hooks/useDiary";
import { LegendList } from "@legendapp/list/react-native";
import { useBottomTabBarHeight } from "expo-router/build/layouts/TabsClient.js";
import { ForkKnifeCrossedIcon } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

export default function DiaryScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [error, setError] = useState<Error | null>(null);

  const {
    LIMIT,
    months,
    isFetchingNextPage,
    activeMonths,
    readyRef,
    viewabilityConfig,
    onLoadOlderMonths,
    onViewableItemsChanged,
  } = useDiary();

  return (
    <View className="bg-surface w-full h-full">
      {error ? (
        <View className="justify-center items-center">
          <Text className="font-montserrat">Some shit wrong dude</Text>
          <Text className="font-montserrat">{error.message}</Text>
        </View>
      ) : (
        <View className="flex-1 py-10 gap-10">
          <View
            className="w-full h-10 relative justify-center items-center"
            style={{ display: isFetchingNextPage ? "flex" : "none" }}>
            <Skeleton className="absolute w-full h-full rounded-xl bg-gray-300 z-5" />
            <ForkKnifeCrossedIcon className="z-20" size={20} color={"black"} />
          </View>
          <LegendList
            data={months}
            drawDistance={1500}
            keyExtractor={(m) => m.key}
            extraData={activeMonths}
            initialScrollIndex={LIMIT - 1}
            maintainVisibleContentPosition
            onStartReached={() =>
              onLoadOlderMonths({
                onError: (e) => setError(e),
              })
            }
            onStartReachedThreshold={0.5}
            onLayout={() => {
              setTimeout(() => {
                readyRef.current = true;
              }, 500);
            }}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            contentContainerStyle={{
              paddingHorizontal: 7,
              paddingBottom: tabBarHeight + 16,
            }}
            ItemSeparatorComponent={() => <View className="h-20" />}
            renderItem={({ item }) => (
              <MonthView
                month={item.key}
                data={item.data}
                active={activeMonths.has(item.key)}
              />
            )}
          />
        </View>
      )}
    </View>
  );
}
