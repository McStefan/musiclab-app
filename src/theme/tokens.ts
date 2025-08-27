/**
 * Design tokens extracted from Figma
 * File: "Моё" (l7OkOT0EovnBVVapkWH6vU)
 */

export const colors = {
  // Primary colors
  primary: '#010715', // Background
  white: '#FFFFFF',   // Text primary
  black: '#000000',   // Black elements
  
  // Accent colors
  accent: '#CFE741',  // Green buttons
  purple: '#7447F3', // Purple accents
  pink: '#BD1DCC',   // Pink accents
  blue: '#234DDE',   // Blue accents
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#999CA1',
    tertiary: '#80838A',
    muted: '#999CA1',
  },
  
  // Background colors
  background: {
    primary: '#010715',
    secondary: '#1A202C',
    card: 'rgba(255, 255, 255, 0.01)',
    overlay: 'rgba(2, 19, 40, 0.3)',
    blur: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Border colors
  border: {
    primary: '#CCCDD0',
    secondary: '#80838A',
    white: '#FFFFFF',
  },
  
  // System colors
  system: {
    battery: '#B3B5B9',
    signal: '#DADADA',
    island: '#06092E',
    islandBorder: '#1C1932',
    lens: '#686D95',
    lensSecondary: '#52567C',
  },
  
  // Status colors (for future use)
  status: {
    success: '#34A853',
    error: '#EA4335',
    warning: '#FBBC05',
    info: '#4285F4',
  }
} as const;

export const typography = {
  fontFamily: {
    primary: 'Montserrat', // Headers
    secondary: 'Inter',     // Body text
    system: 'SF Pro Text',  // System elements
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 28,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: 1.3,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.015em',
    wider: '0.012em',
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const shadows = {
  sm: '0px 2px 3px 0px rgba(0, 0, 0, 0.16)',
  md: '0px 4px 24px 0px rgba(0, 0, 0, 0.15)',
  lg: 'blur(20px)',
  xl: 'blur(300px)',
} as const;

export const sizes = {
  icon: {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 50,
  },
  
  input: {
    height: 36,
    heightLarge: 50,
  },
  
  button: {
    height: 44,
    heightLarge: 50,
  },
  
  card: {
    small: {
      width: 188,
      height: 106,
    },
    medium: {
      width: 270,
      height: 152,
    },
  },
  
  statusBar: {
    height: 44,
  },
  
  bottomNav: {
    height: 88,
  },
  
  homeIndicator: {
    width: 134,
    height: 4,
  },
} as const;

export const opacity = {
  disabled: 0.5,
  overlay: 0.3,
  subtle: 0.1,
  transparent: 0.01,
} as const;

export const zIndex = {
  background: -1,
  base: 0,
  overlay: 10,
  modal: 20,
  toast: 30,
  statusBar: 40,
} as const;

// Animation durations (in milliseconds)
export const animation = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

// Breakpoints for responsive design (mainly for web)
export const breakpoints = {
  mobile: 430,
  tablet: 768,
  desktop: 1024,
} as const;

// Export combined theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  sizes,
  opacity,
  zIndex,
  animation,
  breakpoints,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
