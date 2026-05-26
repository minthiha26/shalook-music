import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const base = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        base.push(styles.primary);
        break;
      case 'secondary':
        base.push(styles.secondary);
        break;
      case 'outline':
        base.push(styles.outline);
        break;
      case 'ghost':
        base.push(styles.ghost);
        break;
      default:
        base.push(styles.primary);
    }

    if (disabled) {
      base.push(styles.disabled);
    }

    return base;
  };

  const getTextStyle = () => {
    const base = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'outline' || variant === 'ghost') {
      base.push(styles.outlineText);
    }

    if (disabled) {
      base.push(styles.disabledText);
    }

    return base;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.text} />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    gap: 8,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: COLORS.text,
    fontWeight: '600',
  },
  smallText: {
    fontSize: SIZES.sm,
  },
  mediumText: {
    fontSize: SIZES.lg,
  },
  largeText: {
    fontSize: SIZES.xl,
  },
  outlineText: {
    color: COLORS.primary,
  },
  disabledText: {
    color: COLORS.textSecondary,
  },
});

export default Button;
