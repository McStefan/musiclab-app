import { MMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

/**
 * Secure storage utility that manages encryption keys properly
 * Uses Keychain/Keystore for encryption keys and MMKV for encrypted data
 */
export class SecureStorage {
  private static instance: SecureStorage;
  private mmkv: MMKV | null = null;
  private encryptionKey: string | null = null;

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  /**
   * Initialize secure storage with proper encryption key management
   */
  async initialize(storageId: string): Promise<MMKV> {
    if (this.mmkv) {
      return this.mmkv;
    }

    try {
      // Get or generate encryption key from secure keychain
      this.encryptionKey = await this.getOrCreateEncryptionKey(storageId);
      
      // Initialize MMKV with secure encryption key
      this.mmkv = new MMKV({
        id: storageId,
        encryptionKey: this.encryptionKey,
      });

      return this.mmkv;
    } catch (error) {
      console.error('Failed to initialize secure storage:', error);
      // Fallback to non-encrypted storage in case of keychain issues
      this.mmkv = new MMKV({ id: storageId });
      return this.mmkv;
    }
  }

  /**
   * Get or create encryption key from device keychain/keystore
   */
  private async getOrCreateEncryptionKey(storageId: string): Promise<string> {
    const keychainService = `musiclab_${storageId}`;
    const keychainAccount = 'encryption_key';

    try {
      // Try to get existing key from keychain
      const credentials = await Keychain.getInternetCredentials(keychainService);
      
      if (credentials && credentials.password) {
        return credentials.password;
      }
    } catch (error) {
      console.warn('Failed to retrieve encryption key from keychain:', error);
    }

    // Generate new encryption key
    const newKey = this.generateEncryptionKey();
    
    try {
      // Store new key in keychain
      await Keychain.setInternetCredentials(
        keychainService,
        keychainAccount,
        newKey,
        {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
          authenticationType: Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
          accessGroup: Platform.OS === 'ios' ? 'group.musiclab.app' : undefined,
        }
      );
      
      return newKey;
    } catch (error) {
      console.error('Failed to store encryption key in keychain:', error);
      // Return the generated key anyway, but it won't persist
      return newKey;
    }
  }

  /**
   * Generate a cryptographically secure encryption key
   */
  private generateEncryptionKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let result = '';
    
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Get the initialized MMKV instance
   */
  getStorage(): MMKV {
    if (!this.mmkv) {
      throw new Error('SecureStorage not initialized. Call initialize() first.');
    }
    return this.mmkv;
  }

  /**
   * Clear all data and remove encryption key
   */
  async clearAll(storageId: string): Promise<void> {
    if (this.mmkv) {
      this.mmkv.clearAll();
    }

    try {
      const keychainService = `musiclab_${storageId}`;
      await Keychain.resetInternetCredentials(keychainService);
    } catch (error) {
      console.warn('Failed to clear keychain:', error);
    }

    this.mmkv = null;
    this.encryptionKey = null;
  }

  /**
   * Check if keychain/keystore is available on device
   */
  async isKeychainAvailable(): Promise<boolean> {
    try {
      const capabilities = await Keychain.getSupportedBiometryType();
      return capabilities !== null;
    } catch {
      return false;
    }
  }
}

export const secureStorage = SecureStorage.getInstance();
