import { Skeleton } from "@/components/ui/skeleton";
import VerticalWavyDashedLine from "@/components/VerticalWavyDashedLine";
import { MonthView } from "@/features/diary/components/MonthView";
import { useDiary } from "@/features/diary/hooks/useDiary";
import { dateUtils } from "@/lib/utils";
import { LegendList } from "@legendapp/list/react-native";
import { Image } from "expo-image";
import { useBottomTabBarHeight } from "expo-router/build/layouts/TabsClient.js";
import {
  FlameIcon,
  ForkKnifeCrossedIcon,
  HeartIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

export default function DiaryScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [error, setError] = useState<Error | null>(null);
  const [isListReady, setIsListReady] = useState(false);

  const {
    LIMIT,
    monthlyData,
    isFetching,
    hasNextPage,
    userRegisterDate,
    isDataReady,
    locketCaloCount,
    streakDays,
    onLoadOlderMonths,
  } = useDiary();

  const isEnd = isListReady && !hasNextPage && !isFetching && isDataReady;

  return (
    <View className="bg-surface w-full h-full">
      {error ? (
        <View className="justify-center items-center">
          <Text className="font-montserrat">
            Không thể tải nhật kí. Vui lòng thử lại sau
          </Text>
        </View>
      ) : (
        <View className="flex-1 py-10 gap-10">
          <LegendList
            data={monthlyData}
            drawDistance={1500}
            keyExtractor={(m) => m.key}
            initialScrollIndex={LIMIT - 1}
            maintainVisibleContentPosition
            onStartReached={() =>
              onLoadOlderMonths({
                onError: (e) => setError(e),
              })
            }
            onStartReachedThreshold={0.1}
            onLayout={() => {
              setIsListReady(true);
            }}
            contentContainerStyle={{
              paddingHorizontal: 7,
              paddingBottom: tabBarHeight + 16,
            }}
            ListHeaderComponent={() => (
              <View>
                <View
                  className="w-full gap-2 relative justify-center items-center p-5"
                  style={{
                    display: isEnd ? "flex" : "none",
                  }}>
                  <Image
                    source={require("@/assets/images/logo.png")}
                    style={{ width: 50, height: 50 }}
                    contentFit="contain"
                  />
                  {userRegisterDate && (
                    <Text className="font-montserrat-semibold text-center text-gray-400">
                      {`Bạn đã bắt đầu hành trình với chúng tôi từ ${dateUtils.getMonthLabel(userRegisterDate?.getMonth() + 1)} năm ${userRegisterDate?.getFullYear()}`}
                    </Text>
                  )}
                </View>
                <View
                  className="w-full h-10 relative justify-center items-center mb-3"
                  style={{ display: !isDataReady ? "flex" : "none" }}>
                  <Skeleton className="absolute w-full h-full rounded-xl bg-gray-300 z-5" />
                  <ForkKnifeCrossedIcon
                    className="z-20"
                    size={20}
                    color={"black"}
                  />
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View className="h-20 py-3">
                <VerticalWavyDashedLine
                  amplitude={5}
                  className="h-full"
                  color={"#9ca3af"}
                />
              </View>
            )}
            ListFooterComponent={() => (
              <View className="w-full justify-center items-center px-2">
                <View className="h-20 py-3">
                  <VerticalWavyDashedLine
                    amplitude={5}
                    className="h-full"
                    color={"#9ca3af"}
                  />
                </View>
                <View className="flex-row rounded-full bg-white shadow-sm shadow-slate-500/50 w-full justify-center items-center h-16 relative">
                  <View className="flex-row w-1/2 justify-center gap-2">
                    <HeartIcon size={19} fill={"#FFC928"} color={"#FFC928"} />
                    <View className="flex-row justify-center items-center gap-1">
                      <Text className="font-montserrat-bold">
                        {locketCaloCount}
                      </Text>
                      <Text className="font-montserrat-semibold">
                        Locket Calo
                      </Text>
                    </View>
                  </View>
                  <View className="absolute rounded-full h-1/2 w-[2px] bg-gray-300" />
                  <View className="flex-row w-1/2 justify-center gap-2">
                    <FlameIcon size={19} color={"orange"} fill={"orange"} />
                    <View className="flex-row justify-center items-center gap-1">
                      <Text className="font-montserrat-semibold">Chuỗi</Text>
                      <Text className="font-montserrat-bold">
                        {`${streakDays} ngày`}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            renderItem={({ item }) => (
              <MonthView month={item.key} data={item.data} />
            )}
          />
        </View>
      )}
    </View>
  );
}
