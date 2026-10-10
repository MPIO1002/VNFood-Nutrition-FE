import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, User, Globe, ChevronDown, CheckSquare, Square, ArrowRight, Compass, Sparkles, Coffee } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useAuthScreen } from '../hooks/useAuthScreen';

const AppleIcon = ({ size = 20, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2.04C12.05 2.04 12.09 2.04 12.14 2.04C13.25 2.07 14.39 2.65 15.11 3.48C15.75 4.21 16.22 5.25 16.09 6.26C15.01 6.33 13.92 5.76 13.18 4.93C12.48 4.15 11.96 3.09 12 2.04ZM17.15 7.1C16.14 7.03 15.04 7.72 14.5 7.72C13.9 7.72 13.06 7.14 12.14 7.16C10.97 7.17 9.87 7.84 9.27 8.9C8.03 11.05 8.94 14.24 10.15 15.98C10.74 16.82 11.43 17.78 12.35 17.74C13.23 17.71 13.58 17.18 14.65 17.18C15.7 17.18 16.01 17.74 16.94 17.71C17.89 17.68 18.49 16.82 19.07 15.98C19.74 15.01 20.02 14.07 20.03 14C19.99 13.98 18.23 13.3 18.21 11.36C18.19 9.7 19.57 8.87 19.64 8.83C18.88 7.72 17.72 7.14 17.15 7.1Z" />
  </Svg>
);

const GoogleIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </Svg>
);

export default function AuthScreen() {
  const {
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
  } = useAuthScreen();

  return (
    <SafeAreaView className="flex-1 bg-[#FDFDFE]" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-5 py-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: 32, height: 32 }}
                contentFit="contain"
              />
              <Text className="font-montserrat-bold text-lg text-charcoal-pure">CaloViet AI</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1.5 bg-zinc-100 px-3 py-1.5 rounded-full">
                <Globe size={14} color="#52525B" />
                <Text className="font-montserrat-medium text-xs text-zinc-700">VIE</Text>
                <ChevronDown size={14} color="#52525B" />
              </View>
              <View className="w-9 h-9 rounded-full bg-charcoal-pure items-center justify-center">
                <User size={18} color="#FFF" />
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View className="px-5 pt-6 pb-10">
            {/* Logo & Title */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 mb-4 relative shadow-lg">
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
                <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-zinc-100">
                  <Sparkles size={14} color="#27272A" />
                </View>
              </View>
              <Text className="font-montserrat-bold text-[28px] text-charcoal-pure mb-2">CaloViet AI</Text>
              <Text className="font-montserrat text-[13px] text-zinc-500 text-center px-4 leading-5">
                Theo dõi calo & dinh dưỡng thông minh chuẩn món Việt
              </Text>
            </View>

            {/* Tabs */}
            <View className="flex-row bg-[#F2F1F3] p-1.5 rounded-2xl mb-6">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl items-center justify-center ${isLogin ? 'bg-charcoal-pure shadow-sm' : 'shadow-none'}`}
                onPress={() => setIsLogin(true)}
              >
                <Text className={`font-montserrat-medium text-sm ${isLogin ? 'text-white' : 'text-zinc-500'}`}>
                  Đăng nhập
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl items-center justify-center ${!isLogin ? 'bg-charcoal-pure shadow-sm' : 'shadow-none'}`}
                onPress={() => setIsLogin(false)}
              >
                <Text className={`font-montserrat-medium text-sm ${!isLogin ? 'text-white' : 'text-zinc-500'}`}>
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Container */}
            <View className="bg-white rounded-[24px] p-5 shadow-sm border border-zinc-100 mb-6">
              {!isLogin && (
                <View className="mb-4">
                  <Text className="font-montserrat-bold text-[10px] text-zinc-700 tracking-wider mb-2 uppercase">Họ và tên</Text>
                  <View className="flex-row items-center bg-[#F6F5F6] rounded-xl px-4 h-12">
                    <User size={18} color="#A1A1AA" />
                    <TextInput
                      className="flex-1 ml-3 font-montserrat text-[14px] text-charcoal-pure"
                      placeholder="Calo Việt"
                      placeholderTextColor="#A1A1AA"
                    />
                  </View>
                </View>
              )}

              <View className="mb-4">
                <Text className="font-montserrat-bold text-[10px] text-zinc-700 tracking-wider mb-2 uppercase">
                  {isLogin ? 'Email / Số điện thoại' : 'Email hoặc Số điện thoại'}
                </Text>
                <View className="flex-row items-center bg-[#F6F5F6] rounded-xl px-4 h-12">
                  <Mail size={18} color="#A1A1AA" />
                  <TextInput
                    className="flex-1 ml-3 font-montserrat text-[14px] text-charcoal-pure"
                    placeholder="caloviet@example.com"
                    placeholderTextColor="#A1A1AA"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="font-montserrat-bold text-[10px] text-zinc-700 tracking-wider mb-2 uppercase">Mật khẩu</Text>
                <View className="flex-row items-center bg-[#F6F5F6] rounded-xl px-4 h-12">
                  <Lock size={18} color="#A1A1AA" />
                  <TextInput
                    className="flex-1 ml-3 font-montserrat text-[14px] text-charcoal-pure"
                    placeholder={isLogin ? '••••••••' : 'Tối thiểu 8 ký tự'}
                    placeholderTextColor="#A1A1AA"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={18} color="#71717A" /> : <EyeOff size={18} color="#71717A" />}
                  </TouchableOpacity>
                </View>
              </View>

              {!isLogin && (
                <>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-montserrat text-[11px] text-zinc-500">Độ mạnh mật khẩu:</Text>
                    {password.length > 0 && (
                      <Text className={`font-montserrat-medium text-[11px] ${strength.textColor}`}>{strength.label}</Text>
                    )}
                  </View>
                  <View className="flex-row gap-1.5 mb-5">
                    <View className={`flex-1 h-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-zinc-200'}`} />
                    <View className={`flex-1 h-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-zinc-200'}`} />
                    <View className={`flex-1 h-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-zinc-200'}`} />
                  </View>

                  <View className="mb-5">
                    <Text className="font-montserrat-bold text-[10px] text-zinc-700 tracking-wider mb-2 uppercase">Xác nhận mật khẩu</Text>
                    <View className="flex-row items-center bg-[#F6F5F6] rounded-xl px-4 h-12">
                      <Lock size={18} color="#A1A1AA" />
                      <TextInput
                        className="flex-1 ml-3 font-montserrat text-[14px] text-charcoal-pure"
                        placeholder="Nhập lại mật khẩu"
                        placeholderTextColor="#A1A1AA"
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    className="flex-row items-start gap-2.5 mb-6"
                    onPress={() => setAgreeTerms(!agreeTerms)}
                  >
                    <View className="mt-0.5">
                      {agreeTerms ? <CheckSquare size={16} color="#27272A" /> : <Square size={16} color="#A1A1AA" />}
                    </View>
                    <Text className="flex-1 font-montserrat text-[12px] text-zinc-500 leading-4">
                      Tôi đồng ý với <Text className="font-montserrat-semibold text-charcoal-pure">Điều khoản dịch vụ</Text> & <Text className="font-montserrat-semibold text-charcoal-pure">Chính sách bảo mật</Text> của CaloViet AI
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {isLogin && (
                <View className="flex-row items-center justify-between mb-6 mt-1">
                  <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe ? <CheckSquare size={16} color="#27272A" /> : <Square size={16} color="#A1A1AA" />}
                    <Text className="font-montserrat text-[13px] text-zinc-500">Ghi nhớ đăng nhập</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text className="font-montserrat-semibold text-[13px] text-charcoal-pure">Quên mật khẩu?</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                className="bg-charcoal-pure rounded-xl h-14 flex-row items-center justify-center gap-2"
                onPress={handleAuth}
              >
                <Text className="font-montserrat-bold text-[15px] text-white">
                  {isLogin ? 'Đăng nhập ngay' : 'Tạo tài khoản mới'}
                </Text>
                <ArrowRight size={18} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-6 px-4">
              <View className="flex-1 h-[1px] bg-zinc-200" />
              <Text className="font-montserrat-medium text-[11px] text-zinc-500 mx-3 uppercase tracking-wider">
                {isLogin ? 'Hoặc tiếp tục với' : 'Hoặc đăng ký nhanh với'}
              </Text>
              <View className="flex-1 h-[1px] bg-zinc-200" />
            </View>

            {/* Social Buttons */}
            <View className="flex-row gap-4 mb-8">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2.5 h-12 bg-white rounded-xl border border-zinc-100 shadow-sm">
                <AppleIcon size={20} />
                <Text className="font-montserrat-semibold text-[14px] text-charcoal-pure">Apple ID</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2.5 h-12 bg-white rounded-xl border border-zinc-100 shadow-sm">
                <GoogleIcon size={20} />
                <Text className="font-montserrat-semibold text-[14px] text-charcoal-pure">Google</Text>
              </TouchableOpacity>
            </View>

            {isLogin ? (
              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 mb-8"
                onPress={handleAuth}
              >
                <Compass size={16} color="#71717A" />
                <Text className="font-montserrat-medium text-[13px] text-zinc-500">
                  Tiếp tục với tư cách Khách (Duyệt nhanh)
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="flex-row items-center justify-center mb-8"
                onPress={() => setIsLogin(true)}
              >
                <Text className="font-montserrat text-[13px] text-zinc-500">
                  Đã có tài khoản? <Text className="font-montserrat-bold text-charcoal-pure">Đăng nhập ngay</Text>
                </Text>
              </TouchableOpacity>
            )}

            <Text className="font-montserrat text-[11px] text-zinc-400 text-center leading-4 px-4">
              Bằng việc tiếp tục, bạn đồng ý với <Text className="font-montserrat-medium text-zinc-600">Điều khoản</Text> & <Text className="font-montserrat-medium text-zinc-600">Chính sách bảo mật</Text> của CaloViet AI.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
