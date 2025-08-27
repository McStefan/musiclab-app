import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { VisualStore, Visual, VisualGallery, VisualFilters, VisualQuality } from '../types';
import { visualsService } from '../services/VisualsService';
import { mmkvStorage } from '../../../store/mmkvStorage';
import { analyticsService } from '../../analytics/services/AnalyticsService';

export const useVisualsStore = create<VisualStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentVisual: null,
      visuals: [],
      visualGalleries: [],
      likedVisuals: [],
      downloadedVisuals: [],
      
      searchQuery: '',
      searchResults: [],
      
      // Playback state
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: false,
      playbackRate: 1,
      
      // Display settings
      currentPlaylist: undefined,
      isFullscreen: false,
      showControls: true,
      autoPlay: false,
      loop: false,
      
      // Loading states
      isLoading: false,
      isLoadingVisual: false,
      isSearching: false,
      
      error: null,

      // Actions
      loadVisual: async (visualId: string) => {
        set({ isLoadingVisual: true, error: null });
        
        try {
          const visual = await visualsService.getVisual(visualId);
          
          // Track view
          await visualsService.trackVisualView(visualId);
          
          set({ 
            currentVisual: visual, 
            isLoadingVisual: false,
            duration: visual.duration || 0,
            currentTime: 0,
          });

          // Track analytics
          analyticsService.trackVisualView(visualId, visual.type);
        } catch (error) {
          set({ 
            isLoadingVisual: false, 
            error: error instanceof Error ? error.message : 'Failed to load visual' 
          });
        }
      },

      loadVisualsForPlaylist: async (playlistId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const visuals = await visualsService.getVisualsForPlaylist(playlistId);
          set({ 
            visuals, 
            currentPlaylist: playlistId,
            isLoading: false 
          });

          analyticsService.trackPlaylistVisualLoad(playlistId, visuals.length);
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load playlist visuals' 
          });
        }
      },

      loadVisualsForTrack: async (trackId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const visuals = await visualsService.getVisualsForTrack(trackId);
          set({ visuals, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load track visuals' 
          });
        }
      },

      loadVisualGallery: async (galleryId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const gallery = await visualsService.getVisualGallery(galleryId);
          set({ 
            visuals: gallery.visuals,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load gallery' 
          });
        }
      },

      // Video playback controls
      playVideo: () => {
        set({ isPlaying: true });
        
        const currentVisual = get().currentVisual;
        if (currentVisual) {
          analyticsService.trackVisualPlay(currentVisual.id);
        }
      },

      pauseVideo: () => {
        set({ isPlaying: false });
        
        const currentVisual = get().currentVisual;
        if (currentVisual) {
          analyticsService.trackVisualPause(currentVisual.id, get().currentTime);
        }
      },

      seekToTime: (time: number) => {
        set({ currentTime: time });
        
        const currentVisual = get().currentVisual;
        if (currentVisual) {
          analyticsService.trackVisualSeek(currentVisual.id, time);
        }
      },

      setVolume: (volume: number) => {
        set({ volume: Math.max(0, Math.min(1, volume)) });
      },

      toggleMute: () => {
        set(state => ({ isMuted: !state.isMuted }));
      },

      setPlaybackRate: (playbackRate: number) => {
        set({ playbackRate });
      },

      // Display controls
      toggleFullscreen: () => {
        set(state => ({ isFullscreen: !state.isFullscreen }));
      },

      showControls: () => {
        set({ showControls: true });
      },

      hideControls: () => {
        set({ showControls: false });
      },

      setAutoPlay: (autoPlay: boolean) => {
        set({ autoPlay });
      },

      setLoop: (loop: boolean) => {
        set({ loop });
      },

      // User interactions
      likeVisual: async (visualId: string) => {
        try {
          await visualsService.likeVisual(visualId);
          
          // Update local state
          const state = get();
          
          const updateVisualLike = (visuals: Visual[]) =>
            visuals.map(v => v.id === visualId ? { ...v, isLiked: true, likeCount: v.likeCount + 1 } : v);
          
          set({
            visuals: updateVisualLike(state.visuals),
            searchResults: updateVisualLike(state.searchResults),
            currentVisual: state.currentVisual?.id === visualId 
              ? { ...state.currentVisual, isLiked: true, likeCount: state.currentVisual.likeCount + 1 }
              : state.currentVisual,
          });

          analyticsService.trackVisualLike(visualId);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to like visual' });
        }
      },

      unlikeVisual: async (visualId: string) => {
        try {
          await visualsService.unlikeVisual(visualId);
          
          // Update local state
          const state = get();
          
          const updateVisualUnlike = (visuals: Visual[]) =>
            visuals.map(v => v.id === visualId ? { ...v, isLiked: false, likeCount: Math.max(0, v.likeCount - 1) } : v);
          
          set({
            visuals: updateVisualUnlike(state.visuals),
            searchResults: updateVisualUnlike(state.searchResults),
            likedVisuals: state.likedVisuals.filter(v => v.id !== visualId),
            currentVisual: state.currentVisual?.id === visualId 
              ? { ...state.currentVisual, isLiked: false, likeCount: Math.max(0, state.currentVisual.likeCount - 1) }
              : state.currentVisual,
          });

          analyticsService.trackVisualUnlike(visualId);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to unlike visual' });
        }
      },

      downloadVisual: async (visualId: string, quality: VisualQuality = 'high') => {
        try {
          const downloadInfo = await visualsService.downloadVisual(visualId, quality);
          
          // Update local state
          const state = get();
          
          const updateVisualDownload = (visuals: Visual[]) =>
            visuals.map(v => v.id === visualId ? { ...v, isDownloaded: true } : v);
          
          set({
            visuals: updateVisualDownload(state.visuals),
            searchResults: updateVisualDownload(state.searchResults),
            currentVisual: state.currentVisual?.id === visualId 
              ? { ...state.currentVisual, isDownloaded: true }
              : state.currentVisual,
          });

          analyticsService.trackVisualDownload(visualId, quality, downloadInfo.fileSize);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to download visual' });
        }
      },

      shareVisual: async (visualId: string) => {
        try {
          const shareUrl = await visualsService.shareVisual(visualId);
          analyticsService.trackVisualShare(visualId, 'link');
          return shareUrl;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to share visual' });
          throw error;
        }
      },

      // Search
      searchVisuals: async (query: string) => {
        set({ isSearching: true, searchQuery: query, error: null });
        
        try {
          const results = await visualsService.searchVisuals(query);
          set({ 
            searchResults: results.visuals,
            isSearching: false 
          });

          analyticsService.trackSearch(query, 'visual', results.total);
        } catch (error) {
          set({ 
            isSearching: false, 
            error: error instanceof Error ? error.message : 'Visual search failed' 
          });
        }
      },

      clearSearch: () => {
        set({ 
          searchQuery: '', 
          searchResults: [] 
        });
      },

      // Navigation
      nextVisual: () => {
        const state = get();
        const currentIndex = state.visuals.findIndex(v => v.id === state.currentVisual?.id);
        
        if (currentIndex !== -1 && currentIndex < state.visuals.length - 1) {
          const nextVisual = state.visuals[currentIndex + 1];
          get().setCurrentVisual(nextVisual);
        }
      },

      previousVisual: () => {
        const state = get();
        const currentIndex = state.visuals.findIndex(v => v.id === state.currentVisual?.id);
        
        if (currentIndex > 0) {
          const prevVisual = state.visuals[currentIndex - 1];
          get().setCurrentVisual(prevVisual);
        }
      },

      setCurrentVisual: (visual: Visual) => {
        set({ 
          currentVisual: visual,
          currentTime: 0,
          duration: visual.duration || 0,
          isPlaying: false,
        });
        
        // Track visual change
        analyticsService.trackVisualView(visual.id, visual.type);
      },

      // Gallery management
      createGallery: async (title: string, visualIds: string[]) => {
        try {
          const gallery = await visualsService.createGallery(title);
          await visualsService.addVisualsToGallery(gallery.id, visualIds);
          
          const state = get();
          set({ 
            visualGalleries: [...state.visualGalleries, gallery] 
          });

          analyticsService.trackGalleryCreate(gallery.id, visualIds.length);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create gallery' });
          throw error;
        }
      },

      addToGallery: async (galleryId: string, visualIds: string[]) => {
        try {
          await visualsService.addVisualsToGallery(galleryId, visualIds);
          analyticsService.trackGalleryAddVisuals(galleryId, visualIds.length);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add to gallery' });
          throw error;
        }
      },

      removeFromGallery: async (galleryId: string, visualIds: string[]) => {
        try {
          await visualsService.removeVisualsFromGallery(galleryId, visualIds);
          analyticsService.trackGalleryRemoveVisuals(galleryId, visualIds.length);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove from gallery' });
          throw error;
        }
      },

      // Error handling
      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'visuals-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        // Persist only user preferences and downloaded visuals
        volume: state.volume,
        autoPlay: state.autoPlay,
        loop: state.loop,
        playbackRate: state.playbackRate,
        downloadedVisuals: state.downloadedVisuals,
      }),
    }
  )
);
