# Shalook Music - MP3 Download App

A React Native mobile application that allows users to search YouTube videos and download them as MP3 audio files.

## Features

- **User Authentication**: Create account, login, logout functionality with local storage
- **YouTube Search**: Search for videos from YouTube with trending videos on home screen
- **Download Manager**: Download videos as MP3 or MP4 format with progress tracking
- **Download Queue**: Queue multiple downloads and track progress
- **Offline Library**: View and manage downloaded files
- **User Profile**: Edit profile, manage settings, and view download statistics
- **Dark Theme**: Beautiful dark UI design

## Screenshots

The app includes the following screens:
- Login/Register screens
- Home screen with trending videos
- Search screen with recent searches and suggestions
- Downloads screen with queue and completed downloads
- Profile screen with settings

## Tech Stack

- **React Native** with Expo
- **React Navigation** for routing
- **AsyncStorage** for local data persistence
- **Expo File System** for file management
- **Expo AV** for audio playback
- **Context API** for state management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/shalook-music.git
cd shalook-music
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `a` to run on Android emulator
   - Press `i` to run on iOS simulator

## Project Structure

```
shalook-music/
├── App.js                    # Main application entry
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── VideoCard.js
│   │   ├── DownloadItem.js
│   │   ├── SearchBar.js
│   │   ├── DownloadModal.js
│   │   ├── LoadingSpinner.js
│   │   └── EmptyState.js
│   ├── constants/            # Theme and constants
│   │   └── theme.js
│   ├── context/              # React Context providers
│   │   ├── AuthContext.js
│   │   └── DownloadContext.js
│   ├── navigation/           # Navigation configuration
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   ├── screens/              # Application screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   └── main/
│   │       ├── HomeScreen.js
│   │       ├── SearchScreen.js
│   │       ├── DownloadsScreen.js
│   │       └── ProfileScreen.js
│   └── services/             # API services
│       └── youtubeService.js
└── assets/                   # App icons and images
```

## Configuration

### YouTube Data API (Optional)

For real YouTube search results, you can add your YouTube Data API key:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the YouTube Data API v3
3. Update `src/services/youtubeService.js`:

```javascript
this.apiKey = 'YOUR_API_KEY';
```

Without an API key, the app uses mock data for demonstration.

### Backend Server (Production)

For actual MP3/MP4 downloads, you'll need a backend server because:
- YouTube doesn't allow direct video downloads via their API
- Video-to-audio conversion requires server-side processing
- Popular solutions include yt-dlp or youtube-dl libraries

Example backend implementation:
```javascript
// Express.js server example
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

app.get('/download/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const { format } = req.query; // 'mp3' or 'mp4'
  
  const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
  
  if (format === 'mp3') {
    const stream = ytdl(videoURL, { quality: 'highestaudio' });
    ffmpeg(stream)
      .audioBitrate(320)
      .format('mp3')
      .pipe(res);
  } else {
    ytdl(videoURL, { quality: 'highest' }).pipe(res);
  }
});
```

## Features in Detail

### Authentication
- Email/password registration and login
- Form validation
- Persistent login state
- Profile editing

### YouTube Search
- Search by video title or channel name
- View trending videos
- Recent search history
- Popular search suggestions

### Download Manager
- Select MP3 (audio only) or MP4 (video) format
- Download progress tracking
- Download queue management
- Delete individual or all downloads

### Profile & Settings
- Edit name
- Download statistics
- Wi-Fi only downloads toggle
- High quality audio toggle
- Notifications toggle
- Clear all downloads

## Color Scheme

- Primary: `#e94560` (Pink/Red)
- Background: `#1a1a2e` (Dark Navy)
- Surface: `#16213e` (Darker Blue)
- Accent: `#00d9ff` (Cyan)
- Text: `#ffffff` (White)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This app is for educational purposes only. Downloading copyrighted content from YouTube may violate their Terms of Service. Always respect content creators' rights and only download content you have permission to use.

## Support

For issues and feature requests, please open an issue on GitHub.

---

Made with React Native and Expo
