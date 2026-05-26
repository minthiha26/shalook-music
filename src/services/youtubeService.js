// YouTube Search Service
// Note: In production, you should use the official YouTube Data API with your API key
// This service provides a mock implementation for demonstration

// Mock data for demonstration purposes
const MOCK_VIDEOS = [
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    channel: 'Rick Astley',
    duration: '3:33',
    views: '1.4B views',
    publishedAt: '2009-10-25',
  },
  {
    videoId: 'fJ9rUzIMcZQ',
    title: 'Queen - Bohemian Rhapsody',
    thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
    channel: 'Queen Official',
    duration: '5:55',
    views: '1.6B views',
    publishedAt: '2008-08-01',
  },
  {
    videoId: 'JGwWNGJdvx8',
    title: 'Ed Sheeran - Shape of You',
    thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
    channel: 'Ed Sheeran',
    duration: '4:24',
    views: '6.1B views',
    publishedAt: '2017-01-30',
  },
  {
    videoId: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
    channel: 'Luis Fonsi',
    duration: '4:42',
    views: '8.2B views',
    publishedAt: '2017-01-12',
  },
  {
    videoId: 'RgKAFK5djSk',
    title: 'Wiz Khalifa - See You Again ft. Charlie Puth',
    thumbnail: 'https://i.ytimg.com/vi/RgKAFK5djSk/hqdefault.jpg',
    channel: 'Wiz Khalifa',
    duration: '3:58',
    views: '5.8B views',
    publishedAt: '2015-04-06',
  },
  {
    videoId: 'OPf0YbXqDm0',
    title: 'Mark Ronson - Uptown Funk ft. Bruno Mars',
    thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
    channel: 'Mark Ronson',
    duration: '4:30',
    views: '4.8B views',
    publishedAt: '2014-11-19',
  },
  {
    videoId: '09R8_2nJtjg',
    title: 'Maroon 5 - Sugar',
    thumbnail: 'https://i.ytimg.com/vi/09R8_2nJtjg/hqdefault.jpg',
    channel: 'Maroon 5',
    duration: '5:01',
    views: '3.7B views',
    publishedAt: '2015-01-14',
  },
  {
    videoId: 'pRpeEdMmmQ0',
    title: 'Shakira - Waka Waka (This Time for Africa)',
    thumbnail: 'https://i.ytimg.com/vi/pRpeEdMmmQ0/hqdefault.jpg',
    channel: 'Shakira',
    duration: '3:31',
    views: '3.5B views',
    publishedAt: '2010-06-04',
  },
  {
    videoId: 'YQHsXMglC9A',
    title: 'Adele - Hello',
    thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg',
    channel: 'Adele',
    duration: '6:07',
    views: '3.1B views',
    publishedAt: '2015-10-22',
  },
  {
    videoId: 'CevxZvSJLk8',
    title: 'Katy Perry - Roar',
    thumbnail: 'https://i.ytimg.com/vi/CevxZvSJLk8/hqdefault.jpg',
    channel: 'Katy Perry',
    duration: '4:30',
    views: '3.6B views',
    publishedAt: '2013-09-05',
  },
];

// Additional mock videos for search variety
const ADDITIONAL_VIDEOS = [
  {
    videoId: 'hT_nvWreIhg',
    title: 'OneRepublic - Counting Stars',
    thumbnail: 'https://i.ytimg.com/vi/hT_nvWreIhg/hqdefault.jpg',
    channel: 'OneRepublic',
    duration: '4:44',
    views: '3.8B views',
    publishedAt: '2013-05-31',
  },
  {
    videoId: 'pt8VYOfr8To',
    title: 'The Weeknd - Blinding Lights',
    thumbnail: 'https://i.ytimg.com/vi/pt8VYOfr8To/hqdefault.jpg',
    channel: 'The Weeknd',
    duration: '4:22',
    views: '870M views',
    publishedAt: '2020-01-31',
  },
  {
    videoId: 'SlPhMPnQ58k',
    title: 'Maroon 5 - Memories',
    thumbnail: 'https://i.ytimg.com/vi/SlPhMPnQ58k/hqdefault.jpg',
    channel: 'Maroon 5',
    duration: '3:09',
    views: '1.3B views',
    publishedAt: '2019-09-20',
  },
  {
    videoId: 'lp-EO5I60KA',
    title: 'Eminem - Lose Yourself',
    thumbnail: 'https://i.ytimg.com/vi/lp-EO5I60KA/hqdefault.jpg',
    channel: 'Eminem',
    duration: '5:20',
    views: '1.2B views',
    publishedAt: '2002-10-28',
  },
  {
    videoId: 'e-ORhEE9VVg',
    title: 'Taylor Swift - Blank Space',
    thumbnail: 'https://i.ytimg.com/vi/e-ORhEE9VVg/hqdefault.jpg',
    channel: 'Taylor Swift',
    duration: '4:32',
    views: '3.2B views',
    publishedAt: '2014-11-10',
  },
  {
    videoId: 'papuvlVeZg8',
    title: 'Alan Walker - Faded',
    thumbnail: 'https://i.ytimg.com/vi/papuvlVeZg8/hqdefault.jpg',
    channel: 'Alan Walker',
    duration: '3:32',
    views: '3.4B views',
    publishedAt: '2015-12-03',
  },
  {
    videoId: '60ItHLz5WEA',
    title: 'Alan Walker - Alone',
    thumbnail: 'https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg',
    channel: 'Alan Walker',
    duration: '2:42',
    views: '1.6B views',
    publishedAt: '2016-12-02',
  },
  {
    videoId: 'bo_efYhYU2A',
    title: 'The Chainsmokers - Closer ft. Halsey',
    thumbnail: 'https://i.ytimg.com/vi/bo_efYhYU2A/hqdefault.jpg',
    channel: 'The Chainsmokers',
    duration: '4:22',
    views: '3.1B views',
    publishedAt: '2016-07-29',
  },
];

const ALL_VIDEOS = [...MOCK_VIDEOS, ...ADDITIONAL_VIDEOS];

class YouTubeService {
  constructor() {
    // In production, set your YouTube Data API key here
    this.apiKey = null;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  // Search videos - uses mock data or real API if key is provided
  async searchVideos(query, maxResults = 20) {
    try {
      // If API key is available, use real YouTube API
      if (this.apiKey) {
        return await this.searchWithApi(query, maxResults);
      }

      // Otherwise, use mock data with filtering
      return this.searchMockVideos(query, maxResults);
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  // Search using YouTube Data API (requires API key)
  async searchWithApi(query, maxResults) {
    const url = `${this.baseUrl}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${this.apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channel: item.snippet.channelTitle,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
    }));
  }

  // Mock search implementation
  searchMockVideos(query, maxResults) {
    const searchLower = query.toLowerCase();
    
    // Filter videos based on search query
    let results = ALL_VIDEOS.filter(video => 
      video.title.toLowerCase().includes(searchLower) ||
      video.channel.toLowerCase().includes(searchLower)
    );

    // If no exact matches, return all videos shuffled
    if (results.length === 0) {
      results = [...ALL_VIDEOS].sort(() => Math.random() - 0.5);
    }

    // Add some random delay to simulate network request
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(results.slice(0, maxResults));
      }, 500 + Math.random() * 500);
    });
  }

  // Get trending videos
  async getTrendingVideos(maxResults = 10) {
    try {
      if (this.apiKey) {
        const url = `${this.baseUrl}/videos?part=snippet,statistics&chart=mostPopular&maxResults=${maxResults}&key=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        return data.items.map(item => ({
          videoId: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high?.url,
          channel: item.snippet.channelTitle,
          views: this.formatViews(item.statistics.viewCount),
          publishedAt: item.snippet.publishedAt,
        }));
      }

      // Return mock trending
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(MOCK_VIDEOS.slice(0, maxResults));
        }, 300);
      });
    } catch (error) {
      console.error('Trending error:', error);
      throw error;
    }
  }

  // Get video details
  async getVideoDetails(videoId) {
    try {
      // Find in mock data first
      const mockVideo = ALL_VIDEOS.find(v => v.videoId === videoId);
      if (mockVideo) {
        return mockVideo;
      }

      if (this.apiKey) {
        const url = `${this.baseUrl}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          return {
            videoId: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high?.url,
            channel: item.snippet.channelTitle,
            description: item.snippet.description,
            views: this.formatViews(item.statistics.viewCount),
            duration: this.formatDuration(item.contentDetails.duration),
            publishedAt: item.snippet.publishedAt,
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Get video details error:', error);
      throw error;
    }
  }

  // Helper to format view count
  formatViews(views) {
    const num = parseInt(views);
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B views`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  }

  // Helper to format ISO 8601 duration
  formatDuration(duration) {
    if (!duration) return 'N/A';
    
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Set API key for real YouTube API access
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }
}

export default new YouTubeService();
