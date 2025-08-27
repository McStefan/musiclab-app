import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '../../types';

// Screens
import { SearchScreen } from '../screens/Search/SearchScreen';
import { SearchResultsScreen } from '../screens/Search/SearchResultsScreen';

const SearchStack = createNativeStackNavigator<SearchStackParamList>();

export const SearchNavigator = () => {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
      initialRouteName="SearchScreen"
    >
      <SearchStack.Screen 
        name="SearchScreen" 
        component={SearchScreen} 
      />
      
      <SearchStack.Screen 
        name="SearchResults" 
        component={SearchResultsScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
    </SearchStack.Navigator>
  );
};
