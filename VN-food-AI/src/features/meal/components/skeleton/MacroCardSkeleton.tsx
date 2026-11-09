import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export function MacroCardSkeleton() {
  return (
    <View className="flex-1 rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
      <View className="mb-2 flex-row items-center justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-7" />
      </View>
      <Skeleton className="mb-2 h-[5px] w-full rounded-full" />
      <Skeleton className="h-4 w-16" />
    </View>
  );
}