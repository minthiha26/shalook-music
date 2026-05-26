import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, DownloadProvider } from './src/context';
import { AppNavigator } from './src/navigation';
import { COLORS } from './src/constants';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaProvider>
        <AuthProvider>
          <DownloadProvider>
            <StatusBar style="light" backgroundColor={COLORS.background} />
            <AppNavigator />
          </DownloadProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
