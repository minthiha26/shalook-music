import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const SearchBar = ({ 
  value, 
  onChangeText, 
  onSubmit, 
  onClear,
  placeholder = 'Search videos...',
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  return (
    <View style={[styles.container, isFocused && styles.focused]}>
      <Ionicons 
        name="search" 
        size={20} 
        color={isFocused ? COLORS.primary : COLORS.textSecondary} 
        style={styles.searchIcon}
      />
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        returnKeyType="search"
        autoFocus={autoFocus}
        onSubmitEditing={() => onSubmit?.(value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {value?.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={handleClear}
        >
          <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={() => onSubmit?.(value)}
      >
        <Ionicons name="arrow-forward-circle" size={28} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    marginHorizontal: SIZES.padding,
    marginVertical: 12,
  },
  focused: {
    borderColor: COLORS.primary,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.lg,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  submitButton: {
    padding: 4,
    marginLeft: 4,
  },
});

export default SearchBar;
