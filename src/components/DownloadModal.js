import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import Button from './Button';

const DownloadModal = ({ 
  visible, 
  video, 
  onClose, 
  onDownload,
  isDownloading = false,
}) => {
  const [selectedFormat, setSelectedFormat] = useState('mp3');

  const formats = [
    { id: 'mp3', label: 'MP3', description: 'Audio only (smaller file)', icon: 'musical-note' },
    { id: 'mp4', label: 'MP4', description: 'Video + Audio', icon: 'videocam' },
  ];

  const handleDownload = () => {
    onDownload?.(video, selectedFormat);
  };

  if (!video) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.handle} />
              
              <Text style={styles.title}>Download</Text>

              <View style={styles.videoInfo}>
                <Image
                  source={{ uri: video.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.videoDetails}>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <Text style={styles.channel}>{video.channel}</Text>
                  {video.duration && (
                    <Text style={styles.duration}>{video.duration}</Text>
                  )}
                </View>
              </View>

              <Text style={styles.sectionTitle}>Select Format</Text>
              
              <View style={styles.formatOptions}>
                {formats.map((format) => (
                  <TouchableOpacity
                    key={format.id}
                    style={[
                      styles.formatOption,
                      selectedFormat === format.id && styles.formatOptionSelected,
                    ]}
                    onPress={() => setSelectedFormat(format.id)}
                  >
                    <Ionicons
                      name={format.icon}
                      size={24}
                      color={selectedFormat === format.id ? COLORS.primary : COLORS.textSecondary}
                    />
                    <View style={styles.formatInfo}>
                      <Text
                        style={[
                          styles.formatLabel,
                          selectedFormat === format.id && styles.formatLabelSelected,
                        ]}
                      >
                        {format.label}
                      </Text>
                      <Text style={styles.formatDescription}>{format.description}</Text>
                    </View>
                    {selectedFormat === format.id && (
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.actions}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={onClose}
                  style={styles.cancelButton}
                />
                <Button
                  title="Download"
                  onPress={handleDownload}
                  loading={isDownloading}
                  icon={<Ionicons name="download" size={20} color={COLORS.text} />}
                  style={styles.downloadButton}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
    borderTopLeftRadius: SIZES.radiusLg,
    borderTopRightRadius: SIZES.radiusLg,
    padding: SIZES.padding,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  videoInfo: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 20,
  },
  thumbnail: {
    width: 100,
    height: 70,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  videoDetails: {
    flex: 1,
    marginLeft: 12,
  },
  videoTitle: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  channel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginBottom: 2,
  },
  duration: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: '600',
    marginBottom: 12,
  },
  formatOptions: {
    gap: 10,
    marginBottom: 24,
  },
  formatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  formatOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
  },
  formatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  formatLabel: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  formatLabelSelected: {
    color: COLORS.primary,
  },
  formatDescription: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  downloadButton: {
    flex: 2,
  },
});

export default DownloadModal;
