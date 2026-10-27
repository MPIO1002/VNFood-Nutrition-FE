import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from "@/api/generated/model";
import { APIMutatorOptions } from "@/api/types/api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthContextType {
  currentUser: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logIn: (props: {
    data: LoginRequest;
    options?: APIMutatorOptions<TokenResponse, LoginRequest>;
  }) => void;
  register: (props: {
    data: RegisterRequest;
    options?: APIMutatorOptions<TokenResponse, RegisterRequest>;
  }) => void;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { initAuth, handleLogin, handleRegister, handleLogout } = useAuth();

  const loadCurrentUser = async () => {
    setIsLoading(true);
    try {
      await initAuth({ onUserChange: setCurrentUser });
    } catch (e) {
      console.warn("Lỗi khôi phục session:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const logIn = ({
    data,
    options,
  }: {
    data: LoginRequest;
    options?: APIMutatorOptions<TokenResponse, LoginRequest>;
  }) => {
    handleLogin({
      data,
      options: {
        onSuccess: (res: TokenResponse) => {
          setCurrentUser(res.user);
          options?.onSuccess?.(res);
        },
        onError: options?.onError,
        onSettled: options?.onSettled,
      },
    });
  };

  const register = ({
    data,
    options,
  }: {
    data: RegisterRequest;
    options?: APIMutatorOptions<TokenResponse, RegisterRequest>;
  }) => {
    handleRegister({
      data,
      options: {
        onSuccess: (res: TokenResponse) => {
          setCurrentUser(res.user);
          options?.onSuccess?.(res);
        },
        onError: options?.onError,
        onSettled: options?.onSettled,
      },
    });
  };

  const logOut = async () => {
    await handleLogout({ options: { onSuccess: () => setCurrentUser(null) } });
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        logIn,
        register,
        logOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
