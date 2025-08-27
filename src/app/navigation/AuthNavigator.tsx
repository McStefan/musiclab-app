import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

// Screens
import { WelcomeScreen } from '../screens/Auth/WelcomeScreen';
import { SignInScreen } from '../screens/Auth/SignInScreen';
import { LogInScreen } from '../screens/Auth/LogInScreen';
import { ForgotPasswordScreen } from '../screens/Auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/Auth/ResetPasswordScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
      initialRouteName="Welcome"
    >
      <AuthStack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
      />
      
      <AuthStack.Screen 
        name="SignIn" 
        component={SignInScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <AuthStack.Screen 
        name="LogIn" 
        component={LogInScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <AuthStack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
    </AuthStack.Navigator>
  );
};
