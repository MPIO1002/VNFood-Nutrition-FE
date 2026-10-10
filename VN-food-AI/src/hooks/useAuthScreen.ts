import { useState, useMemo } from 'react';
import { router } from 'expo-router';

export function useAuthScreen() {
  const [isLogin, setIsLogin] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleAuth = () => {
    router.replace('/(tabs)');
  };

  return {
    isLogin,
    setIsLogin,
    agreeTerms,
    setAgreeTerms,
    rememberMe,
    setRememberMe,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    strength,
    handleAuth,
  };
}
