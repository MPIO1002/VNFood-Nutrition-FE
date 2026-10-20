import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export function useAuthScreen() {
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-zinc-200', textColor: 'text-zinc-500' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score < 2) return { score: 1, label: 'Yếu', color: 'bg-rose-500', textColor: 'text-rose-600' };
    if (score < 4) return { score: 2, label: 'Trung bình', color: 'bg-amber-500', textColor: 'text-amber-600' };
    return { score: 3, label: 'Mạnh', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  }, [password]);

  const validate = (): boolean => {
    setErrorMessage(null);
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ email.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Địa chỉ email không đúng định dạng.');
      return false;
    }

    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu.');
      return false;
    }

    if (!isLogin) {
      if (password.length < 8) {
        setErrorMessage('Mật khẩu phải chứa ít nhất 8 ký tự.');
        return false;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Mật khẩu xác nhận không khớp.');
        return false;
      }

      if (!agreeTerms) {
        setErrorMessage('Vui lòng đồng ý với Điều khoản dịch vụ & Chính sách bảo mật.');
        return false;
      }
    }

    return true;
  };

  const handleAuth = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isLogin) {
        await login({ email: email.trim(), password });
        router.replace('/(tabs)');
      } else {
        await register({
          email: email.trim(),
          password,
          full_name: fullName.trim() || undefined,
        });
        // Sau khi đăng ký thành công, chuyển tiếp sang bước thiết lập thể trạng
        router.push('/register/weight');
      }
    } catch (error: any) {
      const msg = error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      setErrorMessage(msg);
      Alert.alert(isLogin ? 'Đăng nhập không thành công' : 'Đăng ký không thành công', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuest = () => {
    router.replace('/(tabs)');
  };

  return {
    isLogin,
    setIsLogin: (val: boolean) => {
      setIsLogin(val);
      setErrorMessage(null);
    },
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    agreeTerms,
    setAgreeTerms,
    rememberMe,
    setRememberMe,
    strength,
    isSubmitting,
    errorMessage,
    handleAuth,
    handleGuest,
  };
}
