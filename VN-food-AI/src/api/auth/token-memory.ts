const memoryStore: Record<string, string> = {};

function setItem(storage_key: string, token: string) {
  memoryStore[storage_key] = token;
}

function getItem(storage_key: string): string | null {
  return memoryStore[storage_key] || null;
}

function deleteItem(storage_key: string) {
  delete memoryStore[storage_key];
}

export const tokenMemory = {
  get: (storage_key: string) => getItem(storage_key),
  set: (storage_key: string, token: string) => setItem(storage_key, token),
  clear: (storage_key: string) => deleteItem(storage_key),
};
