import { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types/auth';
import { deleteItem, getItem, setItem, STORAGE_KEYS } from './storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function extractErrorMessage(data: any, defaultMsg: string): string {
  if (!data) return defaultMsg;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const first = data.detail[0];
    return first.msg || first.message || defaultMsg;
  }
  if (data.message) return data.message;
  return defaultMsg;
}

/**
 * Đăng ký tài khoản mới: POST /api/v1/auth/register
 */
export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: payload.email.trim(),
      password: payload.password,
      ...(payload.full_name ? { full_name: payload.full_name.trim() } : {}),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = extractErrorMessage(data, `Đăng ký thất bại (${response.status})`);
    throw new Error(errorMsg);
  }

  return data as AuthResponse;
}

/**
 * Đăng nhập tài khoản: POST /api/v1/auth/login
 */
export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: payload.email.trim(),
      password: payload.password,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = extractErrorMessage(data, `Đăng nhập thất bại (${response.status})`);
    throw new Error(errorMsg);
  }

  return data as AuthResponse;
}

/**
 * Cấp lại token mới bằng refresh token: POST /api/v1/auth/refresh
 */
export async function refreshTokenApi(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = extractErrorMessage(data, 'Phiên đăng nhập đã hết hạn');
    throw new Error(errorMsg);
  }

  return data as AuthResponse;
}

/**
 * Đăng xuất: POST /api/v1/auth/logout
 */
export async function logoutApi(refreshToken: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch (e) {
    console.warn('Lỗi gọi API logout:', e);
  }
}

/**
 * Lấy thông tin user hiện tại: GET /api/v1/auth/me
 */
export async function getMeApi(accessToken: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = extractErrorMessage(data, 'Không thể lấy thông tin tài khoản');
    throw new Error(errorMsg);
  }

  return data as User;
}

/**
 * Lưu phiên đăng nhập
 */
export async function saveAuthSession(auth: AuthResponse): Promise<void> {
  await Promise.all([
    setItem(STORAGE_KEYS.ACCESS_TOKEN, auth.access_token),
    setItem(STORAGE_KEYS.REFRESH_TOKEN, auth.refresh_token),
    setItem(STORAGE_KEYS.USER, JSON.stringify(auth.user)),
  ]);
}

/**
 * Xóa phiên đăng nhập
 */
export async function clearAuthSession(): Promise<void> {
  await Promise.all([
    deleteItem(STORAGE_KEYS.ACCESS_TOKEN),
    deleteItem(STORAGE_KEYS.REFRESH_TOKEN),
    deleteItem(STORAGE_KEYS.USER),
  ]);
}

/**
 * Lấy token hiện tại
 */
export async function getStoredTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}> {
  const [accessToken, refreshToken, userStr] = await Promise.all([
    getItem(STORAGE_KEYS.ACCESS_TOKEN),
    getItem(STORAGE_KEYS.REFRESH_TOKEN),
    getItem(STORAGE_KEYS.USER),
  ]);

  let user: User | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }

  return { accessToken, refreshToken, user };
}

/**
 * Wrapper gọi API có xác thực, tự động refresh token nếu gặp 401
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let { accessToken, refreshToken } = await getStoredTokens();

  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response = await fetch(url, { ...options, headers });

  // Nếu gặp 401 và có refresh token -> tự động refresh và retry
  if (response.status === 401 && refreshToken) {
    try {
      const refreshed = await refreshTokenApi(refreshToken);
      await saveAuthSession(refreshed);

      headers.set('Authorization', `Bearer ${refreshed.access_token}`);
      response = await fetch(url, { ...options, headers });
    } catch (refreshErr) {
      // Refresh thất bại -> xóa session
      await clearAuthSession();
      throw refreshErr;
    }
  }

  return response;
}
