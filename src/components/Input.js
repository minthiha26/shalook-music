import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  icon,
  rightIcon,
  onRightIconPress,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  variant = 'default', // default, rounded, underlined
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getContainerStyle = () => {
    const base = [styles.inputContainer];
    
    if (variant === 'rounded') base.push(styles.rounded);
    if (variant === 'underlined') base.push(styles.underlined);
    if (isFocused) base.push(styles.focused);
    if (error) base.push(styles.error);
    if (!editable) base.push(styles.disabled);

    return base;
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={getContainerStyle()}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.multiline,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={COLORS.primary}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// Search Input (Spotify-style)
export const SearchInput = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'What do you want to listen to?',
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[searchStyles.container, isFocused && searchStyles.focused]}>
      <Ionicons 
        name="search" 
        size={24} 
        color={COLORS.background} 
        style={searchStyles.icon}
      />
      
      <TextInput
        style={searchStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        returnKeyType="search"
        autoFocus={autoFocus}
        onSubmitEditing={() => onSubmit?.(value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={COLORS.primary}
      />

      {value?.length > 0 && (
        <TouchableOpacity 
          style={searchStyles.clearButton} 
          onPress={() => {
            onChangeText?.('');
            onClear?.();
          }}
        >
          <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.text,
    fontSize: SIZES.sm,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: SIZES.radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  rounded: {
    borderRadius: SIZES.radius.full,
  },
  underlined: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 0,
  },
  focused: {
    borderColor: COLORS.primary,
  },
  error: {
    borderColor: COLORS.error,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: COLORS.surface,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.base,
    paddingVertical: 14,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.sm,
  },
});

const searchStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text,
    borderRadius: SIZES.radius.sm,
    paddingHorizontal: 12,
    marginHorizontal: SIZES.padding,
    marginVertical: 12,
    height: 48,
  },
  focused: {
    // Add focus state if needed
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.background,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
});

export default Input;
