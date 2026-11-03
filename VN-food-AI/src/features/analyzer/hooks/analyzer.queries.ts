import { useAnalyzeFoodApiV1FoodAnalyzePost } from "@/api/generated";
import { useCallback } from "react";

export const analyzerQueryKeys = {
  all: ["analyzer"] as const,
  result: (imageKey: string) => ["analyzer", "result", imageKey] as const,
};

export const useAnalyzeFoodMutation = useCallback(() => {
  const mutation = useAnalyzeFoodApiV1FoodAnalyzePost({
    request: {
      timeout: 300000,
    },
  });
  return { ...mutation };
}, []);
