import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../../types';

// Screens
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { ProfileScreen } from '../screens/Settings/ProfileScreen';
import { SubscriptionScreen } from '../screens/Settings/SubscriptionScreen';
import { AudioQualityScreen } from '../screens/Settings/AudioQualityScreen';
import { OfflineSettingsScreen } from '../screens/Settings/OfflineSettingsScreen';
import { FamilySharingScreen } from '../screens/Settings/FamilySharingScreen';
import { AboutScreen } from '../screens/Settings/AboutScreen';

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsNavigator = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
      initialRouteName="SettingsScreen"
    >
      <SettingsStack.Screen 
        name="SettingsScreen" 
        component={SettingsScreen} 
      />
      
      <SettingsStack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <SettingsStack.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <SettingsStack.Screen 
        name="AudioQuality" 
        component={AudioQualityScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <SettingsStack.Screen 
        name="OfflineSettings" 
        component={OfflineSettingsScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <SettingsStack.Screen 
        name="FamilySharing" 
        component={FamilySharingScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <SettingsStack.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
    </SettingsStack.Navigator>
  );
};
