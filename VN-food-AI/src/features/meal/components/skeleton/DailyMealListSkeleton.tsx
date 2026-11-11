import { Skeleton } from "@/components/ui/skeleton";
import { Text, View } from "react-native";

function MealCardSkeleton() {
  return (
    <View className="flex-row items-center gap-3 rounded-3xl border border-border-hairline bg-canvas-white p-4">
      <Skeleton className="h-16 w-16 rounded-2xl" />
      <View className="min-w-0 flex-1 gap-2">
        <View className="flex-row items-center justify-between gap-2">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
        </View>
        <Skeleton className="h-3 w-28" />
        <View className="flex-row gap-1.5">
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-5 w-12 rounded" />
        </View>
      </View>
    </View>
  );
}

export function DailyMealListSkeleton() {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-0.5">
        <View className="flex-row items-center gap-2">
          <Text className="font-montserrat-bold text-base text-charcoal-pure">
            Bữa ăn hôm nay
          </Text>
          <Skeleton className="h-5 w-14 rounded-full" />
        </View>
      </View>
      <MealCardSkeleton />
      <MealCardSkeleton />
    </View>
  );
}