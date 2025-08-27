import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { textStyles } from '../theme/styles';

interface ChipProps {
  /** Chip label */
  label: string;
  /** Whether chip is selected */
  selected?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Chip variant */
  variant?: 'default' | 'filter' | 'category';
  /** Size variant */
  size?: 'small' | 'medium';
  /** Icon to show on the left */
  leftIcon?: React.ReactNode;
  /** Icon to show on the right */
  rightIcon?: React.ReactNode;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Disabled state */
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  variant = 'default',
  size = 'medium',
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled = false,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      gap: spacing[1],
    },

    // Variants
    default: {
      backgroundColor: selected ? colors.white : 'transparent',
      borderWidth: 1,
      borderColor: colors.border.secondary,
    },

    filter: {
      backgroundColor: selected ? colors.white : 'transparent',
      borderWidth: 1,
      borderColor: colors.border.secondary,
    },

    category: {
      backgroundColor: selected ? colors.accent : colors.background.card,
      borderWidth: selected ? 0 : 0.5,
      borderColor: colors.border.white,
    },

    // Sizes
    small: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      height: 32,
    },

    medium: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      height: 36,
    },

    // States
    disabled: {
      opacity: 0.5,
    },

    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const textStyleVariants = StyleSheet.create({
    default: {
      color: selected ? colors.primary : colors.white,
    },
    filter: {
      color: selected ? colors.primary : colors.white,
    },
    category: {
      color: selected ? colors.primary : colors.white,
    },
  });

  const baseTextStyle = size === 'small' ? textStyles.caption : textStyles.bodySmall;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {leftIcon && (
        <View style={styles.iconContainer}>
          {leftIcon}
        </View>
      )}
      
      <Text
        style={[
          baseTextStyle,
          textStyleVariants[variant],
          { fontWeight: selected ? '700' : '400' },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      
      {rightIcon && (
        <View style={styles.iconContainer}>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};
