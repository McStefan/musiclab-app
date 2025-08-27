import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LibraryStackParamList } from '../../types';

// Screens
import { LibraryScreen } from '../screens/Library/LibraryScreen';
import { LikedTracksScreen } from '../screens/Library/LikedTracksScreen';
import { LikedPlaylistsScreen } from '../screens/Library/LikedPlaylistsScreen';
import { LikedVisualsScreen } from '../screens/Library/LikedVisualsScreen';
import { DownloadsScreen } from '../screens/Library/DownloadsScreen';

const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();

export const LibraryNavigator = () => {
  return (
    <LibraryStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
      initialRouteName="LibraryScreen"
    >
      <LibraryStack.Screen 
        name="LibraryScreen" 
        component={LibraryScreen} 
      />
      
      <LibraryStack.Screen 
        name="LikedTracks" 
        component={LikedTracksScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <LibraryStack.Screen 
        name="LikedPlaylists" 
        component={LikedPlaylistsScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <LibraryStack.Screen 
        name="LikedVisuals" 
        component={LikedVisualsScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <LibraryStack.Screen 
        name="Downloads" 
        component={DownloadsScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
    </LibraryStack.Navigator>
  );
};
