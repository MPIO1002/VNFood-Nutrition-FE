import { searchIngredientsApiV1IngredientsSearchGet } from "@/api/generated";
import { SearchIngredientsApiV1IngredientsSearchGetParams } from "@/api/generated/model";
import { QUERY_OPTIONS } from "@/constants/queries";
import { useInfiniteQuery } from "@tanstack/react-query";

export const ingredientQueryKeys = {
  all: ["ingredient"] as const,
  infinite: (params: SearchIngredientsApiV1IngredientsSearchGetParams) => [
    ...ingredientQueryKeys.all,
    "infinite",
    params,
  ],
};

export const useIngredientsInfiniteQuery = (
  params: SearchIngredientsApiV1IngredientsSearchGetParams,
  enabled?: boolean,
) => {
  const DEFAULT_OFFSET = 0;
  const DEFAULT_LIMIT = 20;

  return useInfiniteQuery({
    queryKey: ingredientQueryKeys.infinite(params),
    initialPageParam: params,
    queryFn: ({ pageParam, signal }) =>
      searchIngredientsApiV1IngredientsSearchGet(pageParam, undefined, signal),
    getNextPageParam: (lastPage, _allPage, lastPageParams) => {
      let nextOffset =
        (lastPageParams.offset ?? DEFAULT_OFFSET) +
        (lastPageParams.limit ?? DEFAULT_LIMIT);
      if (nextOffset >= lastPage.total) return undefined;
      return {
        ...lastPageParams,
        offset: nextOffset,
      };
    },
    enabled: params.q.trim().length > 0 && enabled,
    staleTime: QUERY_OPTIONS.DEFAULT_STALE_TIME,
  });
};
