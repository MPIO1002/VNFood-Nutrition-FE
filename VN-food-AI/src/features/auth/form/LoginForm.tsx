import { HTTPValidationError } from "@/api/generated/model";
import { ErrorType } from "@/api/mutator/axios-instance";
import ErrorBadge from "@/components/form/ErrorBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight,
  CheckSquare,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Square,
} from "lucide-react-native";
import { useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLoginForm } from "./hooks/useLoginForm";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  // REMINDER: DOES NOTHING
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<ErrorType<HTTPValidationError> | null>(
    null,
  );

  const { form, isSubmitting, onSubmit } = useLoginForm();
  const formErrors = form.formState.errors;

  return (
    <View>
      <FormProvider {...form}>
        <View className="bg-white rounded-[24px] p-5 shadow-sm border border-zinc-100 mb-6">
          <View className="mb-4">
            <Text className="font-montserrat-bold text-[10px] text-zinc-700 tracking-wider mb-2 uppercase">
              Email
            </Text>
            <View className="flex-row items-center bg-[#F6F5F6] rounded-xl px-4 h-12">
              <Mail size={18} color="#A1A1AA" />
              <Controller
                name="email"
                render={({ field }) => (
                  <TextInput
                    className="flex-1 ml-3 font-montserrat text-[14px] text-charcoal-pure"
                    placeholder="caloviet@example.com"
                    placeholderTextColor="#A1A1AA"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                )}
              />
            </View>
            {formErrors.email && (
              <ErrorBadge msg={formErrors.email?.message}></ErrorBadge>
            )}
          </View>

          <View className="mb-4">
            <Text className="font-montserrat-bold text-[10px] text-zinc-700 tracking-wider mb-2 uppercase">
              Mật khẩu
            </Text>
            <View className="flex-row items-center bg-[#F6F5F6] rounded-xl px-4 h-12">
              <Lock size={18} color="#A1A1AA" />
              <Controller
                name="password"
                render={({ field }) => (
                  <TextInput
                    className="flex-1 ml-3 font-montserrat text-[14px] text-charcoal-pure"
                    placeholder="••••••••"
                    placeholderTextColor="#A1A1AA"
                    secureTextEntry={!showPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye size={18} color="#71717A" />
                ) : (
                  <EyeOff size={18} color="#71717A" />
                )}
              </TouchableOpacity>
            </View>
            {formErrors.password && (
              <ErrorBadge msg={formErrors.password?.message}></ErrorBadge>
            )}
          </View>

          <View className="flex-row items-center justify-between mb-6 mt-1">
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => setRememberMe(!rememberMe)}>
              {rememberMe ? (
                <CheckSquare size={16} color="#27272A" />
              ) : (
                <Square size={16} color="#A1A1AA" />
              )}
              <Text className="font-montserrat text-[13px] text-zinc-500">
                Ghi nhớ đăng nhập
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="font-montserrat-semibold text-[13px] text-charcoal-pure">
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2"
            disabled={isSubmitting}
            activeOpacity={0.8}
            onPress={form.handleSubmit((data) => {
              onSubmit(data, {
                onError: (e) => setError(e),
              });
            })}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Text className="font-montserrat-bold text-[15px] text-white">
                  Đăng nhập ngay
                </Text>
                <ArrowRight size={18} color="#FFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </FormProvider>
      <AlertDialog open={!!error}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-montserrat-bold">
              Đăng nhập không thành công
            </AlertDialogTitle>
            <AlertDialogDescription className="font-montserrat">
              {`${error?.response?.data?.detail}` ||
                "Đã có lỗi xảy ra. Vui lòng thử lại"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onPress={() => setError(null)}>
              <Text className="font-montserrat">Xác nhận</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
