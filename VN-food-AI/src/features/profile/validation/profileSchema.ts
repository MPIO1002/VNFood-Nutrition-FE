import { z } from "zod";

const profileGoalSchema = z.enum(["lose_weight", "maintain_weight", "gain_weight"], {
  message: "Mục tiêu không hợp lệ",
});
const activityLevelSchema = z.enum(["sedentary", "light", "moderate", "active", "very_active"]);

export const ProfileFormSchema = z.object({
  weight: z.coerce
    .number()
    .finite("Cân nặng không hợp lệ")
    .min(20, "Cân nặng phải từ 20 kg")
    .max(700, "Cân nặng không hợp lệ"),
  height: z.coerce
    .number()
    .finite("Chiều cao không hợp lệ")
    .min(80, "Chiều cao phải từ 80 cm")
    .max(250, "Chiều cao không hợp lệ"),
  goal: profileGoalSchema,
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

export const ProfileResponseSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  full_name: z.string().trim().min(1).max(100).nullable(),
  avatar_url: z.string().url().nullable(),
  gender: z.string().trim().min(1).nullable(),
  sex_for_equation: z.string().trim().min(1).nullable(),
  age: z.number().int().min(0).max(150).nullable(),
  height: z.number().finite().min(0).max(300).nullable(),
  weight: z.number().finite().min(0).max(700).nullable(),
  activity_level: activityLevelSchema.nullable(),
  goal: profileGoalSchema.nullable(),
  bmi: z.number().finite().min(0).max(100).nullable(),
  tdee: z.number().finite().min(0).max(100000).nullable(),
  target_calories: z.number().finite().min(0).max(100000).nullable(),
  pregnant_or_breastfeeding: z.boolean(),
  competitive_athlete: z.boolean(),
  metabolism_affecting_condition: z.boolean(),
  is_active: z.boolean(),
  created_at: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Ngày tạo không hợp lệ"),
  updated_at: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Ngày cập nhật không hợp lệ"),
});
