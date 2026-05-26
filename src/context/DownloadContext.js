import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { useAuth } from './AuthContext';

const DownloadContext = createContext({});

const DOWNLOADS_STORAGE_KEY = '@shalook_downloads';

export const DownloadProvider = ({ children }) => {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [currentDownload, setCurrentDownload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDownloads();
    } else {
      setDownloads([]);
      setIsLoading(false);
    }
  }, [user]);

  const getStorageKey = () => `${DOWNLOADS_STORAGE_KEY}_${user?.id}`;

  const loadDownloads = async () => {
    try {
      const data = await AsyncStorage.getItem(getStorageKey());
      if (data) {
        setDownloads(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading downloads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDownloads = async (newDownloads) => {
    try {
      await AsyncStorage.setItem(getStorageKey(), JSON.stringify(newDownloads));
    } catch (error) {
      console.error('Error saving downloads:', error);
    }
  };

  const addToQueue = (video, format = 'mp3') => {
    const downloadItem = {
      id: `${video.videoId}_${Date.now()}`,
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      channel: video.channel,
      duration: video.duration,
      format,
      status: 'queued',
      progress: 0,
      addedAt: new Date().toISOString(),
    };

    setDownloadQueue(prev => [...prev, downloadItem]);
    return downloadItem;
  };

  const startDownload = async (downloadItem) => {
    setCurrentDownload(downloadItem);
    
    // Update status to downloading
    setDownloadQueue(prev => 
      prev.map(item => 
        item.id === downloadItem.id 
          ? { ...item, status: 'downloading', progress: 0 }
          : item
      )
    );

    try {
      // Simulate download progress (in real app, you'd use a backend service)
      // YouTube downloads require a backend server due to API restrictions
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setDownloadQueue(prev => 
          prev.map(item => 
            item.id === downloadItem.id 
              ? { ...item, progress }
              : item
          )
        );
      }

      // Create a mock file path (in real app, actual file would be downloaded)
      const fileName = `${downloadItem.title.replace(/[^a-zA-Z0-9]/g, '_')}.${downloadItem.format}`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Complete the download
      const completedDownload = {
        ...downloadItem,
        status: 'completed',
        progress: 100,
        filePath,
        completedAt: new Date().toISOString(),
      };

      // Remove from queue and add to downloads
      setDownloadQueue(prev => prev.filter(item => item.id !== downloadItem.id));
      
      const newDownloads = [completedDownload, ...downloads];
      setDownloads(newDownloads);
      await saveDownloads(newDownloads);

      setCurrentDownload(null);
      return { success: true, download: completedDownload };
    } catch (error) {
      console.error('Download error:', error);
      
      setDownloadQueue(prev => 
        prev.map(item => 
          item.id === downloadItem.id 
            ? { ...item, status: 'failed', error: error.message }
            : item
        )
      );
      
      setCurrentDownload(null);
      return { success: false, error: error.message };
    }
  };

  const removeFromQueue = (id) => {
    setDownloadQueue(prev => prev.filter(item => item.id !== id));
  };

  const deleteDownload = async (id) => {
    try {
      const download = downloads.find(d => d.id === id);
      
      // Try to delete the file if it exists
      if (download?.filePath) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(download.filePath);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(download.filePath);
          }
        } catch (e) {
          console.log('File already deleted or not found');
        }
      }

      const newDownloads = downloads.filter(d => d.id !== id);
      setDownloads(newDownloads);
      await saveDownloads(newDownloads);

      return { success: true };
    } catch (error) {
      console.error('Error deleting download:', error);
      return { success: false, error: error.message };
    }
  };

  const clearAllDownloads = async () => {
    try {
      // Delete all files
      for (const download of downloads) {
        if (download.filePath) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(download.filePath);
            if (fileInfo.exists) {
              await FileSystem.deleteAsync(download.filePath);
            }
          } catch (e) {
            console.log('Error deleting file:', e);
          }
        }
      }

      setDownloads([]);
      await AsyncStorage.removeItem(getStorageKey());

      return { success: true };
    } catch (error) {
      console.error('Error clearing downloads:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <DownloadContext.Provider
      value={{
        downloads,
        downloadQueue,
        currentDownload,
        isLoading,
        addToQueue,
        startDownload,
        removeFromQueue,
        deleteDownload,
        clearAllDownloads,
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownloads = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error('useDownloads must be used within a DownloadProvider');
  }
  return context;
};
