import { STORAGE_KEYS, tokenStorage } from "../auth/token-storage";
import { TokenResponse, UserResponse } from "../generated/model";

export async function saveAuthSession(res: TokenResponse): Promise<void> {
  await Promise.all([
    tokenStorage.set(STORAGE_KEYS.ACCESS_TOKEN, res.access_token),
    tokenStorage.set(STORAGE_KEYS.REFRESH_TOKEN, res.refresh_token),
    tokenStorage.set(STORAGE_KEYS.USER, JSON.stringify(res.user)),
  ]);
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
}

/**
 * Lấy token hiện tại
 */
export async function getStoredTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  user: UserResponse | null;
}> {
  const [accessToken, refreshToken, userStr] = await Promise.all([
    tokenStorage.get(STORAGE_KEYS.ACCESS_TOKEN),
    tokenStorage.get(STORAGE_KEYS.REFRESH_TOKEN),
    tokenStorage.get(STORAGE_KEYS.USER),
  ]);

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
