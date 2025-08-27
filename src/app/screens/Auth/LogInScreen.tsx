import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../types';

import { Button, Input } from '../../../ui';
import { useTheme } from '../../../theme/ThemeProvider';
import { layouts, textStyles, containers } from '../../../theme/styles';
import { StatusBar } from '../../../ui';

type LogInScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'LogIn'>;

export const LogInScreen = () => {
  const navigation = useNavigation<LogInScreenNavigationProp>();
  const { colors, spacing } = useTheme();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      gap: spacing[8],
    },
    
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing[8],
    },
    
    backButton: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    title: {
      ...textStyles.h2,
      textAlign: 'center',
    },
    
    placeholder: {
      width: 20,
      height: 20,
    },
    
    form: {
      gap: spacing[6],
    },
    
    formInputs: {
      gap: spacing[4],
    },
    
    forgotPassword: {
      alignSelf: 'center',
    },
    
    forgotPasswordText: {
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

  const handleLogIn = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement email login
      console.log('Logging in with email:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to app or show error
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.topBar}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ color: colors.white, fontSize: 20 }}>←</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>Log In</Text>
            
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.form}>
            <View style={styles.formInputs}>
              <Input
                placeholder="example@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>
            
            <Button
              title="Log In"
              variant="primary"
              onPress={handleLogIn}
              loading={isLoading}
              disabled={!email.trim()}
            />
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text 
              style={styles.link}
              onPress={() => navigation.navigate('SignIn')}
            >
              Sign In →
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
