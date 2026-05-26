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
        <Ionicons name={icon} size={64} color={COLORS.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="medium"
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
    minHeight: 300,
  },
  iconContainer: {
    marginBottom: 20,
    opacity: 0.5,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  button: {
    marginTop: 24,
  },
});

export default EmptyState;
