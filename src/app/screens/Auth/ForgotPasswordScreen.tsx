import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../ui';
import { useTheme } from '../../../theme/ThemeProvider';
import { layouts, textStyles, containers } from '../../../theme/styles';

export const ForgotPasswordScreen = () => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      ...containers.screen,
      ...layouts.center,
      padding: spacing[4],
    },
    title: {
      ...textStyles.h2,
      marginBottom: spacing[4],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Button title="Coming Soon" variant="primary" disabled />
    </SafeAreaView>
  );
};
