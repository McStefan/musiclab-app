import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { State, RepeatMode } from 'react-native-track-player';
import { trackPlayerService, MusicTrack } from '../services/TrackPlayerService';
import { mmkvStorage } from '../../../store/mmkvStorage';

export interface PlayerState {
  // Playback state
  currentTrack: MusicTrack | null;
  queue: MusicTrack[];
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  volume: number;
  
  // Player modes
  repeatMode: RepeatMode;
  isShuffled: boolean;
  crossfadeEnabled: boolean;
  crossfadeDuration: number;
  
  // Timers
  sleepTimerMinutes: number | null;
  pomodoroEnabled: boolean;
  pomodoroMinutes: number;
  pomodoroBreakMinutes: number;
  pomodoroSessionCount: number;
  
  // User feedback
  dislikedTracks: string[]; // Track IDs that user disliked
  recentDislikes: { trackId: string; timestamp: number }[]; // For analytics
  skipOnDislike: boolean; // Auto-skip when track is disliked
  
  // UI state
  isPlayerModalVisible: boolean;
  isQueueVisible: boolean;
  error: string | null;
  
  // Preferences (persisted)
  audioQuality: 'low' | 'medium' | 'high' | 'lossless';
  gaplessPlayback: boolean;
  autoPlay: boolean;
  showLyrics: boolean;
}

export interface PlayerActions {
  // Playback controls
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  
  // Queue management
  playTrack: (track: MusicTrack) => Promise<void>;
  loadPlaylist: (tracks: MusicTrack[], startIndex?: number) => Promise<void>;
  addToQueue: (tracks: MusicTrack[]) => Promise<void>;
  removeFromQueue: (index: number) => Promise<void>;
  moveQueueItem: (fromIndex: number, toIndex: number) => Promise<void>;
  clearQueue: () => Promise<void>;
  
  // Player modes
  setRepeatMode: (mode: RepeatMode) => Promise<void>;
  toggleShuffle: () => Promise<void>;
  setCrossfade: (enabled: boolean, duration?: number) => Promise<void>;
  
  // Timers
  setSleepTimer: (minutes: number) => Promise<void>;
  cancelSleepTimer: () => Promise<void>;
  startPomodoro: () => Promise<void>;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  setPomodoroSettings: (workMinutes: number, breakMinutes: number) => void;
  
  // UI controls
  showPlayerModal: () => void;
  hidePlayerModal: () => void;
  showQueue: () => void;
  hideQueue: () => void;
  
  // Player state updates (called by event listeners)
  updatePlaybackState: (state: State) => void;
  updateProgress: (position: number, duration: number) => void;
  updateCurrentTrack: (track: MusicTrack | null) => void;
  
  // User feedback (likes/dislikes)
  dislikeTrack: (trackId?: string) => Promise<void>;
  undoDislike: (trackId: string) => Promise<void>;
  isTrackDisliked: (trackId: string) => boolean;
  clearDislikedTracks: () => void;
  setSkipOnDislike: (enabled: boolean) => void;
  
  // Settings
  setAudioQuality: (quality: 'low' | 'medium' | 'high' | 'lossless') => void;
  setGaplessPlayback: (enabled: boolean) => void;
  setAutoPlay: (enabled: boolean) => void;
  setShowLyrics: (enabled: boolean) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type PlayerStore = PlayerState & PlayerActions;

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTrack: null,
      queue: [],
      isPlaying: false,
      isLoading: false,
      position: 0,
      duration: 0,
      volume: 1,
      
      repeatMode: RepeatMode.Off,
      isShuffled: false,
      crossfadeEnabled: false,
      crossfadeDuration: 3000,
      
      sleepTimerMinutes: null,
      pomodoroEnabled: false,
      pomodoroMinutes: 25,
      pomodoroBreakMinutes: 5,
      pomodoroSessionCount: 0,
      
      // User feedback initial state
      dislikedTracks: [],
      recentDislikes: [],
      skipOnDislike: true, // Default to auto-skip disliked tracks
      
      isPlayerModalVisible: false,
      isQueueVisible: false,
      error: null,
      
      // Persisted preferences
      audioQuality: 'high',
      gaplessPlayback: true,
      autoPlay: true,
      showLyrics: false,

      // Actions
      play: async () => {
        try {
          set({ isLoading: true, error: null });
          await trackPlayerService.play();
          set({ isPlaying: true, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to play' 
          });
        }
      },

      pause: async () => {
        try {
          await trackPlayerService.pause();
          set({ isPlaying: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to pause' });
        }
      },

      stop: async () => {
        try {
          await trackPlayerService.stop();
          set({ isPlaying: false, position: 0 });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to stop' });
        }
      },

      skipToNext: async () => {
        try {
          await trackPlayerService.skipToNext();
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to skip' });
        }
      },

      skipToPrevious: async () => {
        try {
          await trackPlayerService.skipToPrevious();
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to skip' });
        }
      },

      seekTo: async (position: number) => {
        try {
          await trackPlayerService.seekTo(position);
          set({ position });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to seek' });
        }
      },

      setVolume: async (volume: number) => {
        try {
          await trackPlayerService.setVolume(volume);
          set({ volume });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to set volume' });
        }
      },

      playTrack: async (track: MusicTrack) => {
        try {
          set({ isLoading: true, error: null });
          await trackPlayerService.playTrack(track);
          set({ 
            currentTrack: track, 
            queue: [track], 
            isPlaying: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to play track' 
          });
        }
      },

      loadPlaylist: async (tracks: MusicTrack[], startIndex = 0) => {
        try {
          set({ isLoading: true, error: null });
          await trackPlayerService.loadPlaylist(tracks, startIndex);
          set({ 
            queue: tracks, 
            currentTrack: tracks[startIndex] || null,
            isPlaying: true,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load playlist' 
          });
        }
      },

      addToQueue: async (tracks: MusicTrack[]) => {
        try {
          await trackPlayerService.addToQueue(tracks);
          const currentQueue = get().queue;
          set({ queue: [...currentQueue, ...tracks] });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add to queue' });
        }
      },

      removeFromQueue: async (index: number) => {
        try {
          await trackPlayerService.removeFromQueue(index);
          const currentQueue = get().queue;
          const newQueue = [...currentQueue];
          newQueue.splice(index, 1);
          set({ queue: newQueue });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove from queue' });
        }
      },

      moveQueueItem: async (fromIndex: number, toIndex: number) => {
        try {
          await trackPlayerService.moveQueueItem(fromIndex, toIndex);
          const currentQueue = get().queue;
          const newQueue = [...currentQueue];
          const [movedItem] = newQueue.splice(fromIndex, 1);
          newQueue.splice(toIndex, 0, movedItem);
          set({ queue: newQueue });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to move queue item' });
        }
      },

      clearQueue: async () => {
        try {
          await trackPlayerService.stop();
          set({ queue: [], currentTrack: null, isPlaying: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to clear queue' });
        }
      },

      setRepeatMode: async (mode: RepeatMode) => {
        try {
          await trackPlayerService.setRepeatMode(mode);
          set({ repeatMode: mode });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to set repeat mode' });
        }
      },

      toggleShuffle: async () => {
        try {
          const currentShuffle = get().isShuffled;
          await trackPlayerService.shuffle(!currentShuffle);
          set({ isShuffled: !currentShuffle });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to toggle shuffle' });
        }
      },

      setCrossfade: async (enabled: boolean, duration = 3000) => {
        try {
          await trackPlayerService.setCrossfade(enabled, duration);
          set({ crossfadeEnabled: enabled, crossfadeDuration: duration });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to set crossfade' });
        }
      },

      setSleepTimer: async (minutes: number) => {
        try {
          await trackPlayerService.setSleepTimer(minutes);
          set({ sleepTimerMinutes: minutes });
          
          // Auto-clear after timer expires
          setTimeout(() => {
            set({ sleepTimerMinutes: null });
          }, minutes * 60 * 1000);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to set sleep timer' });
        }
      },

      cancelSleepTimer: async () => {
        try {
          await trackPlayerService.cancelSleepTimer();
          set({ sleepTimerMinutes: null });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to cancel sleep timer' });
        }
      },

      startPomodoro: async () => {
        const { pomodoroMinutes } = get();
        set({ pomodoroEnabled: true });
        
        // Start work session
        setTimeout(() => {
          const { pomodoroBreakMinutes, pomodoroSessionCount } = get();
          set({ 
            pomodoroSessionCount: pomodoroSessionCount + 1,
            pomodoroEnabled: false 
          });
          
          // Auto-pause music for break
          get().pause();
          
          // Start break timer
          setTimeout(() => {
            // Auto-resume after break
            if (get().autoPlay) {
              get().play();
            }
          }, pomodoroBreakMinutes * 60 * 1000);
          
        }, pomodoroMinutes * 60 * 1000);
      },

      pausePomodoro: () => {
        set({ pomodoroEnabled: false });
      },

      resetPomodoro: () => {
        set({ pomodoroEnabled: false, pomodoroSessionCount: 0 });
      },

      setPomodoroSettings: (workMinutes: number, breakMinutes: number) => {
        set({ pomodoroMinutes: workMinutes, pomodoroBreakMinutes: breakMinutes });
      },

      showPlayerModal: () => set({ isPlayerModalVisible: true }),
      hidePlayerModal: () => set({ isPlayerModalVisible: false }),
      showQueue: () => set({ isQueueVisible: true }),
      hideQueue: () => set({ isQueueVisible: false }),

      updatePlaybackState: (state: State) => {
        set({ isPlaying: state === State.Playing });
      },

      updateProgress: (position: number, duration: number) => {
        set({ position, duration });
      },

      updateCurrentTrack: (track: MusicTrack | null) => {
        set({ currentTrack: track });
      },

      // User feedback actions
      dislikeTrack: async (trackId?: string) => {
        const state = get();
        const targetTrackId = trackId || state.currentTrack?.id;
        
        if (!targetTrackId) {
          console.warn('No track to dislike');
          return;
        }

        try {
          // Add to disliked tracks
          const dislikedTracks = [...state.dislikedTracks];
          if (!dislikedTracks.includes(targetTrackId)) {
            dislikedTracks.push(targetTrackId);
          }

          // Add to recent dislikes for analytics
          const recentDislikes = [
            { trackId: targetTrackId, timestamp: Date.now() },
            ...state.recentDislikes.slice(0, 49), // Keep last 50
          ];

          set({ dislikedTracks, recentDislikes });

          // Skip to next track if auto-skip is enabled and this is current track
          if (state.skipOnDislike && targetTrackId === state.currentTrack?.id) {
            await get().skipToNext();
          }

          // Send dislike to API
          // await apiClient.post(`/tracks/${targetTrackId}/dislike`);
          
          console.log(`Track ${targetTrackId} disliked`);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to dislike track' });
        }
      },

      undoDislike: async (trackId: string) => {
        try {
          const state = get();
          const dislikedTracks = state.dislikedTracks.filter(id => id !== trackId);
          set({ dislikedTracks });

          // Send undo dislike to API
          // await apiClient.delete(`/tracks/${trackId}/dislike`);
          
          console.log(`Dislike removed from track ${trackId}`);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to undo dislike' });
        }
      },

      isTrackDisliked: (trackId: string) => {
        return get().dislikedTracks.includes(trackId);
      },

      clearDislikedTracks: () => {
        set({ dislikedTracks: [], recentDislikes: [] });
      },

      setSkipOnDislike: (enabled: boolean) => {
        set({ skipOnDislike: enabled });
      },

      setAudioQuality: (quality) => set({ audioQuality: quality }),
      setGaplessPlayback: (enabled) => set({ gaplessPlayback: enabled }),
      setAutoPlay: (enabled) => set({ autoPlay: enabled }),
      setShowLyrics: (enabled) => set({ showLyrics: enabled }),

      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'player-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        // Only persist user preferences
        volume: state.volume,
        repeatMode: state.repeatMode,
        crossfadeEnabled: state.crossfadeEnabled,
        crossfadeDuration: state.crossfadeDuration,
        audioQuality: state.audioQuality,
        gaplessPlayback: state.gaplessPlayback,
        autoPlay: state.autoPlay,
        showLyrics: state.showLyrics,
        pomodoroMinutes: state.pomodoroMinutes,
        pomodoroBreakMinutes: state.pomodoroBreakMinutes,
        // Persist user feedback preferences
        dislikedTracks: state.dislikedTracks,
        skipOnDislike: state.skipOnDislike,
      }),
    }
  )
);
