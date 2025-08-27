export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  subscriptionType: 'free' | 'trial' | 'standard' | 'premium' | 'family';
  createdAt: string;
  updatedAt?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  dateOfBirth?: string;
  country?: string;
  language?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  audioQuality: 'low' | 'medium' | 'high' | 'lossless';
  downloadQuality: 'low' | 'medium' | 'high' | 'lossless';
  crossfade: boolean;
  crossfadeDuration: number;
  gaplessPlayback: boolean;
  equalizer: EqualizerSettings;
  notifications: NotificationSettings;
}

export interface EqualizerSettings {
  enabled: boolean;
  preset: string;
  bands: number[];
}

export interface NotificationSettings {
  newReleases: boolean;
  playlistUpdates: boolean;
  recommendations: boolean;
  social: boolean;
  marketing: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType?: string;
  scope?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

export interface ResetPasswordCredentials {
  email: string;
}

export interface ChangePasswordCredentials {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface OAuthProvider {
  id: 'google' | 'apple' | 'facebook' | 'spotify';
  name: string;
  clientId: string;
  scopes: string[];
  authorizationEndpoint: string;
  tokenEndpoint: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastLoginTime: number | null;
  biometricEnabled: boolean;
}

export interface AuthActions {
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (credentials: ChangePasswordCredentials) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  enableBiometric: (enabled: boolean) => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

// API Response Types
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Session Types
export interface Session {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isActive: boolean;
}

// Social Login Types
export interface SocialProfile {
  id: string;
  provider: 'google' | 'apple' | 'facebook' | 'spotify';
  providerUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isVerified: boolean;
  connectedAt: string;
}

export interface BiometricConfig {
  enabled: boolean;
  type: 'fingerprint' | 'face' | 'iris' | 'none';
  fallbackToPassword: boolean;
  promptMessage: string;
}

// Auth Events
export type AuthEvent = 
  | { type: 'SIGN_IN_START' }
  | { type: 'SIGN_IN_SUCCESS'; user: User }
  | { type: 'SIGN_IN_ERROR'; error: string }
  | { type: 'SIGN_OUT' }
  | { type: 'TOKEN_REFRESH_SUCCESS'; tokens: AuthTokens }
  | { type: 'TOKEN_REFRESH_ERROR'; error: string }
  | { type: 'SESSION_EXPIRED' }
  | { type: 'BIOMETRIC_ENABLED'; enabled: boolean };
