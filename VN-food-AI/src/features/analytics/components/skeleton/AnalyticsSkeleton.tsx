import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export function AnalyticsSkeleton() {
  return (
    <View className="gap-3">
      <View className="rounded-[24px] border border-border-hairline bg-canvas-white p-5">
        <View className="flex-row items-center justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </View>
        <Skeleton className="mt-7 h-4 w-44" />
        <Skeleton className="mt-2 h-10 w-32" />
        <Skeleton className="mt-4 h-6 w-full rounded-full" />
        <View className="mt-6 flex-row gap-4">
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 flex-1" />
        </View>
      </View>
      <View className="rounded-[24px] border border-border-hairline bg-canvas-white p-5">
        <Skeleton className="h-4 w-40" />
        <View className="mt-5 flex-row justify-between gap-3">
          <Skeleton className="h-20 flex-1" />
          <Skeleton className="h-20 flex-1" />
          <Skeleton className="h-20 flex-1" />
        </View>
      </View>
      <View className="rounded-[24px] border border-border-hairline bg-canvas-white p-5">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-5 h-2 w-full rounded-full" />
        <Skeleton className="mt-5 h-10 w-full" />
        <Skeleton className="mt-3 h-10 w-full" />
        <Skeleton className="mt-3 h-10 w-full" />
      </View>
      <View className="rounded-[24px] border border-border-hairline bg-canvas-white p-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-24 w-full rounded-2xl" />
      </View>
    </View>
  );
}