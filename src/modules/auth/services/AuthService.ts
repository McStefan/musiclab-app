import { AuthRequest, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { authStorage } from '../storage/authStorage';
import { User, LoginCredentials, SignUpCredentials, AuthTokens } from '../types';
import { apiClient } from '../../../services/apiClient';

WebBrowser.maybeCompleteAuthSession();

export class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Email/Password Auth
  async signIn(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/signin', {
        email: credentials.email,
        password: credentials.password,
      });

      const { user, tokens } = response.data;
      
      await authStorage.storeTokens(tokens);
      await authStorage.storeUser(user);
      
      return { user, tokens };
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/signup', {
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
      });

      const { user, tokens } = response.data;
      
      await authStorage.storeTokens(tokens);
      await authStorage.storeUser(user);
      
      return { user, tokens };
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  // Google OAuth
  async signInWithGoogle(): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const redirectUri = makeRedirectUri({
        scheme: 'musiclab',
        useProxy: true,
      });

      const request = new AuthRequest({
        clientId: Platform.select({
          android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'mock_client_id',
          default: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'mock_client_id',
        }),
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: 'code',
        additionalParameters: {},
        extraParams: {
          access_type: 'offline',
        },
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
      });

      if (result.type === 'success') {
        // Exchange authorization code for tokens
        const response = await apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/google', {
          authorizationCode: result.params.code,
          redirectUri,
        });

        const { user, tokens } = response.data;
        
        await authStorage.storeTokens(tokens);
        await authStorage.storeUser(user);
        
        return { user, tokens };
      } else {
        throw new Error('Google authentication cancelled');
      }
    } catch (error) {
      throw new Error('Google authentication failed');
    }
  }

  // Apple Sign In (Native for iOS, Web flow for Android)
  async signInWithApple(): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      if (Platform.OS === 'ios') {
        // Native Apple Sign In for iOS
        return await this.signInWithAppleNative();
      } else {
        // Web flow for Android
        const redirectUri = makeRedirectUri({
          scheme: 'musiclab',
          useProxy: true,
        });

        const request = new AuthRequest({
          clientId: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID || 'mock_apple_client_id',
          scopes: ['name', 'email'],
          redirectUri,
          responseType: 'code',
        });

        const result = await request.promptAsync({
          authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
        });

        if (result.type === 'success') {
          // Mock successful Apple OAuth
          const user: User = {
            id: 'apple_user_' + Date.now(),
            email: 'user@privaterelay.appleid.com',
            firstName: 'Apple',
            lastName: 'User',
            avatar: null,
            subscriptionType: 'free',
            createdAt: new Date().toISOString(),
          };
          
          const tokens: AuthTokens = {
            accessToken: 'apple_access_token',
            refreshToken: 'apple_refresh_token',
            expiresAt: Date.now() + 3600000,
          };
          
          await authStorage.storeTokens(tokens);
          await authStorage.storeUser(user);
          
          return { user, tokens };
        } else {
          throw new Error('Apple authentication cancelled');
        }
      }
    } catch (error) {
      throw new Error('Apple authentication failed');
    }
  }

  async signOut(): Promise<void> {
    await authStorage.clearAll();
  }

  async getCurrentUser(): Promise<User | null> {
    return await authStorage.getUser();
  }

  async getTokens(): Promise<AuthTokens | null> {
    return await authStorage.getTokens();
  }

  async refreshToken(): Promise<AuthTokens> {
    const currentTokens = await authStorage.getTokens();
    if (!currentTokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.post<AuthTokens>('/auth/refresh', {
        refreshToken: currentTokens.refreshToken,
      });

      const newTokens = response.data;
      await authStorage.storeTokens(newTokens);
      return newTokens;
    } catch (error) {
      await authStorage.clearAll();
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', { email });
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }

  private async signInWithAppleNative(): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // For Expo, we'd use expo-apple-authentication
      // For bare React Native, we'd use @react-native-apple-authentication/apple-authentication
      
      // Check if Apple Authentication is available
      if (!global.AppleAuthentication) {
        throw new Error('Apple Authentication not available');
      }

      // Mock implementation - in real app would use actual Apple Auth
      await this.delay(1000);
      
      const user: User = {
        id: 'apple_user_' + Date.now(),
        email: 'user@privaterelay.appleid.com',
        firstName: 'Apple',
        lastName: 'User',
        avatar: null,
        subscriptionType: 'free',
        createdAt: new Date().toISOString(),
      };
      
      const tokens: AuthTokens = {
        accessToken: 'apple_native_access_token',
        refreshToken: 'apple_native_refresh_token',
        expiresAt: Date.now() + 3600000,
      };
      
      await authStorage.storeTokens(tokens);
      await authStorage.storeUser(user);
      
      return { user, tokens };
    } catch (error) {
      throw new Error('Native Apple authentication failed');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const authService = AuthService.getInstance();
