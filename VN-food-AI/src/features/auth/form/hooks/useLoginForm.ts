import {
  LoginRequest,
  RegisterRequest,
  TokenResponse
} from "@/api/generated/model";
import { APIMutatorOptions } from "@/api/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
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

  const onSubmit = useCallback(
    (
      data: LoginRequest,
      options?: APIMutatorOptions<TokenResponse, RegisterRequest>,
    ) => {
      setIsSubmitting(true);
      logIn({
        data,
        options: {
          onSuccess: (res) => {
            options?.onSuccess?.(res);
            router.replace("/(tabs)");
          },
          onError: options?.onError,
          onSettled: (res, e, req) => {
            setIsSubmitting(false);
            options?.onSettled?.(res, e, req);
          },
        },
      });
    },
    [form],
  );

  return { form, onSubmit, isSubmitting };
};
