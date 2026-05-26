import React, { useEffect } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, DownloadProvider } from './src/context';
import { AppNavigator } from './src/navigation';
import { COLORS } from './src/constants';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AuthProvider>
          <DownloadProvider>
            <StatusBar 
              barStyle="light-content" 
              backgroundColor="transparent"
              translucent 
            />
            <AppNavigator />
          </DownloadProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
