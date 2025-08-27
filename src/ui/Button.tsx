import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { textStyles, containers, layouts } from '../theme/styles';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Button text */
  title: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Icon to show on the left */
  leftIcon?: React.ReactNode;
  /** Icon to show on the right */
  rightIcon?: React.ReactNode;
  /** Custom styles */
  style?: ViewStyle;
  /** Custom text styles */
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'large',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const buttonStyles = StyleSheet.create({
    base: {
      ...containers.button,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[2],
    },

    // Variants
    primary: {
      backgroundColor: colors.accent,
    },
    secondary: {
      backgroundColor: colors.background.card,
      borderWidth: 0.5,
      borderColor: colors.border.white,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },

    // Sizes
    small: {
      height: 36,
      paddingHorizontal: spacing[3],
    },
    medium: {
      height: 44,
      paddingHorizontal: spacing[4],
    },
    large: {
      height: 50,
      paddingHorizontal: spacing[5],
    },

    // States
    disabled: {
      opacity: 0.5,
    },
  });

  const textStyleVariants = StyleSheet.create({
    primary: {
      color: colors.primary,
    },
    secondary: {
      color: colors.white,
    },
    outline: {
      color: colors.white,
    },
    ghost: {
      color: colors.white,
    },
  });

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        buttonStyles.base,
        buttonStyles[variant],
        buttonStyles[size],
        isDisabled && buttonStyles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.primary : colors.white}
        />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          
          <Text
            style={[
              textStyles.buttonPrimary,
              textStyleVariants[variant],
              textStyle,
            ]}
          >
            {title}
          </Text>
          
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
