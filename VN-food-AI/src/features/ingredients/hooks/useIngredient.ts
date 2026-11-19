import { SearchIngredientsApiV1IngredientsSearchGetParams } from "@/api/generated/model";
import debounce from "lodash.debounce";
import { useMemo, useState } from "react";
import { useIngredientsInfiniteQuery } from "./ingredient.queries";

export const useIngredient = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
  } satisfies SearchIngredientsApiV1IngredientsSearchGetParams;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
    isFetchingNextPage,
  } = useIngredientsInfiniteQuery(searchQueryParams);

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
