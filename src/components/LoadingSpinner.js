import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'large',
  color = COLORS.primary,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const iconSize = size === 'large' ? 48 : size === 'medium' ? 32 : 24;

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons name="sync" size={iconSize} color={color} />
      </Animated.View>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

// Dots Loading Animation
export const DotsLoader = ({ color = COLORS.primary }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = animate(dot1, 0);
    const animation2 = animate(dot2, 150);
    const animation3 = animate(dot3, 300);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, []);

  const getScale = (animatedValue) => ({
    transform: [{
      scale: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.4],
      }),
    }],
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  });

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { backgroundColor: color }, getScale(dot1)]} />
      <Animated.View style={[styles.dot, { backgroundColor: color }, getScale(dot2)]} />
      <Animated.View style={[styles.dot, { backgroundColor: color }, getScale(dot3)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
    minHeight: 200,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    marginTop: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default LoadingSpinner;
