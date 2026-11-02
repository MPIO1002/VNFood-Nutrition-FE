import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  AnalyzeRequestInput,
  AnalyzeRequestSchema,
  AnalyzeResponseSchema,
} from "@/features/analyzer/validation/analyzeSchema";
import { mapAnalyzeResponse } from "@/features/analyzer/mapping/analyzeMapper";
import { analyzerQueryKeys, useAnalyzeFoodMutation } from "./analyzer.queries";

export type AnalyzeErrorType =
  | "validation"
  | "response"
  | "network"
  | "unknown";

export class AnalyzerValidationError extends Error {
  constructor(message: string, public issues?: z.ZodIssue[]) {
    super(message);
    this.name = "AnalyzerValidationError";
  }
}

export class AnalyzerResponseError extends Error {
  constructor(message: string, public issues?: z.ZodIssue[]) {
    super(message);
    this.name = "AnalyzerResponseError";
  }
}

function keyOf(input: AnalyzeRequestInput): string {
  return `${input.imageUri}#${input.containerType || "none"}`;
}

export const useAnalyzer = () => {
  const queryClient = useQueryClient();
  const mutation = useAnalyzeFoodMutation();

  const analyze = async ({
    imageUri,
    containerType,
    responseFormat,
  }: AnalyzeRequestInput) => {
    // 1) Validate input
    const parsed = AnalyzeRequestSchema.safeParse({
      imageUri,
      containerType,
      responseFormat,
    });
    if (!parsed.success) {
      throw new AnalyzerValidationError(
        parsed.error.issues[0]?.message || "Dữ liệu đầu vào không hợp lệ",
        parsed.error.issues,
      );
    }

    // 2) Chuẩn bị file
    const local = await fetch(parsed.data.imageUri);
    if (!local.ok) {
      throw new Error(`Không thể đọc ảnh (${local.status})`);
    }
    const blob = await local.blob();
    const file = {
      uri: parsed.data.imageUri,
      name: parsed.data.imageUri.split("/").pop() || "food-image.jpg",
      type: blob.type || "image/jpeg",
    };

    // 3) Gọi generated mutation (kèm signal abort có thể thêm ở bước sau)
    const raw = await mutation.mutateAsync({
      data: {
        image: file,
        container_type: parsed.data.containerType,
        response_format: parsed.data.responseFormat,
      },
    });

    // 4) Validate + map response
    const validated = AnalyzeResponseSchema.safeParse(raw);
    if (!validated.success) {
      throw new AnalyzerResponseError(
        validated.error.issues[0]?.message || "Phản hồi API không hợp lệ",
        validated.error.issues,
      );
    }

    const result = mapAnalyzeResponse(validated.data);
    queryClient.setQueryData(analyzerQueryKeys.result(keyOf(parsed.data)), result);
    return result;
  };

  return {
    analyze,
    isAnalyzing: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};