import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LibraryStore, AudioQuality, LibraryTab } from '../types';
import { libraryService } from '../services/LibraryService';
import { mmkvStorage } from '../../../store/mmkvStorage';

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      likedTracks: [],
      likedPlaylists: [],
      downloadedTracks: [],
      downloadedPlaylists: [],
      downloadJobs: [],
      totalDownloadSize: 0,
      
      isOfflineMode: false,
      offlineQuality: 'high',
      maxDownloadSize: 5, // 5GB default
      downloadOverWifiOnly: true,
      
      isLoading: false,
      isRefreshing: false,
      error: null,
      selectedTab: 'liked',
      
      availableStorage: 0,
      usedStorage: 0,
      totalStorage: 0,

      // Actions
      likeTrack: async (track) => {
        try {
          await libraryService.likeTrack(track);
          
          const likedTrack = {
            id: `liked_${track.id}_${Date.now()}`,
            trackId: track.id,
            track,
            likedAt: new Date().toISOString(),
          };
          
          const currentLikedTracks = get().likedTracks;
          set({ likedTracks: [likedTrack, ...currentLikedTracks] });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to like track' });
        }
      },

      unlikeTrack: async (trackId) => {
        try {
          await libraryService.unlikeTrack(trackId);
          
          const currentLikedTracks = get().likedTracks;
          const updatedTracks = currentLikedTracks.filter(lt => lt.trackId !== trackId);
          set({ likedTracks: updatedTracks });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to unlike track' });
        }
      },

      likePlaylist: async (playlist) => {
        try {
          await libraryService.likePlaylist(playlist);
          
          const likedPlaylist = {
            id: `liked_playlist_${playlist.id}_${Date.now()}`,
            playlistId: playlist.id,
            playlist,
            likedAt: new Date().toISOString(),
          };
          
          const currentLikedPlaylists = get().likedPlaylists;
          set({ likedPlaylists: [likedPlaylist, ...currentLikedPlaylists] });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to like playlist' });
        }
      },

      unlikePlaylist: async (playlistId) => {
        try {
          await libraryService.unlikePlaylist(playlistId);
          
          const currentLikedPlaylists = get().likedPlaylists;
          const updatedPlaylists = currentLikedPlaylists.filter(lp => lp.playlistId !== playlistId);
          set({ likedPlaylists: updatedPlaylists });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to unlike playlist' });
        }
      },

      downloadTrack: async (track, quality = 'high') => {
        try {
          const downloadId = await libraryService.downloadTrack(track, quality);
          
          // Set up progress listener
          libraryService.onDownloadProgress(downloadId, (event) => {
            const currentJobs = get().downloadJobs;
            const updatedJobs = currentJobs.map(job => 
              job.id === downloadId 
                ? { 
                    ...job, 
                    progress: event.progress,
                    downloadedSize: event.downloadedSize,
                    speed: event.speed,
                    estimatedTimeRemaining: event.estimatedTimeRemaining
                  }
                : job
            );
            set({ downloadJobs: updatedJobs });
          });

          // Set up completion listener
          libraryService.onDownloadCompleted(downloadId, (event) => {
            const currentJobs = get().downloadJobs;
            const updatedJobs = currentJobs.map(job => 
              job.id === downloadId ? { ...job, status: 'completed' as const } : job
            );
            
            // Add to downloaded tracks
            const downloadedTrack = {
              ...track,
              isDownloaded: true,
              downloadedAt: new Date().toISOString(),
              downloadPath: event.filePath,
              downloadSize: event.size,
            };
            
            const currentDownloaded = get().downloadedTracks;
            
            set({ 
              downloadJobs: updatedJobs,
              downloadedTracks: [downloadedTrack, ...currentDownloaded]
            });
            
            // Update total download size
            get().updateTotalDownloadSize();
          });

          // Set up failure listener
          libraryService.onDownloadFailed(downloadId, (event) => {
            const currentJobs = get().downloadJobs;
            const updatedJobs = currentJobs.map(job => 
              job.id === downloadId 
                ? { ...job, status: 'failed' as const, error: event.error }
                : job
            );
            set({ downloadJobs: updatedJobs });
          });

          // Add job to current jobs
          const downloadJobs = libraryService.getDownloadJobs();
          set({ downloadJobs });
          
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to start download' });
        }
      },

      downloadPlaylist: async (playlist, quality = 'high') => {
        try {
          const downloadId = await libraryService.downloadPlaylist(playlist, quality);
          
          // Set up listeners similar to downloadTrack
          libraryService.onDownloadProgress(downloadId, (event) => {
            const currentJobs = get().downloadJobs;
            const updatedJobs = currentJobs.map(job => 
              job.id === downloadId 
                ? { 
                    ...job, 
                    progress: event.progress,
                    downloadedSize: event.downloadedSize,
                    speed: event.speed,
                    estimatedTimeRemaining: event.estimatedTimeRemaining
                  }
                : job
            );
            set({ downloadJobs: updatedJobs });
          });

          libraryService.onDownloadCompleted(downloadId, (event) => {
            const currentJobs = get().downloadJobs;
            const updatedJobs = currentJobs.map(job => 
              job.id === downloadId ? { ...job, status: 'completed' as const } : job
            );
            
            const downloadedPlaylist = {
              ...playlist,
              isDownloaded: true,
              downloadedAt: new Date().toISOString(),
              downloadSize: event.size,
            };
            
            const currentDownloaded = get().downloadedPlaylists;
            
            set({ 
              downloadJobs: updatedJobs,
              downloadedPlaylists: [downloadedPlaylist, ...currentDownloaded]
            });
            
            get().updateTotalDownloadSize();
          });

          const downloadJobs = libraryService.getDownloadJobs();
          set({ downloadJobs });
          
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to start playlist download' });
        }
      },

      cancelDownload: async (downloadId) => {
        try {
          await libraryService.cancelDownload(downloadId);
          
          const currentJobs = get().downloadJobs;
          const updatedJobs = currentJobs.map(job => 
            job.id === downloadId ? { ...job, status: 'cancelled' as const } : job
          );
          set({ downloadJobs: updatedJobs });
          
          libraryService.removeDownloadListener(downloadId);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to cancel download' });
        }
      },

      pauseDownload: async (downloadId) => {
        try {
          await libraryService.pauseDownload(downloadId);
          
          const currentJobs = get().downloadJobs;
          const updatedJobs = currentJobs.map(job => 
            job.id === downloadId ? { ...job, status: 'paused' as const } : job
          );
          set({ downloadJobs: updatedJobs });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to pause download' });
        }
      },

      resumeDownload: async (downloadId) => {
        try {
          await libraryService.resumeDownload(downloadId);
          
          const currentJobs = get().downloadJobs;
          const updatedJobs = currentJobs.map(job => 
            job.id === downloadId ? { ...job, status: 'downloading' as const } : job
          );
          set({ downloadJobs: updatedJobs });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to resume download' });
        }
      },

      retryDownload: async (downloadId) => {
        try {
          await libraryService.retryDownload(downloadId);
          
          const currentJobs = get().downloadJobs;
          const updatedJobs = currentJobs.map(job => 
            job.id === downloadId ? { ...job, status: 'pending' as const, error: undefined } : job
          );
          set({ downloadJobs: updatedJobs });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to retry download' });
        }
      },

      removeDownload: async (itemId, type) => {
        try {
          await libraryService.removeDownload(itemId, type);
          
          if (type === 'track') {
            const currentTracks = get().downloadedTracks;
            const updatedTracks = currentTracks.filter(track => track.id !== itemId);
            set({ downloadedTracks: updatedTracks });
          } else {
            const currentPlaylists = get().downloadedPlaylists;
            const updatedPlaylists = currentPlaylists.filter(playlist => playlist.id !== itemId);
            set({ downloadedPlaylists: updatedPlaylists });
          }
          
          get().updateTotalDownloadSize();
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove download' });
        }
      },

      clearAllDownloads: async () => {
        try {
          await libraryService.clearAllDownloads();
          set({ 
            downloadedTracks: [],
            downloadedPlaylists: [],
            downloadJobs: [],
            totalDownloadSize: 0
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to clear downloads' });
        }
      },

      setOfflineMode: (enabled) => {
        set({ isOfflineMode: enabled });
      },

      setOfflineQuality: (quality) => {
        set({ offlineQuality: quality });
      },

      setMaxDownloadSize: (sizeGB) => {
        set({ maxDownloadSize: sizeGB });
      },

      setDownloadOverWifiOnly: (wifiOnly) => {
        set({ downloadOverWifiOnly: wifiOnly });
      },

      loadLikedContent: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const [likedTracks, likedPlaylists] = await Promise.all([
            libraryService.getLikedTracks(),
            libraryService.getLikedPlaylists(),
          ]);
          
          set({ 
            likedTracks,
            likedPlaylists,
            isLoading: false
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load liked content' 
          });
        }
      },

      loadDownloads: async () => {
        try {
          // In real implementation, would load from local storage/metadata
          const downloadJobs = libraryService.getDownloadJobs();
          set({ downloadJobs });
          
          await get().updateTotalDownloadSize();
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load downloads' });
        }
      },

      refresh: async () => {
        set({ isRefreshing: true });
        
        try {
          await Promise.all([
            get().loadLikedContent(),
            get().loadDownloads(),
            get().checkStorageSpace(),
          ]);
          
          set({ isRefreshing: false });
        } catch (error) {
          set({ 
            isRefreshing: false, 
            error: error instanceof Error ? error.message : 'Failed to refresh' 
          });
        }
      },

      setSelectedTab: (tab) => {
        set({ selectedTab: tab });
      },

      checkStorageSpace: async () => {
        try {
          const storageInfo = await libraryService.getStorageInfo();
          set({
            availableStorage: storageInfo.available,
            usedStorage: storageInfo.used,
            totalStorage: storageInfo.total,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to check storage' });
        }
      },

      cleanupOldDownloads: async () => {
        try {
          // In real implementation, would remove old/unused downloads
          console.log('Cleaning up old downloads...');
          await get().updateTotalDownloadSize();
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to cleanup downloads' });
        }
      },

      syncWithCloud: async () => {
        try {
          // In real implementation, would sync liked content with cloud
          console.log('Syncing with cloud...');
          await get().loadLikedContent();
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to sync with cloud' });
        }
      },

      // Helper method to update total download size
      updateTotalDownloadSize: async () => {
        try {
          const totalSize = await libraryService.getDownloadedSize();
          set({ totalDownloadSize: totalSize });
        } catch (error) {
          console.error('Failed to update total download size:', error);
        }
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'library-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        // Persist user preferences and offline settings
        isOfflineMode: state.isOfflineMode,
        offlineQuality: state.offlineQuality,
        maxDownloadSize: state.maxDownloadSize,
        downloadOverWifiOnly: state.downloadOverWifiOnly,
        selectedTab: state.selectedTab,
        // Note: liked content and downloads would be persisted separately
        // in a real app for better performance
      }),
    }
  )
);
