import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '../constants';

const MiniPlayer = ({ 
  track, 
  isPlaying, 
  onPlayPause, 
  onPress,
  progress = 0.3,
}) => {
  if (!track) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      
      <View style={styles.content}>
        <Image
          source={{ uri: track.thumbnail }}
          style={styles.thumbnail}
        />
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {track.channel}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="heart-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playButton}
            onPress={onPlayPause}
          >
            <Ionicons 
              name={isPlaying ? 'pause' : 'play'} 
              size={24} 
              color={COLORS.text} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 65,
    left: 8,
    right: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: SIZES.radius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius.xs,
    backgroundColor: COLORS.surface,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MiniPlayer;
