import { useEffect, useCallback } from 'react';
import { 
  usePlaybackState, 
  useProgress, 
  useTrackPlayerEvents,
  Event,
  State 
} from 'react-native-track-player';
import { usePlayerStore } from '../store/playerStore';
import { trackPlayerService, MusicTrack } from '../services/TrackPlayerService';

export const useTrackPlayer = () => {
  const playerStore = usePlayerStore();
  const playbackState = usePlaybackState();
  const progress = useProgress();

  // Listen to track player events
  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackState) {
      playerStore.updatePlaybackState(event.state);
    }
    
    if (event.type === Event.PlaybackTrackChanged) {
      if (event.nextTrack !== undefined) {
        const track = await trackPlayerService.getCurrentTrack();
        playerStore.updateCurrentTrack(track as MusicTrack);
      }
    }
  });

  // Update progress in store
  useEffect(() => {
    playerStore.updateProgress(progress.position, progress.duration);
  }, [progress.position, progress.duration]);

  // Convenience methods
  const isPlaying = playbackState === State.Playing;
  const isLoading = playbackState === State.Loading || playbackState === State.Buffering;
  const isPaused = playbackState === State.Paused;
  const isStopped = playbackState === State.Stopped;

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const getProgressPercentage = useCallback((): number => {
    if (progress.duration === 0) return 0;
    return (progress.position / progress.duration) * 100;
  }, [progress.position, progress.duration]);

  return {
    // State
    isPlaying,
    isLoading,
    isPaused,
    isStopped,
    progress,
    playbackState,
    
    // Store state and actions
    ...playerStore,
    
    // Utility functions
    formatTime,
    getProgressPercentage,
  };
};

export const usePlayerControls = () => {
  const {
    play,
    pause,
    stop,
    skipToNext,
    skipToPrevious,
    seekTo,
    setVolume,
    isPlaying,
    isLoading,
    currentTrack,
  } = useTrackPlayer();

  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  const seekForward = useCallback(async (seconds = 10) => {
    const { position, duration } = useProgress();
    const newPosition = Math.min(position + seconds, duration);
    await seekTo(newPosition);
  }, [seekTo]);

  const seekBackward = useCallback(async (seconds = 10) => {
    const { position } = useProgress();
    const newPosition = Math.max(position - seconds, 0);
    await seekTo(newPosition);
  }, [seekTo]);

  return {
    togglePlayPause,
    play,
    pause,
    stop,
    skipToNext,
    skipToPrevious,
    seekTo,
    seekForward,
    seekBackward,
    setVolume,
    isPlaying,
    isLoading,
    currentTrack,
  };
};

export const useQueue = () => {
  const {
    queue,
    currentTrack,
    addToQueue,
    removeFromQueue,
    moveQueueItem,
    clearQueue,
    loadPlaylist,
  } = usePlayerStore();

  const getCurrentTrackIndex = useCallback((): number => {
    if (!currentTrack) return -1;
    return queue.findIndex(track => track.id === currentTrack.id);
  }, [currentTrack, queue]);

  const getNextTrack = useCallback((): MusicTrack | null => {
    const currentIndex = getCurrentTrackIndex();
    if (currentIndex === -1 || currentIndex === queue.length - 1) return null;
    return queue[currentIndex + 1];
  }, [getCurrentTrackIndex, queue]);

  const getPreviousTrack = useCallback((): MusicTrack | null => {
    const currentIndex = getCurrentTrackIndex();
    if (currentIndex <= 0) return null;
    return queue[currentIndex - 1];
  }, [getCurrentTrackIndex, queue]);

  const getQueueDuration = useCallback((): number => {
    return queue.reduce((total, track) => total + (track.duration || 0), 0);
  }, [queue]);

  return {
    queue,
    currentTrack,
    addToQueue,
    removeFromQueue,
    moveQueueItem,
    clearQueue,
    loadPlaylist,
    getCurrentTrackIndex,
    getNextTrack,
    getPreviousTrack,
    getQueueDuration,
  };
};

export const usePlayerModal = () => {
  const {
    isPlayerModalVisible,
    showPlayerModal,
    hidePlayerModal,
    currentTrack,
  } = usePlayerStore();

  const togglePlayerModal = useCallback(() => {
    if (isPlayerModalVisible) {
      hidePlayerModal();
    } else {
      showPlayerModal();
    }
  }, [isPlayerModalVisible, showPlayerModal, hidePlayerModal]);

  const canShowModal = useCallback((): boolean => {
    return currentTrack !== null;
  }, [currentTrack]);

  return {
    isPlayerModalVisible,
    showPlayerModal,
    hidePlayerModal,
    togglePlayerModal,
    canShowModal,
  };
};

export const useTimers = () => {
  const {
    sleepTimerMinutes,
    setSleepTimer,
    cancelSleepTimer,
    pomodoroEnabled,
    pomodoroMinutes,
    pomodoroBreakMinutes,
    pomodoroSessionCount,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    setPomodoroSettings,
  } = usePlayerStore();

  const getSleepTimerRemaining = useCallback((): number => {
    // This would need to be implemented with actual timer tracking
    return sleepTimerMinutes || 0;
  }, [sleepTimerMinutes]);

  const formatTimerTime = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }, []);

  return {
    sleepTimerMinutes,
    setSleepTimer,
    cancelSleepTimer,
    getSleepTimerRemaining,
    pomodoroEnabled,
    pomodoroMinutes,
    pomodoroBreakMinutes,
    pomodoroSessionCount,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    setPomodoroSettings,
    formatTimerTime,
  };
};
