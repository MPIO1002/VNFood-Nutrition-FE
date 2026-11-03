import { mapAnalyzeResponse } from "@/features/analyzer/mapping/analyzeMapper";
import {
  AnalyzeRequestInput,
  AnalyzeRequestSchema,
  AnalyzeResponseSchema,
} from "@/features/analyzer/validation/analyzeSchema";
import { MIME_BY_EXT } from "@/types/image";
import { useQueryClient } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import { z } from "zod";
import { analyzerQueryKeys, useAnalyzeFoodMutation } from "./analyzer.queries";

export type AnalyzeErrorType =
  | "validation"
  | "response"
  | "network"
  | "unknown";

export class AnalyzerValidationError extends Error {
  constructor(
    message: string,
    public issues?: z.ZodIssue[],
  ) {
    super(message);
    this.name = "AnalyzerValidationError";
  }
}

export class AnalyzerResponseError extends Error {
  constructor(
    message: string,
    public issues?: z.ZodIssue[],
  ) {
    super(message);
    this.name = "AnalyzerResponseError";
  }
}

function keyOf(input: AnalyzeRequestInput): string {
  return `${input.imageUri}#${input.containerType || "none"}`;
}

export const useAnalyzer = () => {
  const queryClient = useQueryClient();
  const analyzeMutation = useAnalyzeFoodMutation();

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
    const info = new FileSystem.File(parsed.data.imageUri).info();
    if (!info.exists) {
      throw new Error(`Không thể đọc ảnh`);
    }

    const ext = parsed.data.imageUri
      .split("?")[0]
      .split(".")
      .pop()
      ?.toLowerCase();
    const file = {
      uri: parsed.data.imageUri,
      name: parsed.data.imageUri.split("/").pop() || "food-image.jpg",
      type: (ext && MIME_BY_EXT[ext]) || "image/jpeg",
    };

    // 3) Gọi generated mutation (kèm signal abort có thể thêm ở bước sau)
    const raw = await analyzeMutation.mutateAsync({
      data: {
        image: file as unknown as Blob,
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
    queryClient.invalidateQueries({
      queryKey: analyzerQueryKeys.result(keyOf(parsed.data)),
    });
    return result;
  };

  return {
    analyze,
    isAnalyzing: analyzeMutation.isPending,
    error: analyzeMutation.error,
    reset: analyzeMutation.reset,
  };
};
