import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { COLORS, SIZES } from '../../constants';
import { DownloadItem, EmptyState, LoadingSpinner } from '../../components';
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
  const [sound, setSound] = useState(null);
  const [activeTab, setActiveTab] = useState('completed');

  const handlePlay = async (item) => {
    try {
      // Stop current playback
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      if (playingId === item.id) {
        setPlayingId(null);
        return;
      }

      // For demo purposes, we'll show an alert since actual files aren't downloaded
      Alert.alert(
        'Now Playing',
        `Playing: ${item.title}\n\nNote: In a production app with a backend server, this would play the actual downloaded MP3 file.`,
        [{ text: 'OK' }]
      );
      
      setPlayingId(item.id);
      
      // Simulate playback duration
      setTimeout(() => {
        setPlayingId(null);
      }, 3000);

    } catch (error) {
      console.error('Playback error:', error);
      Alert.alert('Playback Error', 'Unable to play this file.');
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Download',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (playingId === item.id && sound) {
              await sound.unloadAsync();
              setSound(null);
              setPlayingId(null);
            }
            
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
      'Are you sure you want to delete all downloaded files?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            if (sound) {
              await sound.unloadAsync();
              setSound(null);
              setPlayingId(null);
            }
            await clearAllDownloads();
          },
        },
      ]
    );
  };

  const tabs = [
    { id: 'completed', label: 'Downloaded', count: downloads.length },
    { id: 'queue', label: 'Queue', count: downloadQueue.length },
  ];

  const currentData = activeTab === 'completed' ? downloads : downloadQueue;

  const renderEmpty = () => (
    <EmptyState
      icon={activeTab === 'completed' ? 'download-outline' : 'list-outline'}
      title={activeTab === 'completed' ? 'No Downloads Yet' : 'Queue Empty'}
      message={
        activeTab === 'completed'
          ? 'Search for videos and download them to listen offline'
          : 'Videos waiting to be downloaded will appear here'
      }
      actionLabel={activeTab === 'completed' ? 'Search Videos' : undefined}
      onAction={activeTab === 'completed' ? () => navigation.navigate('Search') : undefined}
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Downloads</Text>
          <Text style={styles.subtitle}>
            {downloads.length} {downloads.length === 1 ? 'file' : 'files'} downloaded
          </Text>
        </View>
        
        {downloads.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View style={[styles.badge, activeTab === tab.id && styles.activeBadge]}>
                <Text style={styles.badgeText}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DownloadItem
            item={item}
            onPlay={handlePlay}
            onDelete={handleDelete}
            isPlaying={playingId === item.id}
          />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SIZES.padding,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: 2,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  clearText: {
    color: COLORS.error,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    gap: 6,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    color: COLORS.text,
    fontSize: SIZES.xs,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
    flexGrow: 1,
  },
});

export default DownloadsScreen;
