import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import Button from './Button';

const EmptyState = ({ 
  icon = 'folder-open-outline',
  title = 'No items found',
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={64} color={COLORS.textSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="small"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  iconContainer: {
    marginBottom: 16,
    opacity: 0.6,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 20,
  },
});

export default EmptyState;
