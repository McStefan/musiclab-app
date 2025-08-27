import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';
import { authService } from '../services/AuthService';

// Mock the auth service
vi.mock('../services/AuthService', () => ({
  authService: {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signInWithGoogle: vi.fn(),
    signInWithApple: vi.fn(),
    signOut: vi.fn(),
    getCurrentUser: vi.fn(),
    getTokens: vi.fn(),
    refreshToken: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

// Mock MMKV storage
vi.mock('../storage/authStorage', () => ({
  authStorage: {
    storeLastLoginTime: vi.fn(),
    getLastLoginTime: vi.fn(() => Date.now()),
    getBiometricEnabled: vi.fn(() => false),
    setBiometricEnabled: vi.fn(),
    storeUser: vi.fn(),
    storeTokens: vi.fn(),
  },
}));

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastLoginTime: null,
      biometricEnabled: false,
    });
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const state = useAuthStore.getState();
    
    expect(state.user).toBeNull();
    expect(state.tokens).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('handles successful sign in', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      subscriptionType: 'free' as const,
      createdAt: new Date().toISOString(),
    };
    
    const mockTokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      expiresAt: Date.now() + 3600000,
    };

    vi.mocked(authService.signIn).mockResolvedValue({
      user: mockUser,
      tokens: mockTokens,
    });

    const store = useAuthStore.getState();
    
    await store.signIn({
      email: 'test@example.com',
      password: 'password',
    });

    const newState = useAuthStore.getState();
    
    expect(newState.user).toEqual(mockUser);
    expect(newState.tokens).toEqual(mockTokens);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeNull();
  });

  it('handles sign in failure', async () => {
    const errorMessage = 'Invalid credentials';
    vi.mocked(authService.signIn).mockRejectedValue(new Error(errorMessage));

    const store = useAuthStore.getState();
    
    await expect(store.signIn({
      email: 'test@example.com',
      password: 'wrong_password',
    })).rejects.toThrow(errorMessage);

    const newState = useAuthStore.getState();
    
    expect(newState.user).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(errorMessage);
  });

  it('handles successful Google sign in', async () => {
    const mockUser = {
      id: 'google_1',
      email: 'test@gmail.com',
      firstName: 'Google',
      lastName: 'User',
      subscriptionType: 'free' as const,
      createdAt: new Date().toISOString(),
    };
    
    const mockTokens = {
      accessToken: 'google_access_token',
      refreshToken: 'google_refresh_token',
      expiresAt: Date.now() + 3600000,
    };

    vi.mocked(authService.signInWithGoogle).mockResolvedValue({
      user: mockUser,
      tokens: mockTokens,
    });

    const store = useAuthStore.getState();
    
    await store.signInWithGoogle();

    const newState = useAuthStore.getState();
    
    expect(newState.user).toEqual(mockUser);
    expect(newState.tokens).toEqual(mockTokens);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('handles sign out', async () => {
    // First sign in
    useAuthStore.setState({
      user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User', subscriptionType: 'free', createdAt: '' },
      tokens: { accessToken: 'token', refreshToken: 'refresh', expiresAt: Date.now() + 3600000 },
      isAuthenticated: true,
    });

    vi.mocked(authService.signOut).mockResolvedValue();

    const store = useAuthStore.getState();
    await store.signOut();

    const newState = useAuthStore.getState();
    
    expect(newState.user).toBeNull();
    expect(newState.tokens).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.error).toBeNull();
  });

  it('handles token refresh', async () => {
    const initialTokens = {
      accessToken: 'old_token',
      refreshToken: 'refresh_token',
      expiresAt: Date.now() + 1000, // Expires soon
    };

    const newTokens = {
      accessToken: 'new_token',
      refreshToken: 'refresh_token',
      expiresAt: Date.now() + 3600000,
    };

    useAuthStore.setState({
      tokens: initialTokens,
      isAuthenticated: true,
    });

    vi.mocked(authService.refreshToken).mockResolvedValue(newTokens);

    const store = useAuthStore.getState();
    await store.refreshToken();

    const newState = useAuthStore.getState();
    
    expect(newState.tokens).toEqual(newTokens);
  });

  it('handles token refresh failure by signing out', async () => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User', subscriptionType: 'free', createdAt: '' },
      tokens: { accessToken: 'token', refreshToken: 'refresh', expiresAt: Date.now() + 1000 },
      isAuthenticated: true,
    });

    vi.mocked(authService.refreshToken).mockRejectedValue(new Error('Refresh failed'));
    vi.mocked(authService.signOut).mockResolvedValue();

    const store = useAuthStore.getState();
    
    await expect(store.refreshToken()).rejects.toThrow('Refresh failed');

    const newState = useAuthStore.getState();
    
    // Should be signed out after refresh failure
    expect(newState.user).toBeNull();
    expect(newState.tokens).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
  });

  it('clears error', () => {
    useAuthStore.setState({ error: 'Some error' });
    
    const store = useAuthStore.getState();
    store.clearError();
    
    const newState = useAuthStore.getState();
    expect(newState.error).toBeNull();
  });

  it('enables biometric authentication', async () => {
    const store = useAuthStore.getState();
    
    await store.enableBiometric(true);
    
    const newState = useAuthStore.getState();
    expect(newState.biometricEnabled).toBe(true);
  });

  it('checks auth status on initialization', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      subscriptionType: 'free' as const,
      createdAt: new Date().toISOString(),
    };
    
    const mockTokens = {
      accessToken: 'stored_token',
      refreshToken: 'stored_refresh',
      expiresAt: Date.now() + 3600000,
    };

    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);
    vi.mocked(authService.getTokens).mockResolvedValue(mockTokens);

    const store = useAuthStore.getState();
    await store.checkAuthStatus();

    const newState = useAuthStore.getState();
    
    expect(newState.user).toEqual(mockUser);
    expect(newState.tokens).toEqual(mockTokens);
    expect(newState.isAuthenticated).toBe(true);
  });
});
