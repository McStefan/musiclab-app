import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

// Types
import type { 
  RootStackParamList, 
  AuthStackParamList, 
  AppTabParamList 
} from '../../types';

// Screens
import { AuthNavigator } from './AuthNavigator';
import { HomeNavigator } from './HomeNavigator';
import { SearchNavigator } from './SearchNavigator';
import { LibraryNavigator } from './LibraryNavigator';
import { SettingsNavigator } from './SettingsNavigator';
import { PlayerScreen } from '../screens/Player/PlayerScreen';
import { PaywallScreen } from '../screens/Auth/PaywallScreen';

// Components
import { TabBar } from '../components/TabBar';
import { PlayerMiniBar } from '../components/PlayerMiniBar';

// Hooks & Store
import { useAuthStore } from '../../modules/auth/store/authStore';
import { usePlayerStore } from '../../modules/player/store/playerStore';

// Theme
import { useTheme } from '../../theme/ThemeProvider';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabParamList>();

const AppTabNavigator = () => {
  const { colors } = useTheme();
  const { currentTrack } = usePlayerStore();

  return (
    <>
      <AppTabs.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <AppTabs.Screen 
          name="Home" 
          component={HomeNavigator}
          options={{
            title: 'Music',
          }}
        />
        <AppTabs.Screen 
          name="Search" 
          component={SearchNavigator}
          options={{
            title: 'Search',
          }}
        />
        <AppTabs.Screen 
          name="Library" 
          component={LibraryNavigator}
          options={{
            title: 'Library',
          }}
        />
        <AppTabs.Screen 
          name="Settings" 
          component={SettingsNavigator}
          options={{
            title: 'Settings',
          }}
        />
      </AppTabs.Navigator>
      
      {/* Mini Player - shows when track is playing and not on player screen */}
      {currentTrack && <PlayerMiniBar />}
    </>
  );
};

export const AppNavigator = () => {
  const { colors } = useTheme();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.accent,
          background: colors.background.primary,
          card: colors.background.secondary,
          text: colors.text.primary,
          border: colors.border.secondary,
          notification: colors.status.error,
        },
      }}
    >
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'ios' ? 'slide_from_right' : 'slide_from_bottom',
          animationDuration: 250,
        }}
      >
        {!isAuthenticated ? (
          // Auth flow
          <RootStack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        ) : (
          <>
            {/* Main app */}
            <RootStack.Screen 
              name="App" 
              component={AppTabNavigator}
              options={{
                gestureEnabled: false,
              }}
            />
            
            {/* Modal screens */}
            <RootStack.Screen
              name="Player"
              component={PlayerScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                gestureDirection: 'vertical',
                gestureEnabled: true,
              }}
            />
            
            <RootStack.Screen
              name="Paywall"
              component={PaywallScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                gestureEnabled: false, // Prevent dismissing paywall
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
