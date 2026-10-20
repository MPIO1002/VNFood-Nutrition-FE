import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginPayload, RegisterPayload } from '@/types/auth';
import {
  loginApi,
  registerApi,
  logoutApi,
  getMeApi,
  getStoredTokens,
  saveAuthSession,
  clearAuthSession,
} from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Khôi phục session khi mở app
  useEffect(() => {
    async function initAuth() {
      try {
        const { accessToken, user: storedUser } = await getStoredTokens();
        if (storedUser) {
          setUser(storedUser);
        }
        if (accessToken) {
          try {
            const me = await getMeApi(accessToken);
            setUser(me);
          } catch {
            // Không đồng bộ được profile nhưng vẫn có thể dùng storedUser
          }
        }
      } catch (e) {
        console.warn('Lỗi khôi phục session:', e);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await loginApi(payload);
      await saveAuthSession(res);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await registerApi(payload);
      await saveAuthSession(res);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { refreshToken } = await getStoredTokens();
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } finally {
      await clearAuthSession();
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    const { accessToken } = await getStoredTokens();
    if (accessToken) {
      try {
        const me = await getMeApi(accessToken);
        setUser(me);
      } catch (e) {
        console.warn('Lỗi làm mới profile:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
