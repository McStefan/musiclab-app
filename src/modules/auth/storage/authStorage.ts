import { MMKV } from 'react-native-mmkv';
import CryptoJS from 'expo-crypto';
import { User, AuthTokens } from '../types';

class AuthStorage {
  private storage: MMKV;
  private encryptionKey: string;

  constructor() {
    this.encryptionKey = this.generateEncryptionKey();
    this.storage = new MMKV({
      id: 'auth-storage',
      encryptionKey: this.encryptionKey,
    });
  }

  private generateEncryptionKey(): string {
    // In production, this should be stored securely in Keychain/Keystore
    return 'music-lab-auth-key-2024';
  }

  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      const encryptedTokens = this.encrypt(JSON.stringify(tokens));
      this.storage.set('auth_tokens', encryptedTokens);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const encryptedTokens = this.storage.getString('auth_tokens');
      if (!encryptedTokens) return null;

      const decryptedTokens = this.decrypt(encryptedTokens);
      const tokens: AuthTokens = JSON.parse(decryptedTokens);

      // Check if tokens are expired
      if (tokens.expiresAt && Date.now() > tokens.expiresAt) {
        await this.clearTokens();
        return null;
      }

      return tokens;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      await this.clearTokens(); // Clear corrupted data
      return null;
    }
  }

  async storeUser(user: User): Promise<void> {
    try {
      const encryptedUser = this.encrypt(JSON.stringify(user));
      this.storage.set('user_data', encryptedUser);
    } catch (error) {
      console.error('Error storing user:', error);
      throw new Error('Failed to store user data');
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const encryptedUser = this.storage.getString('user_data');
      if (!encryptedUser) return null;

      const decryptedUser = this.decrypt(encryptedUser);
      return JSON.parse(decryptedUser) as User;
    } catch (error) {
      console.error('Error retrieving user:', error);
      await this.clearUser(); // Clear corrupted data
      return null;
    }
  }

  async storeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const encryptedToken = this.encrypt(refreshToken);
      this.storage.set('refresh_token', encryptedToken);
    } catch (error) {
      console.error('Error storing refresh token:', error);
      throw new Error('Failed to store refresh token');
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      const encryptedToken = this.storage.getString('refresh_token');
      if (!encryptedToken) return null;

      return this.decrypt(encryptedToken);
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      await this.clearRefreshToken();
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    this.storage.delete('auth_tokens');
  }

  async clearUser(): Promise<void> {
    this.storage.delete('user_data');
  }

  async clearRefreshToken(): Promise<void> {
    this.storage.delete('refresh_token');
  }

  async clearAll(): Promise<void> {
    this.storage.clearAll();
  }

  // Biometric authentication preference
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    this.storage.set('biometric_enabled', enabled);
  }

  getBiometricEnabled(): boolean {
    return this.storage.getBoolean('biometric_enabled') ?? false;
  }

  // Session management
  async storeLastLoginTime(): Promise<void> {
    this.storage.set('last_login_time', Date.now());
  }

  getLastLoginTime(): number | null {
    const timestamp = this.storage.getNumber('last_login_time');
    return timestamp ?? null;
  }

  // Device ID for security
  async storeDeviceId(deviceId: string): Promise<void> {
    this.storage.set('device_id', deviceId);
  }

  getDeviceId(): string | null {
    return this.storage.getString('device_id') ?? null;
  }
}

export const authStorage = new AuthStorage();
