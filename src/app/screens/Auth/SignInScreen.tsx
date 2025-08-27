import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../types';
import { useAuthStore } from '../../../modules/auth/store/authStore';

import { Button } from '../../../ui';
import { useTheme } from '../../../theme/ThemeProvider';
import { layouts, textStyles, containers } from '../../../theme/styles';
import { StatusBar } from '../../../ui';

type SignInScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const { colors, spacing, borderRadius } = useTheme();

  const styles = StyleSheet.create({
    container: {
      ...containers.screen,
    },
    
    content: {
      flex: 1,
      justifyContent: 'space-between',
      padding: spacing[4],
      paddingTop: spacing[20],
    },
    
    header: {
      alignItems: 'center',
      gap: spacing[8],
    },
    
    logo: {
      alignItems: 'center',
      gap: spacing[2],
    },
    
    title: {
      ...textStyles.h1,
    },
    
    subtitle: {
      ...textStyles.h2,
      textAlign: 'center',
    },
    
    buttons: {
      gap: spacing[4],
    },
    
    oauthButtons: {
      gap: spacing[4],
    },
    
    oauthButton: {
      backgroundColor: colors.background.card,
      borderWidth: 0.5,
      borderColor: colors.border.white,
      ...createShadow('sm'),
    },
    
    divider: {
      alignItems: 'center',
      marginVertical: spacing[4],
    },
    
    dividerText: {
      ...textStyles.body,
      color: colors.text.secondary,
    },
    
    footer: {
      alignItems: 'center',
      gap: spacing[10],
      paddingBottom: spacing[10],
    },
    
    footerText: {
      ...textStyles.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    
    link: {
      color: colors.white,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.title}>Music Lab</Text>
          </View>
          
          <Text style={styles.subtitle}>Sign In</Text>
          
          <View style={styles.buttons}>
            <View style={styles.oauthButtons}>
              <Button
                title="Sign in with Apple"
                variant="secondary"
                style={styles.oauthButton}
                onPress={async () => {
                  try {
                    await useAuthStore.getState().signInWithApple();
                  } catch (error) {
                    console.error('Apple OAuth failed:', error);
                  }
                }}
              />
              
              <Button
                title="Sign in with Google"
                variant="secondary"
                style={styles.oauthButton}
                onPress={async () => {
                  try {
                    await useAuthStore.getState().signInWithGoogle();
                  } catch (error) {
                    console.error('Google OAuth failed:', error);
                  }
                }}
              />
            </View>
            
            <View style={styles.divider}>
              <Text style={styles.dividerText}>or</Text>
            </View>
            
            <Button
              title="Sign In with Email"
              variant="outline"
              onPress={() => navigation.navigate('LogIn')}
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text 
              style={styles.link}
              onPress={() => navigation.navigate('LogIn')}
            >
              Log In →
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper function for shadows (would normally be in utils)
const createShadow = (type: string) => ({
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.16,
  shadowRadius: 3,
  elevation: 3,
});
