import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  ScrollView,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES, SHADOWS } from '../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BottomSheet = ({
  visible,
  onClose,
  children,
  title,
  snapPoints = [0.5], // Percentage of screen height
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const maxHeight = SCREEN_HEIGHT * snapPoints[snapPoints.length - 1];

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          onClose?.();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.container,
                {
                  maxHeight,
                  transform: [{ translateY }],
                },
              ]}
            >
              <View {...panResponder.panHandlers} style={styles.handleContainer}>
                <View style={styles.handle} />
                {title && <Text style={styles.title}>{title}</Text>}
              </View>
              
              <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Download Options Sheet
export const DownloadSheet = ({ visible, video, onClose, onDownload }) => {
  const downloadOptions = [
    { id: 'mp3_high', label: 'High Quality MP3', quality: '320kbps', icon: 'musical-notes', format: 'mp3' },
    { id: 'mp3_normal', label: 'Normal Quality MP3', quality: '128kbps', icon: 'musical-note', format: 'mp3' },
    { id: 'mp4_high', label: 'HD Video', quality: '1080p', icon: 'videocam', format: 'mp4' },
    { id: 'mp4_normal', label: 'Standard Video', quality: '720p', icon: 'film', format: 'mp4' },
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {video && (
        <>
          <View style={sheetStyles.header}>
            <Image source={{ uri: video.thumbnail }} style={sheetStyles.thumbnail} />
            <View style={sheetStyles.headerInfo}>
              <Text style={sheetStyles.videoTitle} numberOfLines={2}>{video.title}</Text>
              <Text style={sheetStyles.videoChannel}>{video.channel}</Text>
            </View>
          </View>

          <View style={sheetStyles.divider} />

          <Text style={sheetStyles.sectionTitle}>Select Quality</Text>

          {downloadOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={sheetStyles.optionItem}
              onPress={() => onDownload?.(video, option)}
            >
              <View style={sheetStyles.optionIcon}>
                <Ionicons name={option.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={sheetStyles.optionInfo}>
                <Text style={sheetStyles.optionLabel}>{option.label}</Text>
                <Text style={sheetStyles.optionQuality}>{option.quality}</Text>
              </View>
              <Ionicons name="download-outline" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </>
      )}
    </BottomSheet>
  );
};

// Track Options Sheet
export const TrackOptionsSheet = ({ visible, track, onClose, onAction }) => {
  const options = [
    { id: 'like', label: 'Like', icon: 'heart-outline' },
    { id: 'add_playlist', label: 'Add to playlist', icon: 'add' },
    { id: 'download', label: 'Download', icon: 'download-outline' },
    { id: 'share', label: 'Share', icon: 'share-outline' },
    { id: 'artist', label: 'View artist', icon: 'person-outline' },
    { id: 'report', label: 'Report', icon: 'flag-outline' },
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {track && (
        <>
          <View style={sheetStyles.header}>
            <Image source={{ uri: track.thumbnail }} style={sheetStyles.thumbnail} />
            <View style={sheetStyles.headerInfo}>
              <Text style={sheetStyles.videoTitle} numberOfLines={2}>{track.title}</Text>
              <Text style={sheetStyles.videoChannel}>{track.channel}</Text>
            </View>
          </View>

          <View style={sheetStyles.divider} />

          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={sheetStyles.optionItem}
              onPress={() => {
                onAction?.(option.id, track);
                if (option.id !== 'download') onClose?.();
              }}
            >
              <View style={sheetStyles.optionIcon}>
                <Ionicons name={option.icon} size={24} color={COLORS.text} />
              </View>
              <Text style={sheetStyles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radius.xl,
    borderTopRightRadius: SIZES.radius.xl,
    paddingBottom: 34,
  },
  handleContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textMuted,
    borderRadius: 2,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    marginTop: 12,
  },
  content: {
    paddingHorizontal: SIZES.padding,
  },
});

const sheetStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: SIZES.radius.sm,
    backgroundColor: COLORS.surfaceLight,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  videoTitle: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '600',
    lineHeight: 20,
  },
  videoChannel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  optionQuality: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: 2,
  },
});

export default BottomSheet;
