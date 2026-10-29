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
import { Checkbox } from "@/components/ui/checkbox";
import { router } from "expo-router";
import debounce from "lodash.debounce";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PasswordStrengthUI, useRegisterForm } from "./hooks/useRegisterForm";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<ErrorType<HTTPValidationError> | null>(
    null,
  );
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAgreeTerms, setIsAgreeTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthUI>({
    score: 0,
    label: "",
    colorClass: "bg-zinc-200",
    textColorClass: "text-zinc-500",
  });

  const { form, getPasswordStrength, isSubmitting, onSubmit } =
    useRegisterForm();
  const formErrors = form.formState.errors;

  const testPasswordStrength = useMemo(
    () =>
      debounce((password: string) => {
        setPasswordStrength(getPasswordStrength(password));
      }, 300),
    [],
  );
  useEffect(() => {
    return () => testPasswordStrength.cancel();
  }, [testPasswordStrength]);

  return (
    <View>
      <FormProvider {...form}>
        <View className="bg-white rounded-[24px] p-5 shadow-sm border border-zinc-100 mb-6">
          <View className="mb-4">
            <Text className="font-montserrat-bold text-[10px] text-zinc-700 tracking-wider mb-2 uppercase">
              Họ và tên
            </Text>
            <View className="flex-row items-center bg-[#F6F5F6] rounded-xl px-4 h-12">
              <User size={18} color="#A1A1AA" />
              <Controller
                name="full_name"
                render={({ field }) => (
                  <TextInput
                    className="flex-1 ml-3 font-montserrat text-[14px] text-charcoal-pure"
                    placeholder="Calo Việt"
                    maxLength={320}
                    placeholderTextColor="#A1A1AA"
                    value={field.value}
                    onChangeText={field.onChange}
                    autoCapitalize="none"
                  />
                )}
              />
            </View>
            {formErrors.full_name && (
              <ErrorBadge msg={formErrors.full_name.message}></ErrorBadge>
            )}
          </View>
          <View className="mb-4">
            <Text className="font-montserrat-bold text-[10px] text-zinc-700 tracking-wider mb-2 uppercase">
              Địa chỉ Email
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
                    maxLength={320}
                    autoCapitalize="none"
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                )}
              />
            </View>
            {formErrors.email && (
              <ErrorBadge msg={formErrors.email.message}></ErrorBadge>
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
                    placeholder="Tối thiểu 8 ký tự"
                    placeholderTextColor="#A1A1AA"
                    maxLength={128}
                    secureTextEntry={!showPassword}
                    value={field.value}
                    onChangeText={(p) => {
                      field.onChange(p);
                      testPasswordStrength(p);
                    }}
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
              <ErrorBadge msg={formErrors.password.message}></ErrorBadge>
            )}
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-montserrat text-[11px] text-zinc-500">
              Độ mạnh mật khẩu:
            </Text>
            {form.getValues("password").length > 0 && (
              <Text
                className={`font-montserrat-medium text-[11px] ${passwordStrength.textColorClass}`}>
                {passwordStrength.label}
              </Text>
            )}
          </View>
          <View className="flex-row gap-1.5 mb-5">
            <View
              className={`flex-1 h-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.colorClass : "bg-zinc-200"}`}
            />
            <View
              className={`flex-1 h-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.colorClass : "bg-zinc-200"}`}
            />
            <View
              className={`flex-1 h-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.colorClass : "bg-zinc-200"}`}
            />
          </View>

          <View className="mb-5">
            <Text className="font-montserrat-bold text-[10px] text-zinc-700 tracking-wider mb-2 uppercase">
              Xác nhận mật khẩu
            </Text>
            <View className="flex-row items-center bg-[#F6F5F6] rounded-xl px-4 h-12">
              <Lock size={18} color="#A1A1AA" />
              <Controller
                name="confirmPassword"
                render={({ field }) => (
                  <TextInput
                    className="flex-1 ml-3 font-montserrat text-[14px] text-charcoal-pure"
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor="#A1A1AA"
                    maxLength={128}
                    secureTextEntry={!showConfirmPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <Eye size={18} color="#71717A" />
                ) : (
                  <EyeOff size={18} color="#71717A" />
                )}
              </TouchableOpacity>
            </View>
            {formErrors.confirmPassword && (
              <ErrorBadge msg={formErrors.confirmPassword.message}></ErrorBadge>
            )}
          </View>

          <TouchableOpacity
            className="flex-row items-start gap-2.5 mb-6"
            onPress={() => setIsAgreeTerms(!isAgreeTerms)}>
            <View className="mt-0.5">
              {/* {isAgreeTerms ? (
              <CheckSquare size={16} color="#27272A" />
            ) : (
              <Square size={16} color="#A1A1AA" />
            )} */}
              <Controller
                name="agreeTerms"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}></Checkbox>
                )}
              />
            </View>
            <Text className="flex-1 font-montserrat text-[12px] text-zinc-500 leading-4">
              Tôi đồng ý với{" "}
              <Text className="font-montserrat-semibold text-charcoal-pure">
                Điều khoản dịch vụ
              </Text>{" "}
              &{" "}
              <Text className="font-montserrat-semibold text-charcoal-pure">
                Chính sách bảo mật
              </Text>{" "}
              của CaloViet AI
            </Text>
          </TouchableOpacity>

          {formErrors.agreeTerms && (
            <View className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <Text className="font-montserrat-medium text-xs text-rose-600 leading-4">
                {formErrors.agreeTerms.message}
              </Text>
            </View>
          )}

          <TouchableOpacity
            className="bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2"
            disabled={isSubmitting}
            activeOpacity={0.8}
            // onPress={form.handleSubmit((data) => {
            //   onSubmit(data, {
            //     onError: (e) => setError(e),
            //   });
            // })}
            onPress={() => router.push("/register/gender")}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Text className="font-montserrat-bold text-[15px] text-white">
                  Tạo tài khoản mới
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
              Đăng ký không thành công
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
