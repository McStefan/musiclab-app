import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../ui';
import { useTheme } from '../../../theme/ThemeProvider';
import { layouts, textStyles, containers } from '../../../theme/styles';

export const PaywallScreen = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      ...containers.screen,
      ...layouts.center,
      padding: spacing[4],
    },
    title: {
      ...textStyles.h2,
      marginBottom: spacing[4],
      textAlign: 'center',
    },
    subtitle: {
      ...textStyles.body,
      textAlign: 'center',
      marginBottom: spacing[8],
    },
    buttons: {
      width: '100%',
      gap: spacing[4],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Upgrade to Premium</Text>
      <Text style={styles.subtitle}>
        Unlock high-quality audio, offline downloads, and more features
      </Text>
      <View style={styles.buttons}>
        <Button title="Start Free Trial" variant="primary" />
        <Button title="View Plans" variant="secondary" />
        <Button title="Continue with Free" variant="ghost" />
      </View>
    </SafeAreaView>
  );
};
