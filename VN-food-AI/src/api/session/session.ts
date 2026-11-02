import { tokenMemory } from "../auth/token-memory";
import { STORAGE_KEYS, tokenStorage } from "../auth/token-storage";
import { TokenResponse, UserResponse } from "../generated/model";

export const sessionState = {
  rememberMe: false,
};

export async function initializeSessionState(): Promise<void> {
  const storedRememberMe = await tokenStorage.get(STORAGE_KEYS.REMEMBER_ME);
  sessionState.rememberMe = storedRememberMe === "true";
}

export async function saveAuthSession(res: TokenResponse): Promise<void> {
  await tokenStorage.set(
    STORAGE_KEYS.REMEMBER_ME,
    String(sessionState.rememberMe),
  );

  if (sessionState.rememberMe) {
    await Promise.all([
      tokenStorage.set(STORAGE_KEYS.ACCESS_TOKEN, res.access_token),
      tokenStorage.set(STORAGE_KEYS.REFRESH_TOKEN, res.refresh_token),
      tokenStorage.set(STORAGE_KEYS.USER, JSON.stringify(res.user)),
    ]);
  } else {
    await Promise.all([
      tokenStorage.clear(STORAGE_KEYS.ACCESS_TOKEN),
      tokenStorage.clear(STORAGE_KEYS.REFRESH_TOKEN),
      tokenStorage.clear(STORAGE_KEYS.USER),
    ]);
    tokenMemory.set(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    tokenMemory.set(STORAGE_KEYS.REFRESH_TOKEN, res.refresh_token);
    tokenMemory.set(STORAGE_KEYS.USER, JSON.stringify(res.user));
  }
}

/**
 * Xóa phiên đăng nhập
 */
export async function clearAuthSession(): Promise<void> {
  await Promise.all([
    tokenStorage.clear(STORAGE_KEYS.ACCESS_TOKEN),
    tokenStorage.clear(STORAGE_KEYS.REFRESH_TOKEN),
    tokenStorage.clear(STORAGE_KEYS.USER),
  ]);
  tokenMemory.clear(STORAGE_KEYS.ACCESS_TOKEN);
  tokenMemory.clear(STORAGE_KEYS.REFRESH_TOKEN);
  tokenMemory.clear(STORAGE_KEYS.USER);
}

export async function getStoredToken(key: string) {
  return sessionState.rememberMe ? tokenStorage.get(key) : tokenMemory.get(key);
}

/**
 * Lấy token hiện tại
 */
export async function getStoredTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  user: UserResponse | null;
}> {
  const getFromStorage = async () => {
    return await Promise.all([
      tokenStorage.get(STORAGE_KEYS.ACCESS_TOKEN),
      tokenStorage.get(STORAGE_KEYS.REFRESH_TOKEN),
      tokenStorage.get(STORAGE_KEYS.USER),
    ]);
  };

  const getFromMemory = () => {
    return [
      tokenMemory.get(STORAGE_KEYS.ACCESS_TOKEN),
      tokenMemory.get(STORAGE_KEYS.REFRESH_TOKEN),
      tokenMemory.get(STORAGE_KEYS.USER),
    ];
  };

  const [accessToken, refreshToken, userStr] = sessionState.rememberMe
    ? await getFromStorage()
    : getFromMemory();

  let user: UserResponse | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }

  return { accessToken, refreshToken, user };
}
