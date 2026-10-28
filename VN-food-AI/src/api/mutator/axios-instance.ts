import Axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { STORAGE_KEYS, tokenStorage } from "../auth/token-storage";
import { TokenResponse } from "../generated/model";
import {
  clearAuthSession,
  getStoredTokens,
  saveAuthSession,
} from "../session/session";

const baseURL = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

if (!baseURL) {
  throw new Error(
    "EXPO_PUBLIC_API_URL is not configured. Add it to the app's .env file and restart Expo.",
  );
}

export const AXIOS_INSTANCE = Axios.create({ baseURL, timeout: 15000 });

let onUnauthorized: (() => void) | undefined;
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

// Add the access token to every request
AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh logic
let refreshPromise: Promise<string> | null = null;

const refreshSession = async (): Promise<string> => {
  const { refreshToken, user } = await getStoredTokens();
  if (!refreshToken) throw new Error("No refresh token");

  const { data } = await Axios.post<TokenResponse>(
    `${baseURL}/api/v1/auth/refresh`,
    { refresh_token: refreshToken },
  );

  // If the refresh response has no user, keep the stored one
  await saveAuthSession({ ...data, user: data.user ?? user! });
  return data.access_token;
};

const isAuthEndpoint = (url?: string) =>
  !!url && /\/auth\/(login|register|refresh)/.test(url);

// 3. On 401: refresh once, then retry the request
AXIOS_INSTANCE.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint(original.url)
    ) {
      original._retry = true;

      try {
        // Parallel 401s share ONE refresh call
        refreshPromise ??= refreshSession().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;

        original.headers.Authorization = `Bearer ${newToken}`;
        return AXIOS_INSTANCE(original);
      } catch (refreshErr) {
        await clearAuthSession();
        onUnauthorized?.();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const requestConfig = { ...config, ...options };
  if (
    requestConfig.data instanceof FormData &&
    requestConfig.headers
  ) {
    delete requestConfig.headers["Content-Type"];
    delete requestConfig.headers["content-type"];
  }
  return AXIOS_INSTANCE(requestConfig).then(({ data }) => data);
};

export type ErrorType<E> = AxiosError<E>;
export type BodyType<D> = D;
