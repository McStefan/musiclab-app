import { secureStorage } from '../utils/secureStorage';

// Initialize secure storage
let storage: any = null;

// Initialize storage asynchronously
const initStorage = async () => {
  if (!storage) {
    storage = await secureStorage.initialize('app-storage');
  }
  return storage;
};

// Custom MMKV storage interface for Zustand with encryption
export const mmkvStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const mmkv = await initStorage();
      const value = mmkv.getString(name);
      return value ?? null;
    } catch (error) {
      console.error('Failed to get item from storage:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const mmkv = await initStorage();
      mmkv.set(name, value);
    } catch (error) {
      console.error('Failed to set item in storage:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      const mmkv = await initStorage();
      mmkv.delete(name);
    } catch (error) {
      console.error('Failed to remove item from storage:', error);
    }
  },
};
