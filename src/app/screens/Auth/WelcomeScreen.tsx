import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../types';

import { Button } from '../../../ui';
import { useTheme } from '../../../theme/ThemeProvider';
import { layouts, textStyles, containers } from '../../../theme/styles';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      ...containers.screen,
      ...layouts.center,
      padding: spacing[4],
    },
    
    content: {
      alignItems: 'center',
      gap: spacing[8],
      maxWidth: 320,
    },
    
    logo: {
      alignItems: 'center',
      gap: spacing[4],
    },
    
    title: {
      ...textStyles.h1,
      textAlign: 'center',
    },
    
    subtitle: {
      ...textStyles.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    
    buttons: {
      width: '100%',
      gap: spacing[4],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logo}>
          <Text style={styles.title}>Music Lab</Text>
          <Text style={styles.subtitle}>
            Discover chill music without distractions
          </Text>
        </View>
        
        <View style={styles.buttons}>
          <Button
            title="Get Started"
            variant="primary"
            onPress={() => navigation.navigate('SignIn')}
          />
          
          <Button
            title="I already have an account"
            variant="ghost"
            onPress={() => navigation.navigate('LogIn')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
