import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const memoryStore: Record<string, string> = {};

export async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    try {
      localStorage.setItem(key, value);
    } catch {
      memoryStore[key] = value;
    }
  } else {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.warn(`SecureStore setItem failed for ${key}:`, e);
      memoryStore[key] = value;
    }
  }
}

export async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return localStorage.getItem(key);
    } catch {
      return memoryStore[key] || null;
    }
  } else {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn(`SecureStore getItem failed for ${key}:`, e);
      return memoryStore[key] || null;
    }
  }
}

export async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    try {
      localStorage.removeItem(key);
    } catch {
      delete memoryStore[key];
    }
  } else {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn(`SecureStore deleteItem failed for ${key}:`, e);
      delete memoryStore[key];
    }
  }
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'caloviet_access_token',
  REFRESH_TOKEN: 'caloviet_refresh_token',
  USER: 'caloviet_user',
};
