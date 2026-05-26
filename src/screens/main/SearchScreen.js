import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import { VideoCard, SearchBar, DownloadModal, LoadingSpinner, EmptyState } from '../../components';
import { youtubeService } from '../../services';
import { useDownloads } from '../../context';

const RECENT_SEARCHES_KEY = '@shalook_recent_searches';

const SearchScreen = ({ navigation }) => {
  const { addToQueue, startDownload } = useDownloads();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Alan Walker',
    'Ed Sheeran',
    'Billie Eilish',
    'The Weeknd',
    'Dua Lipa',
  ]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    
    // Add to recent searches
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 9)]);
    }

    try {
      const searchResults = await youtubeService.searchVideos(query, 20);
      setVideos(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentSearchPress = (search) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  const handleClearRecent = (search) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  const handleVideoPress = (video) => {
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
    
    await startDownload(downloadItem);
    
    setIsDownloading(false);
    navigation.navigate('Downloads');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setVideos([]);
    setHasSearched(false);
  };

  const renderRecentSearchItem = ({ item }) => (
    <View style={styles.recentItem}>
      <TouchableOpacity
        style={styles.recentContent}
        onPress={() => handleRecentSearchPress(item)}
      >
        <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
        <Text style={styles.recentText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleClearRecent(item)}
      >
        <Ionicons name="close" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderRecentSearches = () => (
    <View style={styles.recentContainer}>
      <Text style={styles.sectionTitle}>Recent Searches</Text>
      <FlatList
        data={recentSearches}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderRecentSearchItem}
        scrollEnabled={false}
      />
    </View>
  );

  const renderSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      <Text style={styles.sectionTitle}>Popular Searches</Text>
      <View style={styles.tagsContainer}>
        {['Pop Music', 'Hip Hop', 'Electronic', 'Rock', 'R&B', 'Jazz', 'Classical', 'Country'].map((tag) => (
          <TouchableOpacity
            key={tag}
            style={styles.tag}
            onPress={() => handleRecentSearchPress(tag)}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <EmptyState
      icon="search-outline"
      title="No results found"
      message={`We couldn't find any videos for "${searchQuery}". Try different keywords.`}
    />
  );

  const renderInitialState = () => (
    <View style={styles.initialContainer}>
      {recentSearches.length > 0 && renderRecentSearches()}
      {renderSuggestions()}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search for music, artists..."
        autoFocus
      />

      {isLoading ? (
        <LoadingSpinner message="Searching..." />
      ) : hasSearched ? (
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
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderInitialState()
      )}

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
    paddingTop: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
  },
  initialContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  recentContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: '600',
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recentContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentText: {
    color: COLORS.text,
    fontSize: SIZES.md,
  },
  removeButton: {
    padding: 4,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    color: COLORS.text,
    fontSize: SIZES.sm,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
    flexGrow: 1,
  },
});

export default SearchScreen;
