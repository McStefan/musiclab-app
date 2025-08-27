import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { 
  LikedTrack, 
  LikedPlaylist, 
  LibraryTrack, 
  LibraryPlaylist, 
  DownloadJob, 
  AudioQuality,
  DownloadProgressEvent,
  DownloadCompletedEvent,
  DownloadFailedEvent
} from '../types';

class LibraryService {
  private static instance: LibraryService;
  private downloadQueue: Map<string, DownloadJob> = new Map();
  private progressCallbacks: Map<string, (event: DownloadProgressEvent) => void> = new Map();
  private completedCallbacks: Map<string, (event: DownloadCompletedEvent) => void> = new Map();
  private failedCallbacks: Map<string, (event: DownloadFailedEvent) => void> = new Map();
  
  private downloadsDir: string;
  private metadataFile: string;

  constructor() {
    this.downloadsDir = `${FileSystem.documentDirectory}downloads/`;
    this.metadataFile = `${FileSystem.documentDirectory}library_metadata.json`;
    this.ensureDownloadsDirectory();
  }

  static getInstance(): LibraryService {
    if (!LibraryService.instance) {
      LibraryService.instance = new LibraryService();
    }
    return LibraryService.instance;
  }

  private async ensureDownloadsDirectory(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.downloadsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.downloadsDir, { intermediates: true });
      }
    } catch (error) {
      console.error('Failed to create downloads directory:', error);
    }
  }

  // Mock API calls for liked content
  async getLikedTracks(): Promise<LikedTrack[]> {
    await this.delay(800);
    
    // In real app, this would fetch from API
    return this.generateMockLikedTracks();
  }

  async getLikedPlaylists(): Promise<LikedPlaylist[]> {
    await this.delay(600);
    
    return this.generateMockLikedPlaylists();
  }

  async likeTrack(track: LibraryTrack): Promise<void> {
    await this.delay(300);
    console.log(`Liked track: ${track.title}`);
  }

  async unlikeTrack(trackId: string): Promise<void> {
    await this.delay(300);
    console.log(`Unliked track: ${trackId}`);
  }

  async likePlaylist(playlist: LibraryPlaylist): Promise<void> {
    await this.delay(300);
    console.log(`Liked playlist: ${playlist.title}`);
  }

  async unlikePlaylist(playlistId: string): Promise<void> {
    await this.delay(300);
    console.log(`Unliked playlist: ${playlistId}`);
  }

  // Download management
  async downloadTrack(track: LibraryTrack, quality: AudioQuality = 'high'): Promise<string> {
    const downloadId = `track_${track.id}_${Date.now()}`;
    const fileName = this.sanitizeFileName(`${track.artist} - ${track.title}.mp3`);
    const filePath = `${this.downloadsDir}${fileName}`;

    const downloadJob: DownloadJob = {
      id: downloadId,
      type: 'track',
      itemId: track.id,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork,
      status: 'pending',
      progress: 0,
      totalSize: this.getEstimatedFileSize(track.duration, quality),
      downloadedSize: 0,
      startedAt: new Date().toISOString(),
      quality,
    };

    this.downloadQueue.set(downloadId, downloadJob);
    
    try {
      await this.startDownload(downloadJob, track.url, filePath);
      return downloadId;
    } catch (error) {
      downloadJob.status = 'failed';
      downloadJob.error = error instanceof Error ? error.message : 'Download failed';
      this.notifyDownloadFailed(downloadId, downloadJob.error, true);
      throw error;
    }
  }

  async downloadPlaylist(playlist: LibraryPlaylist, quality: AudioQuality = 'high'): Promise<string> {
    const downloadId = `playlist_${playlist.id}_${Date.now()}`;
    
    const downloadJob: DownloadJob = {
      id: downloadId,
      type: 'playlist',
      itemId: playlist.id,
      title: playlist.title,
      artist: playlist.author,
      artwork: playlist.artwork,
      status: 'pending',
      progress: 0,
      totalSize: this.getEstimatedFileSize(playlist.duration, quality),
      downloadedSize: 0,
      startedAt: new Date().toISOString(),
      quality,
    };

    this.downloadQueue.set(downloadId, downloadJob);
    
    try {
      // In real implementation, this would download all tracks in the playlist
      await this.simulatePlaylistDownload(downloadJob);
      return downloadId;
    } catch (error) {
      downloadJob.status = 'failed';
      downloadJob.error = error instanceof Error ? error.message : 'Playlist download failed';
      this.notifyDownloadFailed(downloadId, downloadJob.error, true);
      throw error;
    }
  }

  private async startDownload(job: DownloadJob, url: string, filePath: string): Promise<void> {
    job.status = 'downloading';
    
    // Create download resumable
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      filePath,
      {},
      (downloadProgress) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } = downloadProgress;
        
        job.downloadedSize = totalBytesWritten;
        job.totalSize = totalBytesExpectedToWrite;
        job.progress = Math.round((totalBytesWritten / totalBytesExpectedToWrite) * 100);
        
        // Calculate speed and ETA
        const now = Date.now();
        const elapsed = now - new Date(job.startedAt).getTime();
        job.speed = totalBytesWritten / (elapsed / 1000); // bytes per second
        job.estimatedTimeRemaining = (totalBytesExpectedToWrite - totalBytesWritten) / job.speed;
        
        this.notifyDownloadProgress(job.id, {
          downloadId: job.id,
          progress: job.progress,
          downloadedSize: job.downloadedSize,
          totalSize: job.totalSize,
          speed: job.speed,
          estimatedTimeRemaining: job.estimatedTimeRemaining,
        });
      }
    );

    try {
      const result = await downloadResumable.downloadAsync();
      
      if (result) {
        job.status = 'completed';
        job.progress = 100;
        job.completedAt = new Date().toISOString();
        
        // Update file metadata
        await this.updateFileMetadata(job, result.uri);
        
        this.notifyDownloadCompleted(job.id, {
          downloadId: job.id,
          itemId: job.itemId,
          type: job.type,
          filePath: result.uri,
          size: job.totalSize,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  private async simulatePlaylistDownload(job: DownloadJob): Promise<void> {
    job.status = 'downloading';
    
    // Simulate playlist download with progress updates
    for (let i = 0; i <= 100; i += 5) {
      await this.delay(200); // Simulate download time
      
      job.progress = i;
      job.downloadedSize = Math.round((job.totalSize * i) / 100);
      
      this.notifyDownloadProgress(job.id, {
        downloadId: job.id,
        progress: job.progress,
        downloadedSize: job.downloadedSize,
        totalSize: job.totalSize,
        speed: 1024 * 1024, // 1 MB/s simulation
        estimatedTimeRemaining: ((100 - i) * 200) / 1000,
      });
      
      if (job.status === 'cancelled' || job.status === 'paused') {
        return;
      }
    }
    
    job.status = 'completed';
    job.completedAt = new Date().toISOString();
    
    this.notifyDownloadCompleted(job.id, {
      downloadId: job.id,
      itemId: job.itemId,
      type: job.type,
      filePath: `${this.downloadsDir}playlist_${job.itemId}`,
      size: job.totalSize,
    });
  }

  async cancelDownload(downloadId: string): Promise<void> {
    const job = this.downloadQueue.get(downloadId);
    if (job) {
      job.status = 'cancelled';
      // In real implementation, would cancel the actual download
      console.log(`Cancelled download: ${downloadId}`);
    }
  }

  async pauseDownload(downloadId: string): Promise<void> {
    const job = this.downloadQueue.get(downloadId);
    if (job) {
      job.status = 'paused';
      console.log(`Paused download: ${downloadId}`);
    }
  }

  async resumeDownload(downloadId: string): Promise<void> {
    const job = this.downloadQueue.get(downloadId);
    if (job) {
      job.status = 'downloading';
      console.log(`Resumed download: ${downloadId}`);
    }
  }

  async retryDownload(downloadId: string): Promise<void> {
    const job = this.downloadQueue.get(downloadId);
    if (job) {
      job.status = 'pending';
      job.progress = 0;
      job.downloadedSize = 0;
      job.error = undefined;
      job.startedAt = new Date().toISOString();
      console.log(`Retrying download: ${downloadId}`);
    }
  }

  // File management
  async removeDownload(itemId: string, type: 'track' | 'playlist'): Promise<void> {
    try {
      const pattern = type === 'track' ? `*${itemId}*` : `playlist_${itemId}`;
      const files = await FileSystem.readDirectoryAsync(this.downloadsDir);
      
      for (const file of files) {
        if (file.includes(itemId)) {
          const filePath = `${this.downloadsDir}${file}`;
          await FileSystem.deleteAsync(filePath);
        }
      }
      
      // Remove from metadata
      await this.removeFromMetadata(itemId, type);
      
      console.log(`Removed ${type} download: ${itemId}`);
    } catch (error) {
      console.error('Failed to remove download:', error);
      throw error;
    }
  }

  async clearAllDownloads(): Promise<void> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.downloadsDir);
      
      for (const file of files) {
        const filePath = `${this.downloadsDir}${file}`;
        await FileSystem.deleteAsync(filePath);
      }
      
      // Clear metadata
      await FileSystem.writeAsStringAsync(this.metadataFile, JSON.stringify({}));
      
      console.log('Cleared all downloads');
    } catch (error) {
      console.error('Failed to clear downloads:', error);
      throw error;
    }
  }

  // Storage management
  async getStorageInfo(): Promise<{ available: number; used: number; total: number }> {
    try {
      if (Platform.OS === 'ios') {
        const freeDiskStorage = await FileSystem.getFreeDiskStorageAsync();
        const totalDiskCapacity = await FileSystem.getTotalDiskCapacityAsync();
        
        return {
          available: freeDiskStorage,
          used: totalDiskCapacity - freeDiskStorage,
          total: totalDiskCapacity,
        };
      } else {
        // Android approximation
        return {
          available: 5 * 1024 * 1024 * 1024, // 5GB mock
          used: 2 * 1024 * 1024 * 1024, // 2GB mock
          total: 8 * 1024 * 1024 * 1024, // 8GB mock
        };
      }
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { available: 0, used: 0, total: 0 };
    }
  }

  async getDownloadedSize(): Promise<number> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.downloadsDir);
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = `${this.downloadsDir}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists && fileInfo.size) {
          totalSize += fileInfo.size;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Failed to calculate downloaded size:', error);
      return 0;
    }
  }

  // Event listeners
  onDownloadProgress(downloadId: string, callback: (event: DownloadProgressEvent) => void): void {
    this.progressCallbacks.set(downloadId, callback);
  }

  onDownloadCompleted(downloadId: string, callback: (event: DownloadCompletedEvent) => void): void {
    this.completedCallbacks.set(downloadId, callback);
  }

  onDownloadFailed(downloadId: string, callback: (event: DownloadFailedEvent) => void): void {
    this.failedCallbacks.set(downloadId, callback);
  }

  removeDownloadListener(downloadId: string): void {
    this.progressCallbacks.delete(downloadId);
    this.completedCallbacks.delete(downloadId);
    this.failedCallbacks.delete(downloadId);
  }

  // Utility methods
  private notifyDownloadProgress(downloadId: string, event: DownloadProgressEvent): void {
    const callback = this.progressCallbacks.get(downloadId);
    if (callback) {
      callback(event);
    }
  }

  private notifyDownloadCompleted(downloadId: string, event: DownloadCompletedEvent): void {
    const callback = this.completedCallbacks.get(downloadId);
    if (callback) {
      callback(event);
    }
  }

  private notifyDownloadFailed(downloadId: string, error: string, retryable: boolean): void {
    const callback = this.failedCallbacks.get(downloadId);
    if (callback) {
      callback({ downloadId, error, retryable });
    }
  }

  private getEstimatedFileSize(duration: number, quality: AudioQuality): number {
    // Estimated file sizes based on quality and duration
    const bitrates = {
      low: 128, // kbps
      medium: 256,
      high: 320,
      lossless: 1411, // CD quality
    };
    
    const bitrate = bitrates[quality];
    return Math.round((duration * bitrate * 1000) / 8); // bytes
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  }

  private async updateFileMetadata(job: DownloadJob, filePath: string): Promise<void> {
    try {
      const metadata = await this.loadMetadata();
      
      if (!metadata.downloads) {
        metadata.downloads = {};
      }
      
      metadata.downloads[job.itemId] = {
        id: job.itemId,
        type: job.type,
        filePath,
        downloadedAt: job.completedAt,
        size: job.totalSize,
        quality: job.quality,
      };
      
      await FileSystem.writeAsStringAsync(this.metadataFile, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to update metadata:', error);
    }
  }

  private async removeFromMetadata(itemId: string, type: 'track' | 'playlist'): Promise<void> {
    try {
      const metadata = await this.loadMetadata();
      
      if (metadata.downloads && metadata.downloads[itemId]) {
        delete metadata.downloads[itemId];
        await FileSystem.writeAsStringAsync(this.metadataFile, JSON.stringify(metadata));
      }
    } catch (error) {
      console.error('Failed to remove from metadata:', error);
    }
  }

  private async loadMetadata(): Promise<any> {
    try {
      const metadataInfo = await FileSystem.getInfoAsync(this.metadataFile);
      
      if (metadataInfo.exists) {
        const content = await FileSystem.readAsStringAsync(this.metadataFile);
        return JSON.parse(content);
      }
      
      return {};
    } catch (error) {
      console.error('Failed to load metadata:', error);
      return {};
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock data generators
  private generateMockLikedTracks(): LikedTrack[] {
    return Array.from({ length: 25 }, (_, i) => ({
      id: `liked_track_${i}`,
      trackId: `track_${i}`,
      track: {
        id: `track_${i}`,
        title: `Liked Track ${i + 1}`,
        artist: `Artist ${i % 5 + 1}`,
        album: `Album ${i % 3 + 1}`,
        artwork: `https://picsum.photos/300/300?random=${i + 200}`,
        url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 16) + 1}.mp3`,
        duration: 180 + (i * 15),
        genre: 'Pop',
        releaseYear: 2020 + (i % 4),
        quality: ['low', 'medium', 'high', 'lossless'],
        isPremium: i % 3 === 0,
        isDownloaded: i % 4 === 0,
        downloadedAt: i % 4 === 0 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
      },
      likedAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));
  }

  private generateMockLikedPlaylists(): LikedPlaylist[] {
    return Array.from({ length: 12 }, (_, i) => ({
      id: `liked_playlist_${i}`,
      playlistId: `playlist_${i}`,
      playlist: {
        id: `playlist_${i}`,
        title: `Liked Playlist ${i + 1}`,
        description: `A wonderful collection of songs`,
        artwork: `https://picsum.photos/300/300?random=${i + 300}`,
        author: `Curator ${i % 3 + 1}`,
        duration: 3600 + (i * 300),
        trackCount: 12 + (i % 8),
        genre: ['Pop', 'Rock', 'Electronic'][i % 3] ? [['Pop', 'Rock', 'Electronic'][i % 3]] : ['Pop'],
        mood: ['Happy', 'Calm', 'Energetic'][i % 3] ? [['Happy', 'Calm', 'Energetic'][i % 3]] : ['Happy'],
        purpose: ['Workout', 'Study', 'Party'][i % 3] ? [['Workout', 'Study', 'Party'][i % 3]] : ['Workout'],
        type: i % 2 === 0 ? 'curated' : 'album',
        isPremium: i % 3 === 0,
        isDownloaded: i % 5 === 0,
        downloadedAt: i % 5 === 0 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
      },
      likedAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));
  }

  getDownloadJobs(): DownloadJob[] {
    return Array.from(this.downloadQueue.values());
  }
}

export const libraryService = LibraryService.getInstance();
