import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { 
  EmptyState, 
  LoadingSpinner, 
  PlayButton,
  SectionHeader,
} from '../../components';
import { useDownloads } from '../../context';

const DownloadsScreen = ({ navigation }) => {
  const { 
    downloads, 
    downloadQueue, 
    isLoading, 
    deleteDownload, 
    clearAllDownloads,
    removeFromQueue 
  } = useDownloads();
  
  const [playingId, setPlayingId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const handlePlay = (item) => {
    if (playingId === item.id) {
      setPlayingId(null);
      Alert.alert('Paused', `Stopped playing: ${item.title}`);
    } else {
      setPlayingId(item.id);
      Alert.alert(
        'Now Playing',
        `${item.title}\n\nNote: Full playback requires a backend server for actual audio files.`
      );
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Remove Download',
      `Remove "${item.title}" from your downloads?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (item.status === 'completed') {
              await deleteDownload(item.id);
            } else {
              removeFromQueue(item.id);
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (downloads.length === 0) return;
    Alert.alert(
      'Clear All Downloads',
      'This will remove all downloaded music. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearAllDownloads,
        },
      ]
    );
  };

  const getFilteredData = () => {
    const allData = [...downloadQueue, ...downloads];
    if (activeTab === 'all') return allData;
    if (activeTab === 'songs') return allData.filter(d => d.format === 'mp3');
    if (activeTab === 'videos') return allData.filter(d => d.format === 'mp4');
    return allData;
  };

  const filteredData = getFilteredData();
  const totalItems = downloads.length;
  const mp3Count = downloads.filter(d => d.format === 'mp3').length;
  const mp4Count = downloads.filter(d => d.format === 'mp4').length;

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Stats Card */}
      <LinearGradient
        colors={[COLORS.primary, '#0d7a3a']}
        style={styles.statsCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.statsContent}>
          <Ionicons name="download" size={48} color={COLORS.text} style={styles.statsIcon} />
          <View style={styles.statsInfo}>
            <Text style={styles.statsTitle}>Your Downloads</Text>
            <Text style={styles.statsCount}>{totalItems} items</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="musical-notes" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statText}>{mp3Count} songs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="videocam" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statText}>{mp4Count} videos</Text>
          </View>
        </View>

        {totalItems > 0 && (
          <View style={styles.playAllContainer}>
            <PlayButton size={48} onPress={() => {}} />
          </View>
        )}
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { id: 'all', label: 'All' },
          { id: 'songs', label: 'Songs' },
          { id: 'videos', label: 'Videos' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDownloadItem = ({ item, index }) => {
    const isPlaying = playingId === item.id;
    const isDownloading = item.status === 'downloading';
    const isQueued = item.status === 'queued';

    return (
      <TouchableOpacity 
        style={[styles.downloadItem, isPlaying && styles.playingItem]}
        onPress={() => item.status === 'completed' && handlePlay(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemThumbnail}>
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
          />
          {item.status === 'completed' && (
            <View style={styles.playOverlay}>
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'} 
                size={20} 
                color={COLORS.text} 
              />
            </View>
          )}
          {isDownloading && (
            <View style={styles.progressOverlay}>
              <Text style={styles.progressText}>{item.progress}%</Text>
            </View>
          )}
          <View style={[styles.formatBadge, item.format === 'mp4' && styles.videoBadge]}>
            <Text style={styles.formatText}>{item.format.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, isPlaying && styles.playingText]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemChannel} numberOfLines={1}>
            {item.channel}
          </Text>
          <View style={styles.itemMeta}>
            {isDownloading ? (
              <View style={styles.downloadProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                </View>
                <Text style={styles.downloadingText}>Downloading...</Text>
              </View>
            ) : isQueued ? (
              <Text style={styles.queuedText}>
                <Ionicons name="time-outline" size={12} /> In queue
              </Text>
            ) : (
              <Text style={styles.completedText}>
                <Ionicons name="checkmark-circle" size={12} color={COLORS.primary} /> Downloaded
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <EmptyState
      icon="download-outline"
      title="No downloads yet"
      message="Search for music and download your favorites to listen offline"
      actionLabel="Start Searching"
      onAction={() => navigation.navigate('Search')}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading downloads..." />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Downloads</Text>
          {downloads.length > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderDownloadItem}
        ListHeaderComponent={totalItems > 0 || downloadQueue.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          filteredData.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
  },
  clearAllText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  headerSection: {
    marginBottom: 16,
  },
  statsCard: {
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius.lg,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsIcon: {
    marginRight: 16,
    opacity: 0.9,
  },
  statsInfo: {
    flex: 1,
  },
  statsTitle: {
    color: COLORS.text,
    fontSize: SIZES.xl,
    fontWeight: 'bold',
  },
  statsCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: SIZES.md,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: SIZES.sm,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  playAllContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius.full,
    backgroundColor: COLORS.surfaceLight,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.text,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '700',
  },
  downloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },
  playingItem: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  itemThumbnail: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: SIZES.radius.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: COLORS.text,
    fontSize: SIZES.sm,
    fontWeight: 'bold',
  },
  formatBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoBadge: {
    backgroundColor: COLORS.accentBlue,
  },
  formatText: {
    color: COLORS.text,
    fontSize: 8,
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  playingText: {
    color: COLORS.primary,
  },
  itemChannel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: 2,
  },
  itemMeta: {
    marginTop: 4,
  },
  downloadProgress: {
    gap: 4,
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
  downloadingText: {
    color: COLORS.accentBlue,
    fontSize: SIZES.xs,
  },
  queuedText: {
    color: COLORS.warning,
    fontSize: SIZES.xs,
  },
  completedText: {
    color: COLORS.primary,
    fontSize: SIZES.xs,
  },
  deleteButton: {
    padding: 8,
  },
});

export default DownloadsScreen;
