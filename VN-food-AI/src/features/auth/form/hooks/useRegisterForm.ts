import { HTTPValidationError, RegisterRequest } from "@/api/generated/model";
import { ErrorType } from "@/api/mutator/axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { useAuthContext } from "../../context/AuthContext";
import {
  defaultRegisterValues,
  RegisterForm,
  RegisterSchema,
} from "../../validation/authSchema";

const HAS_UPPER = /[A-Z]/;
const HAS_DIGIT = /[0-9]/;
const HAS_SYMBOL = /[^A-Za-z0-9]/;

export interface PasswordStrengthUI {
  score: number;
  label: string;
  colorClass: string;
  textColorClass: string;
}

export const useRegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuthContext();

  const getPasswordStrength = useCallback(
    (password: string): PasswordStrengthUI => {
      if (!password)
        return {
          score: 0,
          label: "",
          colorClass: "bg-zinc-200",
          textColorClass: "text-zinc-500",
        };
      let score = 0;
      if (password.length >= 6) score += 1;
      if (password.length >= 8) score += 1;
      if (HAS_UPPER.test(password)) score += 1;
      if (HAS_DIGIT.test(password)) score += 1;
      if (HAS_SYMBOL.test(password)) score += 1;

      if (score < 2)
        return {
          score: 1,
          label: "Yếu",
          colorClass: "bg-rose-500",
          textColorClass: "text-rose-600",
        };
      if (score < 4)
        return {
          score: 2,
          label: "Trung bình",
          colorClass: "bg-amber-500",
          textColorClass: "text-amber-600",
        };
      return {
        score: 3,
        label: "Mạnh",
        colorClass: "bg-emerald-500",
        textColorClass: "text-emerald-600",
      };
    },
    [],
  );

  const form = useForm<RegisterForm, unknown, RegisterRequest>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: defaultRegisterValues,
  });

  const showErrorMsg = (e: ErrorType<HTTPValidationError>) => {
    const msg =
      `${e?.response?.data.detail}` || "Đã có lỗi xảy ra. Vui lòng thử lại.";
    Alert.alert("Đăng ký không thành công", msg);
  };

  const onSubmit = useCallback(
    (data: RegisterRequest) => {
      setIsSubmitting(true);
      register({
        data,
        options: {
          onSuccess: (_) => {
            router.push("/register/weight");
          },
          onError: (e) => showErrorMsg(e),
          onSettled: () => {
            setIsSubmitting(false);
          },
        },
      });
    },
    [form, register],
  );

  return { form, getPasswordStrength, onSubmit, isSubmitting };
};
