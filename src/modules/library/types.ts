export interface LikedTrack {
  id: string;
  trackId: string;
  track: LibraryTrack;
  likedAt: string;
  playlistId?: string;
  playlistName?: string;
}

export interface LikedPlaylist {
  id: string;
  playlistId: string;
  playlist: LibraryPlaylist;
  likedAt: string;
}

export interface LibraryTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  url: string;
  duration: number;
  genre?: string;
  releaseYear?: number;
  quality: AudioQuality[];
  isPremium: boolean;
  isDownloaded: boolean;
  downloadedAt?: string;
  downloadPath?: string;
  downloadSize?: number; // in bytes
}

export interface LibraryPlaylist {
  id: string;
  title: string;
  description?: string;
  artwork?: string;
  author: string;
  duration: number;
  trackCount: number;
  genre: string[];
  mood: string[];
  purpose: string[];
  type: PlaylistType;
  isPremium: boolean;
  isDownloaded: boolean;
  downloadedAt?: string;
  downloadProgress?: number; // 0-100
  downloadSize?: number;
}

export interface DownloadJob {
  id: string;
  type: 'track' | 'playlist';
  itemId: string;
  title: string;
  artist?: string;
  artwork?: string;
  status: DownloadStatus;
  progress: number; // 0-100
  totalSize: number;
  downloadedSize: number;
  speed?: number; // bytes per second
  estimatedTimeRemaining?: number; // seconds
  startedAt: string;
  completedAt?: string;
  error?: string;
  quality: AudioQuality;
}

export type DownloadStatus = 
  | 'pending'
  | 'downloading'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type AudioQuality = 'low' | 'medium' | 'high' | 'lossless';
export type PlaylistType = 'album' | 'compilation' | 'curated' | 'user' | 'generated';

export interface LibraryState {
  // Liked content
  likedTracks: LikedTrack[];
  likedPlaylists: LikedPlaylist[];
  
  // Downloads
  downloadedTracks: LibraryTrack[];
  downloadedPlaylists: LibraryPlaylist[];
  downloadJobs: DownloadJob[];
  totalDownloadSize: number;
  
  // Offline mode
  isOfflineMode: boolean;
  offlineQuality: AudioQuality;
  maxDownloadSize: number; // in GB
  downloadOverWifiOnly: boolean;
  
  // UI state
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  selectedTab: LibraryTab;
  
  // Storage info
  availableStorage: number;
  usedStorage: number;
  totalStorage: number;
}

export type LibraryTab = 'liked' | 'downloads' | 'recently_played' | 'created';

export interface LibraryActions {
  // Liked content
  likeTrack: (track: LibraryTrack) => Promise<void>;
  unlikeTrack: (trackId: string) => Promise<void>;
  likePlaylist: (playlist: LibraryPlaylist) => Promise<void>;
  unlikePlaylist: (playlistId: string) => Promise<void>;
  
  // Downloads
  downloadTrack: (track: LibraryTrack, quality?: AudioQuality) => Promise<void>;
  downloadPlaylist: (playlist: LibraryPlaylist, quality?: AudioQuality) => Promise<void>;
  cancelDownload: (downloadId: string) => Promise<void>;
  pauseDownload: (downloadId: string) => Promise<void>;
  resumeDownload: (downloadId: string) => Promise<void>;
  retryDownload: (downloadId: string) => Promise<void>;
  
  // Offline management
  removeDownload: (itemId: string, type: 'track' | 'playlist') => Promise<void>;
  clearAllDownloads: () => Promise<void>;
  setOfflineMode: (enabled: boolean) => void;
  setOfflineQuality: (quality: AudioQuality) => void;
  setMaxDownloadSize: (sizeGB: number) => void;
  setDownloadOverWifiOnly: (wifiOnly: boolean) => void;
  
  // Data loading
  loadLikedContent: () => Promise<void>;
  loadDownloads: () => Promise<void>;
  refresh: () => Promise<void>;
  
  // UI
  setSelectedTab: (tab: LibraryTab) => void;
  
  // Storage
  checkStorageSpace: () => Promise<void>;
  cleanupOldDownloads: () => Promise<void>;
  
  // Sync
  syncWithCloud: () => Promise<void>;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type LibraryStore = LibraryState & LibraryActions;

// Download progress event
export interface DownloadProgressEvent {
  downloadId: string;
  progress: number;
  downloadedSize: number;
  totalSize: number;
  speed: number;
  estimatedTimeRemaining: number;
}

// Download completed event
export interface DownloadCompletedEvent {
  downloadId: string;
  itemId: string;
  type: 'track' | 'playlist';
  filePath: string;
  size: number;
}

// Download failed event
export interface DownloadFailedEvent {
  downloadId: string;
  error: string;
  retryable: boolean;
}

// Filter options for library
export interface LibraryFilters {
  searchQuery: string;
  genres: string[];
  artists: string[];
  albums: string[];
  downloadStatus: ('downloaded' | 'not_downloaded')[];
  quality: AudioQuality[];
  sortBy: LibrarySortOption;
  sortOrder: 'asc' | 'desc';
}

export type LibrarySortOption = 
  | 'date_added'
  | 'title'
  | 'artist'
  | 'album'
  | 'duration'
  | 'play_count'
  | 'download_date';

// Recently played
export interface RecentlyPlayedTrack {
  id: string;
  track: LibraryTrack;
  playedAt: string;
  playCount: number;
  lastPosition: number; // in seconds
  completedListening: boolean;
}

// User created playlists
export interface UserPlaylist {
  id: string;
  title: string;
  description?: string;
  artwork?: string;
  trackIds: string[];
  tracks?: LibraryTrack[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  playCount: number;
  duration: number;
  trackCount: number;
}

// Export/Import
export interface LibraryExport {
  version: string;
  exportedAt: string;
  likedTracks: LikedTrack[];
  likedPlaylists: LikedPlaylist[];
  userPlaylists: UserPlaylist[];
  recentlyPlayed: RecentlyPlayedTrack[];
  settings: {
    offlineQuality: AudioQuality;
    maxDownloadSize: number;
    downloadOverWifiOnly: boolean;
  };
}

// Statistics
export interface LibraryStats {
  totalLikedTracks: number;
  totalLikedPlaylists: number;
  totalDownloadedTracks: number;
  totalDownloadedPlaylists: number;
  totalDownloadSize: number;
  totalPlayTime: number;
  topGenres: { genre: string; count: number }[];
  topArtists: { artist: string; count: number }[];
  mostPlayedTracks: { track: LibraryTrack; playCount: number }[];
  downloadHistory: { date: string; itemsDownloaded: number; sizeDownloaded: number }[];
}
