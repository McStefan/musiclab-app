import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Error Handling
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { globalErrorHandler } from './src/utils/errorHandler';

// Theme
import { ThemeProvider } from './src/theme/ThemeProvider';

// Navigation
import { AppNavigator } from './src/app/navigation/AppNavigator';

// Styles
import './src/theme/styles';

export default function App() {
  useEffect(() => {
    // Initialize global error handling
    globalErrorHandler.initialize();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <StatusBar style="light" backgroundColor="transparent" translucent />
            <AppNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
