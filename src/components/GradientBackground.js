import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';

const GradientBackground = ({ 
  children, 
  colors = ['#1a1a1a', '#121212'],
  style,
  ...props 
}) => {
  return (
    <LinearGradient
      colors={colors}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.6 }}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;
