import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const DownloadItem = ({ item, onPlay, onDelete, isPlaying = false }) => {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'completed':
        return <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />;
      case 'downloading':
        return <Ionicons name="cloud-download" size={20} color={COLORS.accent} />;
      case 'queued':
        return <Ionicons name="time" size={20} color={COLORS.warning} />;
      case 'failed':
        return <Ionicons name="alert-circle" size={20} color={COLORS.error} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'completed':
        return 'Downloaded';
      case 'downloading':
        return `Downloading ${item.progress}%`;
      case 'queued':
        return 'In Queue';
      case 'failed':
        return 'Failed';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, isPlaying && styles.playing]}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.formatBadge}>
          <Text style={styles.formatText}>{item.format.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.channel} numberOfLines={1}>
          {item.channel}
        </Text>
        
        <View style={styles.statusRow}>
          {getStatusIcon()}
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>

        {item.status === 'downloading' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
            </View>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {item.status === 'completed' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onPlay?.(item)}
          >
            <Ionicons 
              name={isPlaying ? 'pause-circle' : 'play-circle'} 
              size={32} 
              color={COLORS.primary} 
            />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete?.(item)}
        >
          <Ionicons name="trash-outline" size={22} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
  },
  playing: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 80,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
  },
  formatBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  formatText: {
    color: COLORS.text,
    fontSize: 8,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.sm,
    fontWeight: '600',
    marginBottom: 2,
  },
  channel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
  },
  progressContainer: {
    marginTop: 6,
  },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
});

export default DownloadItem;
