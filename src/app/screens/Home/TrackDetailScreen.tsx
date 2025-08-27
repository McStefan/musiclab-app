import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containers, textStyles } from '../../../theme/styles';
import { useTheme } from '../../../theme/ThemeProvider';

export const TrackDetailScreen = () => {
  const { spacing } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      ...containers.screen,
      padding: spacing[4],
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      ...textStyles.h2,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Track Detail</Text>
      <Text>Coming Soon</Text>
    </SafeAreaView>
  );
};
