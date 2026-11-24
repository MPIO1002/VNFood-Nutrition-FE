import { SearchIngredientsApiV1IngredientsSearchGetParams } from "@/api/generated/model";
import debounce from "lodash.debounce";
import { useMemo, useState } from "react";
import { useIngredientsInfiniteQuery } from "./ingredient.queries";

export interface UseIngredientOptions {
  excludeIds?: number[];
  initialQuery?: string;
  enabledIngredientInfiniteQuery?: boolean;
}

export const useIngredient = ({
  excludeIds,
  initialQuery = "",
  enabledIngredientInfiniteQuery,
}: UseIngredientOptions) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const searchQueryDebounce = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
      }, 800),
    [],
  );

  const searchQueryParams = {
    q: searchQuery,
    limit: 20,
    offset: 0,
    exclude_ids: excludeIds,
  } satisfies SearchIngredientsApiV1IngredientsSearchGetParams;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
    isFetchingNextPage,
  } = useIngredientsInfiniteQuery(
    searchQueryParams,
    enabledIngredientInfiniteQuery,
  );

  const ingredients = useMemo(() => {
    if (!data) return [];
    return [...data.pages].flatMap((p) => p.results);
  }, [data]);

  return {
    ingredients,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
    isFetchingNextPage,
    searchQueryDebounce,
  };
};
