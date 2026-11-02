import { RegisterRequest, TokenResponse } from "@/api/generated/model";
import { APIMutatorOptions } from "@/api/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
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

  const onSubmit = useCallback(
    (
      data: RegisterRequest,
      options?: APIMutatorOptions<TokenResponse, RegisterRequest>,
    ) => {
      setIsSubmitting(true);
      register({
        data,
        options: {
          onSuccess: (res) => {
            options?.onSuccess?.(res);
          },
          onError: options?.onError,
          onSettled: (res, e, req) => {
            setIsSubmitting(false);
            options?.onSettled?.(res, e, req);
          },
        },
      });
    },
    [form, register],
  );

  return {
    form,
    getPasswordStrength,
    onSubmit,
    isSubmitting,
  };
};
