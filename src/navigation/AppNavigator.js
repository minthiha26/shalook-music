import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { LoadingSpinner } from '../components';
import { COLORS } from '../constants';

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: COLORS.primary,
          background: COLORS.background,
          card: COLORS.surface,
          text: COLORS.text,
          border: COLORS.border,
          notification: COLORS.primary,
        },
      }}
    >
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
