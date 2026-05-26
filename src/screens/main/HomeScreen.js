import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import { VideoCard, SearchBar, DownloadModal, LoadingSpinner, EmptyState } from '../../components';
import { youtubeService } from '../../services';
import { useAuth, useDownloads } from '../../context';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { addToQueue, startDownload } = useDownloads();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadTrendingVideos();
  }, []);

  const loadTrendingVideos = async () => {
    try {
      const trendingVideos = await youtubeService.getTrendingVideos(10);
      setVideos(trendingVideos);
    } catch (error) {
      console.error('Error loading trending videos:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadTrendingVideos();
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await youtubeService.searchVideos(query);
      setVideos(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      loadTrendingVideos();
    }
  };

  const handleVideoPress = (video) => {
    // Could navigate to video details
    setSelectedVideo(video);
    setShowDownloadModal(true);
  };

  const handleDownloadPress = (video) => {
    setSelectedVideo(video);
    setShowDownloadModal(true);
  };

  const handleDownload = async (video, format) => {
    setIsDownloading(true);
    
    const downloadItem = addToQueue(video, format);
    setShowDownloadModal(false);
    setSelectedVideo(null);
    
    // Start the download
    await startDownload(downloadItem);
    
    setIsDownloading(false);
    
    // Navigate to downloads tab
    navigation.navigate('Downloads');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadTrendingVideos();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}!</Text>
      <Text style={styles.subtitle}>
        {searchQuery ? `Results for "${searchQuery}"` : 'Trending Music'}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <EmptyState
      icon="search-outline"
      title="No videos found"
      message="Try searching with different keywords"
    />
  );

  if (isLoading && videos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search YouTube videos..."
        />
        <LoadingSpinner message="Loading videos..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search YouTube videos..."
      />

      <FlatList
        data={videos}
        keyExtractor={(item) => item.videoId}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onPress={handleVideoPress}
            onDownload={handleDownloadPress}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      />

      <DownloadModal
        visible={showDownloadModal}
        video={selectedVideo}
        onClose={() => {
          setShowDownloadModal(false);
          setSelectedVideo(null);
        }}
        onDownload={handleDownload}
        isDownloading={isDownloading}
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
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  greeting: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
    flexGrow: 1,
  },
});

export default HomeScreen;
