import { IngredientItem } from "@/api/generated/model";
import { Autocomplete } from "@/components/Autocomplete";
import { useState } from "react";
import { View } from "react-native";
import { useIngredient } from "../hooks/useIngredient";

export interface IngredientPickerScreenProps {
  excludeIngredientIds?: number[];
  initialQuery?: string;
  listSearchPosition?: "top" | "bottom";
  onSelect?: (ingredient: IngredientItem) => void;
  onQueryChange?: (query: string) => void;
  onBlur?: (currentQuery: string) => void;
}

export default function IngredientPicker({
  excludeIngredientIds,
  initialQuery = "",
  listSearchPosition,
  onSelect,
  onQueryChange,
  onBlur,
}: IngredientPickerScreenProps) {
  const [query, setQuery] = useState(initialQuery);
  const [enableQuery, setEnableQuery] = useState(false);
  const {
    ingredients,
    searchQueryDebounce,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useIngredient({
    excludeIds: excludeIngredientIds,
    initialQuery,
    enabledIngredientInfiniteQuery: enableQuery,
  });

  return (
    <View>
      <View className="w-full px-2 mt-5">
        <Autocomplete
          className="w-full"
          inputClassName="border border-gray-200 rounded-2xl bg-gray-100 text-black font-montserrat"
          data={ingredients}
          query={query}
          placeholder="Nhập tên nguyên liệu"
          onQueryChange={(text) => {
            setQuery(text);
            onQueryChange?.(text);
            searchQueryDebounce(text.trim());
          }}
          isLoading={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          dropPosition={listSearchPosition}
          onFocus={() => {
            setEnableQuery(true);
          }}
          onBlur={() => {
            setEnableQuery(false);
            onBlur?.(query);
          }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          getLabel={(i) => i.name}
          onSelect={(i) => onSelect?.(i)}
          showIsEmpty={false}
        />
      </View>
    </View>
  );
}
