import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const VideoCard = ({ video, onPress, onDownload, showDownloadButton = true }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(video)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {video.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {video.title}
          </Text>
          <Text style={styles.channel} numberOfLines={1}>
            {video.channel}
          </Text>
          {video.views && (
            <Text style={styles.views}>{video.views}</Text>
          )}
        </View>

        {showDownloadButton && (
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => onDownload?.(video)}
          >
            <Ionicons name="download-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: COLORS.text,
    fontSize: SIZES.xs,
    fontWeight: '500',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  channel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginBottom: 2,
  },
  views: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
  },
  downloadButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default VideoCard;
