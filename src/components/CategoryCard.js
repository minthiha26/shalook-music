import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../constants';

const CATEGORY_COLORS = {
  'Pop': ['#8B5CF6', '#7C3AED'],
  'Hip Hop': ['#F59E0B', '#D97706'],
  'Rock': ['#EF4444', '#DC2626'],
  'Electronic': ['#10B981', '#059669'],
  'R&B': ['#EC4899', '#DB2777'],
  'Jazz': ['#6366F1', '#4F46E5'],
  'Classical': ['#8B5CF6', '#6D28D9'],
  'Country': ['#F97316', '#EA580C'],
  'Latin': ['#14B8A6', '#0D9488'],
  'Indie': ['#84CC16', '#65A30D'],
  'Metal': ['#374151', '#1F2937'],
  'Chill': ['#06B6D4', '#0891B2'],
  'Workout': ['#F43F5E', '#E11D48'],
  'Focus': ['#3B82F6', '#2563EB'],
  'Party': ['#A855F7', '#9333EA'],
  'Sleep': ['#1E3A5F', '#0F172A'],
};

const CategoryCard = ({ 
  category, 
  onPress, 
  size = 'medium',
  image,
}) => {
  const colors = CATEGORY_COLORS[category] || ['#1DB954', '#191414'];
  const cardWidth = size === 'large' ? '100%' : size === 'small' ? 100 : 170;
  const cardHeight = size === 'large' ? 120 : size === 'small' ? 100 : 100;

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { width: cardWidth, height: cardHeight },
        size === 'large' && styles.largeContainer,
      ]} 
      onPress={() => onPress?.(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {image && (
          <ImageBackground
            source={{ uri: image }}
            style={styles.imageBackground}
            imageStyle={styles.image}
          />
        )}
        <Text style={[styles.title, size === 'small' && styles.smallTitle]}>
          {category}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Quick access category row
export const QuickCategory = ({ category, onPress, icon }) => {
  return (
    <TouchableOpacity 
      style={styles.quickContainer} 
      onPress={() => onPress?.(category)}
      activeOpacity={0.7}
    >
      <View style={styles.quickIcon}>
        {icon}
      </View>
      <Text style={styles.quickTitle} numberOfLines={1}>
        {category}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius.sm,
    overflow: 'hidden',
    marginRight: 12,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  largeContainer: {
    marginRight: 0,
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    right: -20,
    width: 80,
    height: 80,
    transform: [{ rotate: '25deg' }],
  },
  image: {
    borderRadius: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  smallTitle: {
    fontSize: SIZES.md,
  },

  // Quick category styles
  quickContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: SIZES.radius.xs,
    overflow: 'hidden',
    marginRight: 8,
    marginBottom: 8,
    flex: 1,
    minWidth: '45%',
  },
  quickIcon: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  quickTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: 12,
  },
});

export default CategoryCard;
