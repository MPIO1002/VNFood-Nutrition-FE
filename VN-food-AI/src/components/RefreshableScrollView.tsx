import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    type ScrollViewProps,
} from "react-native";

type RefreshableScrollViewProps = Omit<ScrollViewProps, "refreshControl">;

export function RefreshableScrollView(props: RefreshableScrollViewProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const refreshInProgress = useRef(false);

  const refresh = async () => {
    if (refreshInProgress.current) return;
    refreshInProgress.current = true;
    setRefreshing(true);
    try {
      await queryClient.refetchQueries({ type: "active" });
    } finally {
      refreshInProgress.current = false;
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      {...props}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void refresh()}
          tintColor="#18181B"
          colors={["#18181B"]}
        />
      }
    />
  );
}