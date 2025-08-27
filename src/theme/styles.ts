import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { theme } from './tokens';

// Type-safe style utilities
type SpacingKey = keyof typeof theme.spacing;
type ColorPath = string;

// Text style utilities
export const createTextStyle = ({
  size = 'md',
  weight = 'normal',
  color = theme.colors.text.primary,
  family = theme.typography.fontFamily.secondary,
  lineHeight = theme.typography.lineHeight.normal,
  letterSpacing = theme.typography.letterSpacing.normal,
}: {
  size?: keyof typeof theme.typography.fontSize;
  weight?: keyof typeof theme.typography.fontWeight;
  color?: string;
  family?: string;
  lineHeight?: number;
  letterSpacing?: string;
}): TextStyle => ({
  fontSize: theme.typography.fontSize[size],
  fontWeight: theme.typography.fontWeight[weight],
  color,
  fontFamily: family,
  lineHeight: theme.typography.fontSize[size] * lineHeight,
  letterSpacing: letterSpacing === 'normal' ? 0 : parseFloat(letterSpacing.replace('em', '')) * theme.typography.fontSize[size],
});

// Shadow utilities
export const createShadow = (type: keyof typeof theme.shadows): ViewStyle => {
  const shadow = theme.shadows[type];
  
  if (shadow.includes('blur')) {
    // For React Native Web blur effects
    return {
      // @ts-ignore - Web-specific style
      backdropFilter: shadow,
    };
  }
  
  // Parse box shadow for React Native
  if (shadow.includes('rgba')) {
    const parts = shadow.match(/(\d+(?:\.\d+)?)px/g);
    const color = shadow.match(/rgba?\([^)]+\)/)?.[0];
    
    if (parts && color) {
      return {
        shadowOffset: {
          width: parseFloat(parts[0]) || 0,
          height: parseFloat(parts[1]) || 0,
        },
        shadowRadius: parseFloat(parts[2]) || 0,
        shadowColor: color,
        shadowOpacity: 1,
        elevation: 8, // Android shadow
      };
    }
  }
  
  return {};
};

// Common layout styles
export const layouts = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  
  row: {
    flexDirection: 'row',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  centerHorizontal: {
    alignItems: 'center',
  },
  
  centerVertical: {
    justifyContent: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  wrap: {
    flexWrap: 'wrap',
  },
  
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// Predefined text styles based on Figma
export const textStyles = StyleSheet.create({
  // Headers
  h1: createTextStyle({
    size: '2xl',
    weight: 'bold',
    family: theme.typography.fontFamily.primary,
    lineHeight: 1.3571,
    letterSpacing: '0.015em',
  }),
  
  h2: createTextStyle({
    size: 'xl',
    weight: 'bold',
    family: theme.typography.fontFamily.primary,
    lineHeight: 1.4,
    letterSpacing: '0.012em',
  }),
  
  // Body text
  body: createTextStyle({
    size: 'md',
    weight: 'normal',
    lineHeight: 1.625,
  }),
  
  bodySmall: createTextStyle({
    size: 'sm',
    weight: 'normal',
    lineHeight: 1.571,
  }),
  
  caption: createTextStyle({
    size: 'xs',
    weight: 'normal',
    lineHeight: 1.5,
    color: theme.colors.text.secondary,
  }),
  
  // Button text
  buttonPrimary: createTextStyle({
    size: 'md',
    weight: 'semibold',
    lineHeight: 1.625,
    letterSpacing: '0.01em',
  }),
  
  buttonSecondary: createTextStyle({
    size: 'md',
    weight: 'bold',
    lineHeight: 1.625,
    letterSpacing: '0.01em',
  }),
  
  // Navigation
  navLabel: createTextStyle({
    size: 'xs',
    weight: 'normal',
    lineHeight: 1.5,
  }),
  
  // System
  systemTime: createTextStyle({
    size: 'lg',
    weight: 'medium',
    family: theme.typography.fontFamily.system,
    lineHeight: 1.429,
    letterSpacing: '-0.029em',
  }),
  
  systemBattery: createTextStyle({
    size: 'xs',
    weight: 'medium',
    family: theme.typography.fontFamily.system,
    lineHeight: 2.2,
  }),
});

// Container styles
export const containers = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    ...createShadow('sm'),
  },
  
  cardMedium: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    width: theme.sizes.card.medium.width,
    height: theme.sizes.card.medium.height,
  },
  
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    height: theme.sizes.input.heightLarge,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[3],
  },
  
  button: {
    borderRadius: theme.borderRadius.md,
    height: theme.sizes.button.heightLarge,
    paddingHorizontal: theme.spacing[5],
    ...layouts.centerHorizontal,
    ...layouts.centerVertical,
  },
  
  buttonPrimary: {
    backgroundColor: theme.colors.accent,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
});

// Spacing utilities
export const spacing = {
  // Padding
  p: (size: SpacingKey) => ({ padding: theme.spacing[size] }),
  pt: (size: SpacingKey) => ({ paddingTop: theme.spacing[size] }),
  pb: (size: SpacingKey) => ({ paddingBottom: theme.spacing[size] }),
  pl: (size: SpacingKey) => ({ paddingLeft: theme.spacing[size] }),
  pr: (size: SpacingKey) => ({ paddingRight: theme.spacing[size] }),
  px: (size: SpacingKey) => ({ 
    paddingLeft: theme.spacing[size], 
    paddingRight: theme.spacing[size] 
  }),
  py: (size: SpacingKey) => ({ 
    paddingTop: theme.spacing[size], 
    paddingBottom: theme.spacing[size] 
  }),
  
  // Margin
  m: (size: SpacingKey) => ({ margin: theme.spacing[size] }),
  mt: (size: SpacingKey) => ({ marginTop: theme.spacing[size] }),
  mb: (size: SpacingKey) => ({ marginBottom: theme.spacing[size] }),
  ml: (size: SpacingKey) => ({ marginLeft: theme.spacing[size] }),
  mr: (size: SpacingKey) => ({ marginRight: theme.spacing[size] }),
  mx: (size: SpacingKey) => ({ 
    marginLeft: theme.spacing[size], 
    marginRight: theme.spacing[size] 
  }),
  my: (size: SpacingKey) => ({ 
    marginTop: theme.spacing[size], 
    marginBottom: theme.spacing[size] 
  }),
  
  // Gap
  gap: (size: SpacingKey) => ({ gap: theme.spacing[size] }),
};

// Export all utilities
export { theme } from './tokens';
