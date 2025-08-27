import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  State,
  Event,
  Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { Platform } from 'react-native';

export interface MusicTrack extends Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  url: string;
  duration?: number;
  genre?: string;
  releaseYear?: number;
  playlistId?: string;
  liked?: boolean;
  offline?: boolean;
  quality?: 'low' | 'medium' | 'high' | 'lossless';
}

class TrackPlayerService {
  private static instance: TrackPlayerService;
  private isInitialized = false;
  private currentPlaylist: MusicTrack[] = [];
  private crossfadeEnabled = false;
  private crossfadeDuration = 3000; // 3 seconds

  static getInstance(): TrackPlayerService {
    if (!TrackPlayerService.instance) {
      TrackPlayerService.instance = new TrackPlayerService();
    }
    return TrackPlayerService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await TrackPlayer.setupPlayer({
        maxCacheSize: 1024 * 10, // 10 MB cache
        iosCategory: 'playback',
        iosShowCategory: true,
      });

      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        progressUpdateEventInterval: 1,
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('TrackPlayer initialization failed:', error);
      throw error;
    }
  }

  async loadPlaylist(tracks: MusicTrack[], startIndex = 0): Promise<void> {
    try {
      await this.initialize();
      await TrackPlayer.reset();
      
      this.currentPlaylist = tracks;
      await TrackPlayer.add(tracks);
      
      if (startIndex > 0 && startIndex < tracks.length) {
        await TrackPlayer.skip(startIndex);
      }
    } catch (error) {
      console.error('Failed to load playlist:', error);
      throw error;
    }
  }

  async playTrack(track: MusicTrack): Promise<void> {
    try {
      await this.initialize();
      await TrackPlayer.reset();
      await TrackPlayer.add([track]);
      await TrackPlayer.play();
    } catch (error) {
      console.error('Failed to play track:', error);
      throw error;
    }
  }

  async addToQueue(tracks: MusicTrack[]): Promise<void> {
    try {
      await TrackPlayer.add(tracks);
      this.currentPlaylist.push(...tracks);
    } catch (error) {
      console.error('Failed to add to queue:', error);
      throw error;
    }
  }

  async play(): Promise<void> {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error('Failed to play:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error('Failed to pause:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await TrackPlayer.stop();
    } catch (error) {
      console.error('Failed to stop:', error);
      throw error;
    }
  }

  async skipToNext(): Promise<void> {
    try {
      if (this.crossfadeEnabled) {
        await this.crossfadeToNext();
      } else {
        await TrackPlayer.skipToNext();
      }
    } catch (error) {
      console.error('Failed to skip to next:', error);
      throw error;
    }
  }

  async skipToPrevious(): Promise<void> {
    try {
      if (this.crossfadeEnabled) {
        await this.crossfadeToPrevious();
      } else {
        await TrackPlayer.skipToPrevious();
      }
    } catch (error) {
      console.error('Failed to skip to previous:', error);
      throw error;
    }
  }

  async seekTo(position: number): Promise<void> {
    try {
      await TrackPlayer.seekTo(position);
    } catch (error) {
      console.error('Failed to seek:', error);
      throw error;
    }
  }

  async setVolume(volume: number): Promise<void> {
    try {
      await TrackPlayer.setVolume(volume);
    } catch (error) {
      console.error('Failed to set volume:', error);
      throw error;
    }
  }

  async setRepeatMode(mode: RepeatMode): Promise<void> {
    try {
      await TrackPlayer.setRepeatMode(mode);
    } catch (error) {
      console.error('Failed to set repeat mode:', error);
      throw error;
    }
  }

  async shuffle(enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        const queue = await TrackPlayer.getQueue();
        const currentTrack = await TrackPlayer.getCurrentTrack();
        
        // Shuffle implementation
        const shuffled = this.shuffleArray([...queue]);
        await TrackPlayer.reset();
        await TrackPlayer.add(shuffled);
        
        if (currentTrack !== null) {
          const currentIndex = shuffled.findIndex(track => track.id === queue[currentTrack].id);
          if (currentIndex >= 0) {
            await TrackPlayer.skip(currentIndex);
          }
        }
      } else {
        // Restore original order
        await TrackPlayer.reset();
        await TrackPlayer.add(this.currentPlaylist);
      }
    } catch (error) {
      console.error('Failed to shuffle:', error);
      throw error;
    }
  }

  // Crossfade functionality
  async setCrossfade(enabled: boolean, duration = 3000): Promise<void> {
    this.crossfadeEnabled = enabled;
    this.crossfadeDuration = duration;
  }

  private async crossfadeToNext(): Promise<void> {
    // Simplified crossfade - in production would need more complex audio mixing
    const fadeSteps = 20;
    const stepDuration = this.crossfadeDuration / fadeSteps;
    
    for (let i = 0; i < fadeSteps; i++) {
      const volume = 1 - (i / fadeSteps);
      await TrackPlayer.setVolume(volume);
      await new Promise(resolve => setTimeout(resolve, stepDuration / fadeSteps));
    }
    
    await TrackPlayer.skipToNext();
    
    for (let i = 0; i < fadeSteps; i++) {
      const volume = i / fadeSteps;
      await TrackPlayer.setVolume(volume);
      await new Promise(resolve => setTimeout(resolve, stepDuration / fadeSteps));
    }
  }

  private async crossfadeToPrevious(): Promise<void> {
    const fadeSteps = 20;
    const stepDuration = this.crossfadeDuration / fadeSteps;
    
    for (let i = 0; i < fadeSteps; i++) {
      const volume = 1 - (i / fadeSteps);
      await TrackPlayer.setVolume(volume);
      await new Promise(resolve => setTimeout(resolve, stepDuration / fadeSteps));
    }
    
    await TrackPlayer.skipToPrevious();
    
    for (let i = 0; i < fadeSteps; i++) {
      const volume = i / fadeSteps;
      await TrackPlayer.setVolume(volume);
      await new Promise(resolve => setTimeout(resolve, stepDuration / fadeSteps));
    }
  }

  // Utility methods
  async getCurrentTrack(): Promise<Track | null> {
    try {
      const index = await TrackPlayer.getCurrentTrack();
      if (index === null) return null;
      
      const queue = await TrackPlayer.getQueue();
      return queue[index] || null;
    } catch (error) {
      console.error('Failed to get current track:', error);
      return null;
    }
  }

  async getQueue(): Promise<Track[]> {
    try {
      return await TrackPlayer.getQueue();
    } catch (error) {
      console.error('Failed to get queue:', error);
      return [];
    }
  }

  async removeFromQueue(index: number): Promise<void> {
    try {
      await TrackPlayer.remove([index]);
      this.currentPlaylist.splice(index, 1);
    } catch (error) {
      console.error('Failed to remove from queue:', error);
      throw error;
    }
  }

  async moveQueueItem(fromIndex: number, toIndex: number): Promise<void> {
    try {
      await TrackPlayer.move(fromIndex, toIndex);
      // Update local playlist
      const [movedItem] = this.currentPlaylist.splice(fromIndex, 1);
      this.currentPlaylist.splice(toIndex, 0, movedItem);
    } catch (error) {
      console.error('Failed to move queue item:', error);
      throw error;
    }
  }

  // Timer functionality
  async setSleepTimer(minutes: number): Promise<void> {
    const timeout = setTimeout(async () => {
      await this.fadeOutAndStop();
    }, minutes * 60 * 1000);

    // Store timer reference for cancellation
    (this as any).sleepTimer = timeout;
  }

  async cancelSleepTimer(): Promise<void> {
    if ((this as any).sleepTimer) {
      clearTimeout((this as any).sleepTimer);
      (this as any).sleepTimer = null;
    }
  }

  private async fadeOutAndStop(): Promise<void> {
    const fadeSteps = 30;
    const stepDuration = 3000 / fadeSteps; // 3 second fade out
    
    for (let i = 0; i < fadeSteps; i++) {
      const volume = 1 - (i / fadeSteps);
      await TrackPlayer.setVolume(volume);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
    
    await TrackPlayer.stop();
    await TrackPlayer.setVolume(1); // Reset volume
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Cleanup
  async destroy(): Promise<void> {
    try {
      await this.cancelSleepTimer();
      await TrackPlayer.destroy();
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to destroy TrackPlayer:', error);
    }
  }
}

export const trackPlayerService = TrackPlayerService.getInstance();
