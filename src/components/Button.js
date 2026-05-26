import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../constants';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost, gradient
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const base = [styles.button, styles[size]];
    
    if (fullWidth) base.push(styles.fullWidth);
    if (disabled) base.push(styles.disabled);

    switch (variant) {
      case 'secondary':
        base.push(styles.secondary);
        break;
      case 'outline':
        base.push(styles.outline);
        break;
      case 'ghost':
        base.push(styles.ghost);
        break;
      case 'gradient':
        // Handled separately
        break;
      default:
        base.push(styles.primary);
    }

    return base;
  };

  const getTextStyle = () => {
    const base = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'outline') base.push(styles.outlineText);
    if (variant === 'ghost') base.push(styles.ghostText);
    if (disabled) base.push(styles.disabledText);

    return base;
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.background} 
          size="small"
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={disabled ? [COLORS.surfaceLight, COLORS.surface] : [COLORS.primary, COLORS.primaryDark]}
          style={[styles.button, styles[size], styles.gradientButton]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Icon Button
export const IconButton = ({ 
  icon, 
  onPress, 
  size = 44, 
  backgroundColor = COLORS.surfaceLight,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.iconButton,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
};

// Play Button (Spotify-style)
export const PlayButton = ({ 
  isPlaying, 
  onPress, 
  size = 56,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.playButton,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.playIcon}>
        {isPlaying ? (
          <View style={styles.pauseIcon}>
            <View style={styles.pauseBar} />
            <View style={styles.pauseBar} />
          </View>
        ) : (
          <View style={[styles.trianglePlay, { 
            borderLeftWidth: size * 0.35,
            borderTopWidth: size * 0.2,
            borderBottomWidth: size * 0.2,
          }]} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius.full,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  fullWidth: {
    width: '100%',
  },

  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 40,
  },

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.surfaceLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  gradientButton: {
    ...SHADOWS.medium,
  },
  disabled: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    color: COLORS.background,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  smallText: {
    fontSize: SIZES.sm,
  },
  mediumText: {
    fontSize: SIZES.md,
  },
  largeText: {
    fontSize: SIZES.lg,
  },
  outlineText: {
    color: COLORS.text,
  },
  ghostText: {
    color: COLORS.text,
  },
  disabledText: {
    color: COLORS.textMuted,
  },

  // Icon Button
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Play Button
  playButton: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  playIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  trianglePlay: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: COLORS.background,
    marginLeft: 4,
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 4,
  },
  pauseBar: {
    width: 4,
    height: 16,
    backgroundColor: COLORS.background,
    borderRadius: 2,
  },
});

export default Button;
