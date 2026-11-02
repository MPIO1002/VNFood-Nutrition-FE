import { z } from "zod";
import { CONTAINER_KEYS } from "@/constants/containers";

/** 1. Input do UI tạo ra trước khi upload */
export const ContainerTypeSchema = z.enum(CONTAINER_KEYS);
export const ResponseFormatSchema = z.enum(["full", "nutrition"]);

export const AnalyzeRequestSchema = z.object({
  imageUri: z.string().trim().nonempty("Vui lòng chọn hoặc chụp ảnh món ăn"),
  containerType: ContainerTypeSchema.optional(),
  responseFormat: ResponseFormatSchema.default("full"),
});
export type AnalyzeRequestInput = z.infer<typeof AnalyzeRequestSchema>;

/** 2. Response thô từ backend (khớp API_DOCUMENTATION_FE.md §3.2.1) */
const MacroSchema = z.object({
  calories_kcal: z.coerce.number().nullish(),
  protein_g: z.coerce.number().nullish(),
  fat_g: z.coerce.number().nullish(),
  carb_g: z.coerce.number().nullish(),
});

export const AnalyzeResponseSchema = z.object({
  image: z.object({ width: z.number(), height: z.number() }).nullish(),
  image_quality: z
    .object({ is_blurry: z.boolean().nullish(), issues: z.array(z.string()).nullish() })
    .nullish(),
  items: z
    .array(
      z.object({
        label: z.string().nullish(),
        detection_confidence: z.coerce.number().nullish(),
        mask_polygons: z.array(z.array(z.array(z.number()))).nullish(),
        food: z
          .object({
            name: z.string().nullish(),
            estimated_totals: MacroSchema.nullish(),
            estimated_components: z
              .array(
                z.object({
                  name: z.string(),
                  estimated_g: z.coerce.number().nullish(),
                  calories_kcal: z.coerce.number().nullish(),
                  protein_g: z.coerce.number().nullish(),
                  fat_g: z.coerce.number().nullish(),
                  carb_g: z.coerce.number().nullish(),
                }),
              )
              .nullish(),
          })
          .nullish(),
      }),
    )
    .nullish(),
  visual_base64: z.string().nullish(),
  warnings: z.array(z.string()).nullish(),
});
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;

/** 3. Validate thao tác sửa khẩu phần trên UI */
export const ComponentWeightSchema = z.coerce
  .number()
  .min(0, "Khối lượng không hợp lệ")
  .max(5000, "Khối lượng quá lớn");