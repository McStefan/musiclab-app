import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { AuthStore } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthStore | null>(null);

export const useAuth = (): AuthStore => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authStore = useAuthStore();

  useEffect(() => {
    // Check authentication status on app start
    authStore.checkAuthStatus();
  }, []);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!authStore.tokens || !authStore.isAuthenticated) return;

    const checkTokenExpiration = () => {
      const { tokens } = authStore;
      if (!tokens) return;

      const timeUntilExpiry = tokens.expiresAt - Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      // Refresh token if it expires in less than 5 minutes
      if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
        authStore.refreshToken().catch(() => {
          // If refresh fails, the store will handle sign out
        });
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

    return () => clearInterval(interval);
  }, [authStore.tokens, authStore.isAuthenticated]);

  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
};
