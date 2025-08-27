import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStore, LoginCredentials, SignUpCredentials, ChangePasswordCredentials, User } from '../types';
import { authService } from '../services/AuthService';
import { authStorage } from '../storage/authStorage';
import { mmkvStorage } from '../../../store/mmkvStorage';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastLoginTime: null,
      biometricEnabled: false,

      // Actions
      signIn: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const { user, tokens } = await authService.signIn(credentials);
          
          await authStorage.storeLastLoginTime();
          const lastLoginTime = authStorage.getLastLoginTime();
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            lastLoginTime,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Sign in failed',
          });
          throw error;
        }
      },

      signUp: async (credentials: SignUpCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const { user, tokens } = await authService.signUp(credentials);
          
          await authStorage.storeLastLoginTime();
          const lastLoginTime = authStorage.getLastLoginTime();
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            lastLoginTime,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Sign up failed',
          });
          throw error;
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { user, tokens } = await authService.signInWithGoogle();
          
          await authStorage.storeLastLoginTime();
          const lastLoginTime = authStorage.getLastLoginTime();
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            lastLoginTime,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Google sign in failed',
          });
          throw error;
        }
      },

      signInWithApple: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { user, tokens } = await authService.signInWithApple();
          
          await authStorage.storeLastLoginTime();
          const lastLoginTime = authStorage.getLastLoginTime();
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            lastLoginTime,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Apple sign in failed',
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        
        try {
          await authService.signOut();
          
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            lastLoginTime: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Sign out failed',
          });
        }
      },

      refreshToken: async () => {
        try {
          const tokens = await authService.refreshToken();
          set({ tokens });
        } catch (error) {
          // If refresh fails, sign out the user
          await get().signOut();
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await authService.resetPassword(email);
          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Password reset failed',
          });
          throw error;
        }
      },

      changePassword: async (credentials: ChangePasswordCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock password change
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Password change failed',
          });
          throw error;
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        set({ isLoading: true, error: null });
        
        try {
          const currentUser = get().user;
          if (!currentUser) throw new Error('No user logged in');
          
          // Mock profile update
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const updatedUser = { ...currentUser, ...updates };
          await authStorage.storeUser(updatedUser);
          
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Profile update failed',
          });
          throw error;
        }
      },

      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock account deletion
          await new Promise(resolve => setTimeout(resolve, 1000));
          await authService.signOut();
          
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Account deletion failed',
          });
          throw error;
        }
      },

      enableBiometric: async (enabled: boolean) => {
        try {
          await authStorage.setBiometricEnabled(enabled);
          set({ biometricEnabled: enabled });
        } catch (error) {
          throw new Error('Failed to update biometric settings');
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuthStatus: async () => {
        try {
          const [user, tokens] = await Promise.all([
            authService.getCurrentUser(),
            authService.getTokens(),
          ]);
          
          const lastLoginTime = authStorage.getLastLoginTime();
          const biometricEnabled = authStorage.getBiometricEnabled();
          
          if (user && tokens) {
            set({
              user,
              tokens,
              isAuthenticated: true,
              lastLoginTime,
              biometricEnabled,
            });
          } else {
            set({
              user: null,
              tokens: null,
              isAuthenticated: false,
              lastLoginTime: null,
              biometricEnabled,
            });
          }
        } catch (error) {
          console.error('Auth status check failed:', error);
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        // Only persist non-sensitive state
        lastLoginTime: state.lastLoginTime,
        biometricEnabled: state.biometricEnabled,
      }),
    }
  )
);
