import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Animated,
  Keyboard,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import { 
  SearchInput,
  TrackListItem,
  TrackCard,
  CategoryCard,
  SectionHeader,
  LoadingSpinner,
  EmptyState,
  DownloadSheet,
  TrackOptionsSheet,
} from '../../components';
import { youtubeService } from '../../services';
import { useDownloads } from '../../context';

const CATEGORIES = [
  'Pop', 'Hip Hop', 'Rock', 'Electronic', 'R&B', 'Jazz',
  'Classical', 'Country', 'Latin', 'Indie', 'Metal', 'Chill',
  'Workout', 'Focus', 'Party', 'Sleep',
];

const SearchScreen = ({ navigation }) => {
  const { addToQueue, startDownload } = useDownloads();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Alan Walker', 'Ed Sheeran', 'Billie Eilish', 'The Weeknd', 'Dua Lipa'
  ]);

  const handleSearch = async (query) => {
    if (!query?.trim()) return;
    
    Keyboard.dismiss();
    setIsSearching(true);
    setHasSearched(true);
    
    // Add to recent searches
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 9)]);
    }

    try {
      const results = await youtubeService.searchVideos(query, 25);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryPress = (category) => {
    setSearchQuery(category);
    handleSearch(category);
  };

  const handleRecentPress = (search) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const handleTrackPress = (track) => {
    // Play track
  };

  const handleTrackOptions = (track) => {
    setSelectedTrack(track);
    setShowOptionsSheet(true);
  };

  const handleDownload = async (video, option) => {
    setShowDownloadSheet(false);
    const downloadItem = addToQueue(video, option.format);
    await startDownload(downloadItem);
    navigation.navigate('Downloads');
  };

  const handleOptionAction = (actionId, track) => {
    if (actionId === 'download') {
      setShowOptionsSheet(false);
      setTimeout(() => {
        setSelectedTrack(track);
        setShowDownloadSheet(true);
      }, 300);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const renderBrowseAll = () => (
    <View style={styles.browseContainer}>
      <SectionHeader title="Browse All" showSeeAll={false} />
      <View style={styles.categoriesGrid}>
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category}
            category={category}
            onPress={handleCategoryPress}
          />
        ))}
      </View>
    </View>
  );

  const renderRecentSearches = () => {
    if (recentSearches.length === 0) return null;

    return (
      <View style={styles.recentContainer}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent searches</Text>
          <TouchableOpacity onPress={handleClearRecent}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        </View>
        
        {recentSearches.map((search, index) => (
          <TouchableOpacity
            key={`${search}-${index}`}
            style={styles.recentItem}
            onPress={() => handleRecentPress(search)}
          >
            <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.recentText}>{search}</Text>
            <TouchableOpacity 
              onPress={() => setRecentSearches(prev => prev.filter(s => s !== search))}
              style={styles.removeButton}
            >
              <Ionicons name="close" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return <LoadingSpinner message="Searching..." />;
    }

    if (searchResults.length === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="No results found"
          message={`We couldn't find anything for "${searchQuery}"`}
        />
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsCount}>
          {searchResults.length} results for "{searchQuery}"
        </Text>
        
        {/* Top Results - Horizontal */}
        <SectionHeader title="Top Results" showSeeAll={false} style={styles.sectionHeader} />
        <FlatList
          horizontal
          data={searchResults.slice(0, 5)}
          keyExtractor={(item) => `top-${item.videoId}`}
          renderItem={({ item }) => (
            <TrackCard
              track={item}
              size="medium"
              onPress={handleTrackPress}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* All Results - List */}
        <SectionHeader title="Songs" showSeeAll={false} style={styles.sectionHeader} />
        {searchResults.map((track, index) => (
          <TrackListItem
            key={track.videoId}
            track={track}
            index={index}
            showIndex={false}
            onPress={handleTrackPress}
            onOptionsPress={handleTrackOptions}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          onClear={handleClearSearch}
          autoFocus={false}
        />
      </SafeAreaView>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {hasSearched ? (
          renderSearchResults()
        ) : (
          <>
            {renderRecentSearches()}
            {renderBrowseAll()}
          </>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Sheets */}
      <DownloadSheet
        visible={showDownloadSheet}
        video={selectedTrack}
        onClose={() => setShowDownloadSheet(false)}
        onDownload={handleDownload}
      />

      <TrackOptionsSheet
        visible={showOptionsSheet}
        track={selectedTrack}
        onClose={() => setShowOptionsSheet(false)}
        onAction={handleOptionAction}
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
    paddingBottom: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    paddingHorizontal: SIZES.padding,
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  browseContainer: {
    paddingBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding,
  },
  recentContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 24,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  clearText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  recentText: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.md,
  },
  removeButton: {
    padding: 4,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    paddingHorizontal: SIZES.padding,
    marginTop: 8,
  },
  sectionHeader: {
    marginTop: 16,
  },
  horizontalList: {
    paddingHorizontal: SIZES.padding,
  },
  bottomPadding: {
    height: 100,
  },
});

export default SearchScreen;
