import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { tokenMemory } from "./token-memory";

const isWeb = Platform.OS === "web";

async function setItem(storage_key: string, token: string): Promise<void> {
  if (isWeb) {
    try {
      localStorage.setItem(storage_key, token);
    } catch {
      tokenMemory.set(storage_key, token);
    }
  } else {
    try {
      await SecureStore.setItemAsync(storage_key, token);
    } catch (e) {
      console.warn(`SecureStore setItem failed for ${storage_key}:`, e);
      tokenMemory.set(storage_key, token);
    }
  }
}

async function getItem(storage_key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return localStorage.getItem(storage_key);
    } catch {
      return tokenMemory.get(storage_key);
    }
  } else {
    try {
      return await SecureStore.getItemAsync(storage_key);
    } catch (e) {
      console.warn(`SecureStore getItem failed for ${storage_key}:`, e);
      return tokenMemory.get(storage_key);
    }
  }
}

async function deleteItem(storage_key: string): Promise<void> {
  if (isWeb) {
    try {
      localStorage.removeItem(storage_key);
    } catch {
      tokenMemory.clear(storage_key);
    }
  } else {
    try {
      await SecureStore.deleteItemAsync(storage_key);
    } catch (e) {
      console.warn(`SecureStore deleteItem failed for ${storage_key}:`, e);
      tokenMemory.clear(storage_key);
    }
  }
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "caloviet_access_token",
  REFRESH_TOKEN: "caloviet_refresh_token",
  USER: "caloviet_user",
  REMEMBER_ME: "caloviet_remember_me",
};

export const tokenStorage = {
  get: (storage_key: string) => getItem(storage_key),
  set: (storage_key: string, token: string) => setItem(storage_key, token),
  clear: (storage_key: string) => deleteItem(storage_key),
};
