import { HTTPValidationError, LoginRequest } from "@/api/generated/model";
import { ErrorType } from "@/api/mutator/axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { useAuthContext } from "../../context/AuthContext";
import {
  defaultLoginValues,
  LoginForm,
  LoginSchema,
} from "../../validation/authSchema";

export const useLoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logIn } = useAuthContext();

  const form = useForm<LoginForm, unknown, LoginRequest>({
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultLoginValues,
  });

  const showErrorMsg = (e: ErrorType<HTTPValidationError>) => {
    const msg =
      `${e?.response?.data.detail}` || "Đã có lỗi xảy ra. Vui lòng thử lại.";
    Alert.alert("Đăng ký không thành công", msg);
  };

  const onSubmit = useCallback(
    (data: LoginRequest) => {
      setIsSubmitting(true);
      logIn({
        data,
        options: {
          onSuccess: (_) => {
            router.replace("/(tabs)");
          },
          onError: (e) => showErrorMsg(e),
          onSettled: () => setIsSubmitting(false),
        },
      });
    },
    [form],
  );

  return { form, onSubmit, isSubmitting };
};
