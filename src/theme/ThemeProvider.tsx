import React, { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from './tokens';

interface ThemeContextType {
  theme: Theme;
  colors: Theme['colors'];
  typography: Theme['typography'];
  spacing: Theme['spacing'];
  borderRadius: Theme['borderRadius'];
  shadows: Theme['shadows'];
  sizes: Theme['sizes'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const value: ThemeContextType = {
    theme,
    colors: theme.colors,
    typography: theme.typography,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    shadows: theme.shadows,
    sizes: theme.sizes,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Convenience hooks for specific theme sections
export const useColors = () => useTheme().colors;
export const useTypography = () => useTheme().typography;
export const useSpacing = () => useTheme().spacing;
export const useSizes = () => useTheme().sizes;
