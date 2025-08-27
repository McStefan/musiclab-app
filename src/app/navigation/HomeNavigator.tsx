import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../types';

// Screens
import { HomeScreen } from '../screens/Home/HomeScreen';
import { PlaylistDetailScreen } from '../screens/Home/PlaylistDetailScreen';
import { TrackDetailScreen } from '../screens/Home/TrackDetailScreen';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
      initialRouteName="HomeScreen"
    >
      <HomeStack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
      />
      
      <HomeStack.Screen 
        name="PlaylistDetail" 
        component={PlaylistDetailScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <HomeStack.Screen 
        name="TrackDetail" 
        component={TrackDetailScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
    </HomeStack.Navigator>
  );
};
