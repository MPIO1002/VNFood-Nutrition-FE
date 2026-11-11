import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";
import { MacroCardSkeleton } from "./MacroCardSkeleton";

export function CalorieRingSkeleton() {
  return (
    <View className="mb-6 rounded-[24px] border border-border-subtle bg-canvas-white p-5 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between px-1">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-4 w-14" />
      </View>
      <View className="my-2 items-center justify-center">
        <View className="h-[200px] w-[200px] items-center justify-center rounded-full border-[15px] border-zinc-100">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-2 h-9 w-28" />
          <Skeleton className="mt-2 h-7 w-32 rounded-full" />
        </View>
      </View>
      <View className="mt-4 flex-row items-center justify-between rounded-[18px] bg-surface-container p-4">
        <View className="flex-1 gap-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-5 w-20" />
        </View>
        <View className="flex-1 items-end gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-16" />
        </View>
      </View>
      <View className="mt-4 flex-row gap-2">
        <MacroCardSkeleton />
        <MacroCardSkeleton />
        <MacroCardSkeleton />
      </View>
    </View>
  );
}