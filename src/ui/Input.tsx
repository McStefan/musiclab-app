import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { textStyles, containers } from '../theme/styles';

interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Size variant */
  size?: 'medium' | 'large';
  /** Left icon component */
  leftIcon?: React.ReactNode;
  /** Right icon component */
  rightIcon?: React.ReactNode;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Input style */
  inputStyle?: TextStyle;
  /** Label style */
  labelStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'large',
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },

    label: {
      ...textStyles.bodySmall,
      color: colors.text.secondary,
      marginBottom: spacing[1],
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: error ? colors.status.error : 
                   isFocused ? colors.white : colors.border.primary,
      borderRadius: borderRadius.md,
      height: size === 'large' ? 50 : 44,
      paddingHorizontal: spacing[5],
    },

    input: {
      flex: 1,
      ...textStyles.body,
      color: colors.white,
      paddingVertical: 0, // Remove default padding
    },

    iconContainer: {
      marginHorizontal: spacing[2],
    },

    helperText: {
      ...textStyles.caption,
      color: error ? colors.status.error : colors.text.tertiary,
      marginTop: spacing[1],
    },

    placeholder: {
      color: colors.text.secondary,
    },
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={colors.text.secondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={styles.helperText}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};
