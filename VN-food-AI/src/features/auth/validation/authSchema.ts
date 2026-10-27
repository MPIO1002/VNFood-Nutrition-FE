import { z } from "zod";

export const defaultRegisterValues = {
  full_name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

export const defaultLoginValues = {
  email: "",
  password: "",
};

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Vui lòng nhập địa chỉ email")
    .pipe(z.email("Sai định dạng email")),
  password: z.string().trim().nonempty("Vui lòng nhập mật khẩu"),
});

export const RegisterSchema = z
  .object({
    full_name: z.string().trim().nonempty("Vui lòng nhập họ và tên"),
    email: z
      .string()
      .trim()
      .nonempty("Vui lòng nhập địa chỉ email")
      .pipe(z.email("Sai định dạng email")),
    password: z
      .string()
      .trim()
      .nonempty("Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự"),
    confirmPassword: z.string().trim().nonempty("Vui lòng nhập lại mật khẩu"),
    agreeTerms: z.boolean().refine((v) => v === true, {
      error: "Vui lòng đồng ý với Điều khoản dịch vụ & Chính sách bảo mật",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type LoginForm = z.infer<typeof LoginSchema>;
export type RegisterForm = z.infer<typeof RegisterSchema>;
