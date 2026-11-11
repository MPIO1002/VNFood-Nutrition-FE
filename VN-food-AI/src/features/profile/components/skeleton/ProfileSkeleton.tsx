import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export function ProfileSkeleton() {
  return (
    <View className="gap-4">
      <View className="rounded-[24px] border border-border-subtle bg-canvas-white p-4">
        <View className="flex-row items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-48" />
          </View>
        </View>
      </View>
      <View className="flex-row gap-3">
        <Skeleton className="h-24 flex-1 rounded-xl" />
        <Skeleton className="h-24 flex-1 rounded-xl" />
      </View>
      <View className="rounded-[24px] border border-border-subtle bg-canvas-white p-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-16 w-full rounded-xl" />
        <Skeleton className="mt-3 h-16 w-full rounded-xl" />
      </View>
      <View className="rounded-[24px] border border-border-subtle bg-canvas-white p-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-12 w-full rounded-xl" />
      </View>
    </View>
  );
}