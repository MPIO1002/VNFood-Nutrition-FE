import { z } from "zod";

export const ProfileFormSchema = z.object({
  weight: z.coerce
    .number()
    .positive("Cân nặng phải lớn hơn 0")
    .max(700, "Cân nặng không hợp lệ"),
  height: z.coerce
    .number()
    .positive("Chiều cao phải lớn hơn 0")
    .max(300, "Chiều cao không hợp lệ"),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

export const ProfileResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  gender: z.string().nullable(),
  sex_for_equation: z.string().nullable(),
  age: z.number().nullable(),
  height: z.number().nullable(),
  weight: z.number().nullable(),
  activity_level: z.string().nullable(),
  goal: z.string().nullable(),
  bmi: z.number().nullable(),
  tdee: z.number().nullable(),
  target_calories: z.number().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});
