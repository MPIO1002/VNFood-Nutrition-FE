import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";
const memoryStore: Record<string, string> = {};

async function setItem(storage_key: string, token: string): Promise<void> {
  if (isWeb) {
    try {
      localStorage.setItem(storage_key, token);
    } catch {
      memoryStore[storage_key] = token;
    }
  } else {
    try {
      await SecureStore.setItemAsync(storage_key, token);
    } catch (e) {
      console.warn(`SecureStore setItem failed for ${storage_key}:`, e);
      memoryStore[storage_key] = token;
    }
  }
}

async function getItem(storage_key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return localStorage.getItem(storage_key);
    } catch {
      return memoryStore[storage_key] || null;
    }
  } else {
    try {
      return await SecureStore.getItemAsync(storage_key);
    } catch (e) {
      console.warn(`SecureStore getItem failed for ${storage_key}:`, e);
      return memoryStore[storage_key] || null;
    }
  }
}

async function deleteItem(storage_key: string): Promise<void> {
  if (isWeb) {
    try {
      localStorage.removeItem(storage_key);
    } catch {
      delete memoryStore[storage_key];
    }
  } else {
    try {
      await SecureStore.deleteItemAsync(storage_key);
    } catch (e) {
      console.warn(`SecureStore deleteItem failed for ${storage_key}:`, e);
      delete memoryStore[storage_key];
    }
  }
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "caloviet_access_token",
  REFRESH_TOKEN: "caloviet_refresh_token",
  USER: "caloviet_user",
};

export const tokenStorage = {
  get: (storage_key: string) => getItem(storage_key),
  set: (storage_key: string, token: string) => setItem(storage_key, token),
  clear: (storage_key: string) => deleteItem(storage_key),
};
