import {
  getAnalyzeFoodApiV1FoodAnalyzePostMutationKey,
  useAnalyzeFoodApiV1FoodAnalyzePost,
} from "@/api/generated";

export const analyzerQueryKeys = {
  all: ["analyzer"] as const,
  result: (imageKey: string) => ["analyzer", "result", imageKey] as const,
  mutation: getAnalyzeFoodApiV1FoodAnalyzePostMutationKey,
};

export const useAnalyzeFoodMutation = () => useAnalyzeFoodApiV1FoodAnalyzePost();