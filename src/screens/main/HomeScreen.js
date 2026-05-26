import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { 
  TrackCard, 
  TrackListItem,
  FeaturedCard, 
  SectionHeader, 
  CategoryCard,
  QuickCategory,
  DownloadSheet,
  TrackOptionsSheet,
  PlayButton,
  MiniPlayer,
} from '../../components';
import { youtubeService } from '../../services';
import { useAuth, useDownloads } from '../../context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { addToQueue, startDownload, downloads } = useDownloads();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'User';

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [trending] = await Promise.all([
        youtubeService.getTrendingVideos(15),
      ]);
      setTrendingVideos(trending);
      // Use some trending as "recently played" for demo
      setRecentlyPlayed(trending.slice(0, 6));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleTrackPress = (track) => {
    setCurrentlyPlaying(track);
  };

  const handleTrackOptions = (track) => {
    setSelectedTrack(track);
    setShowOptionsSheet(true);
  };

  const handleDownloadPress = (track) => {
    setSelectedTrack(track);
    setShowDownloadSheet(true);
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

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const quickCategories = [
    { name: 'Liked Songs', icon: 'heart', color: COLORS.primary },
    { name: 'Downloads', icon: 'download', color: COLORS.accentBlue },
    { name: 'New Releases', icon: 'flash', color: COLORS.accentOrange },
    { name: 'Top Charts', icon: 'trending-up', color: COLORS.accentPurple },
  ];

  const renderQuickAccess = () => (
    <View style={styles.quickAccessContainer}>
      <View style={styles.quickAccessRow}>
        {quickCategories.slice(0, 2).map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.quickAccessItem}
            onPress={() => {
              if (item.name === 'Downloads') navigation.navigate('Downloads');
              else if (item.name === 'Liked Songs') navigation.navigate('Library');
            }}
          >
            <View style={[styles.quickAccessIcon, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={20} color={COLORS.text} />
            </View>
            <Text style={styles.quickAccessText} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.quickAccessRow}>
        {quickCategories.slice(2, 4).map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.quickAccessItem}
          >
            <View style={[styles.quickAccessIcon, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={20} color={COLORS.text} />
            </View>
            <Text style={styles.quickAccessText} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFeatured = () => {
    if (trendingVideos.length === 0) return null;
    const featured = trendingVideos[0];
    
    return (
      <FeaturedCard 
        track={featured} 
        onPress={handleTrackPress}
      />
    );
  };

  const renderRecentlyPlayed = () => (
    <View>
      <SectionHeader 
        title="Recently Played" 
        onSeeAll={() => navigation.navigate('Library')}
      />
      <FlatList
        horizontal
        data={recentlyPlayed}
        keyExtractor={(item) => `recent-${item.videoId}`}
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
    </View>
  );

  const renderTrending = () => (
    <View>
      <SectionHeader 
        title="Trending Now" 
        subtitle="What everyone's listening to"
        onSeeAll={() => navigation.navigate('Search')}
      />
      {trendingVideos.slice(1, 6).map((track, index) => (
        <TrackListItem
          key={track.videoId}
          track={track}
          index={index}
          onPress={handleTrackPress}
          onOptionsPress={handleTrackOptions}
          isPlaying={currentlyPlaying?.videoId === track.videoId}
        />
      ))}
    </View>
  );

  const renderMoreToExplore = () => (
    <View>
      <SectionHeader 
        title="Made For You" 
        showSeeAll={false}
      />
      <FlatList
        horizontal
        data={trendingVideos.slice(6, 12)}
        keyExtractor={(item) => `explore-${item.videoId}`}
        renderItem={({ item }) => (
          <TrackCard
            track={item}
            size="large"
            onPress={handleTrackPress}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Animated Header Background */}
      <Animated.View style={[styles.headerBg, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={[COLORS.surfaceLight, COLORS.background]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{firstName}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="time-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {renderQuickAccess()}
        {renderFeatured()}
        {renderRecentlyPlayed()}
        {renderTrending()}
        {renderMoreToExplore()}
        
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Mini Player */}
      {currentlyPlaying && (
        <MiniPlayer
          track={currentlyPlaying}
          isPlaying={true}
          onPlayPause={() => {}}
          onPress={() => {}}
        />
      )}

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
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 1,
  },
  header: {
    zIndex: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  userName: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  quickAccessContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 24,
    gap: 8,
  },
  quickAccessRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAccessItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: SIZES.radius.sm,
    overflow: 'hidden',
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccessText: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: 12,
  },
  horizontalList: {
    paddingHorizontal: SIZES.padding,
  },
  bottomPadding: {
    height: 150,
  },
});

export default HomeScreen;
