import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const SectionHeader = ({ 
  title, 
  subtitle,
  onSeeAll,
  showSeeAll = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {showSeeAll && onSeeAll && (
        <TouchableOpacity 
          style={styles.seeAllButton} 
          onPress={onSeeAll}
        >
          <Text style={styles.seeAllText}>See all</Text>
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={COLORS.textSecondary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
    marginTop: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xl,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  seeAllText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
});

export default SectionHeader;
