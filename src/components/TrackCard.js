import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';

// Horizontal track card (for lists)
export const TrackListItem = ({ 
  track, 
  index, 
  onPress, 
  onOptionsPress,
  isPlaying = false,
  showIndex = true,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.listItem, isPlaying && styles.listItemPlaying]} 
      onPress={() => onPress?.(track)}
      activeOpacity={0.7}
    >
      {showIndex && (
        <View style={styles.indexContainer}>
          {isPlaying ? (
            <Ionicons name="musical-notes" size={16} color={COLORS.primary} />
          ) : (
            <Text style={styles.indexText}>{index + 1}</Text>
          )}
        </View>
      )}
      
      <Image
        source={{ uri: track.thumbnail }}
        style={styles.listThumbnail}
      />
      
      <View style={styles.listInfo}>
        <Text 
          style={[styles.listTitle, isPlaying && styles.playingText]} 
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <View style={styles.listMeta}>
          {track.explicit && (
            <View style={styles.explicitBadge}>
              <Text style={styles.explicitText}>E</Text>
            </View>
          )}
          <Text style={styles.listArtist} numberOfLines={1}>
            {track.channel}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.optionsButton}
        onPress={() => onOptionsPress?.(track)}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Vertical card (for grids/featured)
export const TrackCard = ({ 
  track, 
  onPress, 
  size = 'medium',
  showPlayButton = true,
}) => {
  const cardSize = size === 'large' ? 180 : size === 'small' ? 120 : 150;
  
  return (
    <TouchableOpacity 
      style={[styles.card, { width: cardSize }]} 
      onPress={() => onPress?.(track)}
      activeOpacity={0.8}
    >
      <View style={[styles.cardImageContainer, { width: cardSize, height: cardSize }]}>
        <Image
          source={{ uri: track.thumbnail }}
          style={styles.cardImage}
        />
        {showPlayButton && (
          <View style={styles.playButtonOverlay}>
            <View style={styles.cardPlayButton}>
              <Ionicons name="play" size={24} color={COLORS.background} />
            </View>
          </View>
        )}
        {track.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{track.duration}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.cardTitle} numberOfLines={2}>
        {track.title}
      </Text>
      <Text style={styles.cardArtist} numberOfLines={1}>
        {track.channel}
      </Text>
    </TouchableOpacity>
  );
};

// Featured large card with gradient
export const FeaturedCard = ({ track, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.featuredCard} 
      onPress={() => onPress?.(track)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: track.thumbnail }}
        style={styles.featuredImage}
      />
      <View style={styles.featuredOverlay}>
        <View style={styles.featuredContent}>
          <Text style={styles.featuredLabel}>TRENDING NOW</Text>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {track.title}
          </Text>
          <Text style={styles.featuredArtist}>{track.channel}</Text>
        </View>
        <TouchableOpacity style={styles.featuredPlayButton}>
          <Ionicons name="play" size={28} color={COLORS.background} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // List Item Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: SIZES.padding,
  },
  listItemPlaying: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  indexContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
  },
  listThumbnail: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius.xs,
    backgroundColor: COLORS.surface,
  },
  listInfo: {
    flex: 1,
    marginLeft: 12,
  },
  listTitle: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  playingText: {
    color: COLORS.primary,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  explicitBadge: {
    backgroundColor: COLORS.textSecondary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginRight: 6,
  },
  explicitText: {
    color: COLORS.background,
    fontSize: 8,
    fontWeight: 'bold',
  },
  listArtist: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  optionsButton: {
    padding: 8,
  },

  // Card Styles
  card: {
    marginRight: 16,
  },
  cardImageContainer: {
    borderRadius: SIZES.radius.sm,
    overflow: 'hidden',
    marginBottom: 8,
    ...SHADOWS.small,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
  },
  playButtonOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    opacity: 0,
  },
  cardPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: SIZES.radius.xs,
  },
  durationText: {
    color: COLORS.text,
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '600',
    lineHeight: 20,
  },
  cardArtist: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: 4,
  },

  // Featured Card Styles
  featuredCard: {
    height: 200,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
    marginHorizontal: SIZES.padding,
    marginBottom: 24,
    ...SHADOWS.large,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 20,
  },
  featuredContent: {
    flex: 1,
    marginRight: 16,
  },
  featuredLabel: {
    color: COLORS.primary,
    fontSize: SIZES.xs,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  featuredTitle: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  featuredArtist: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    marginTop: 4,
  },
  featuredPlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
});

export default TrackCard;
