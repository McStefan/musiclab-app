export type VisualType = 'image' | 'video' | 'gif' | 'animation';

export type VisualQuality = 'low' | 'medium' | 'high' | 'original';

export interface Visual {
  id: string;
  title: string;
  description?: string;
  type: VisualType;
  url: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  
  // Dimensions
  width: number;
  height: number;
  aspectRatio: number;
  
  // File info
  fileSize: number;
  duration?: number; // for videos/gifs in seconds
  format: string; // jpg, png, mp4, gif, etc.
  
  // Metadata
  author?: string;
  tags: string[];
  colors: string[]; // dominant colors extracted from visual
  
  // Relations
  playlistIds: string[]; // плейлисты, к которым привязан визуал
  trackIds?: string[];   // треки, к которым привязан визуал
  
  // User interaction
  isLiked?: boolean;
  isDownloaded?: boolean;
  viewCount: number;
  likeCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Premium content
  isPremium: boolean;
  
  // Different quality versions
  qualities: VisualQualityOption[];
}

export interface VisualQualityOption {
  quality: VisualQuality;
  url: string;
  fileSize: number;
  width: number;
  height: number;
}

export interface VisualGallery {
  id: string;
  title: string;
  description?: string;
  visuals: Visual[];
  coverVisual?: Visual;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VisualState {
  // Current visuals
  currentVisual: Visual | null;
  visuals: Visual[];
  visualGalleries: VisualGallery[];
  
  // User's liked visuals
  likedVisuals: Visual[];
  downloadedVisuals: Visual[];
  
  // Search and filtering
  searchQuery: string;
  searchResults: Visual[];
  
  // Playback state for videos
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  
  // Display settings
  currentPlaylist?: string;
  isFullscreen: boolean;
  showControls: boolean;
  autoPlay: boolean;
  loop: boolean;
  
  // Loading states
  isLoading: boolean;
  isLoadingVisual: boolean;
  isSearching: boolean;
  
  // Error state
  error: string | null;
}

export interface VisualActions {
  // Visual management
  loadVisual: (visualId: string) => Promise<void>;
  loadVisualsForPlaylist: (playlistId: string) => Promise<void>;
  loadVisualsForTrack: (trackId: string) => Promise<void>;
  loadVisualGallery: (galleryId: string) => Promise<void>;
  
  // Playback controls (for videos)
  playVideo: () => void;
  pauseVideo: () => void;
  seekToTime: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  
  // Display controls
  toggleFullscreen: () => void;
  showControls: () => void;
  hideControls: () => void;
  setAutoPlay: (autoPlay: boolean) => void;
  setLoop: (loop: boolean) => void;
  
  // User interactions
  likeVisual: (visualId: string) => Promise<void>;
  unlikeVisual: (visualId: string) => Promise<void>;
  downloadVisual: (visualId: string, quality?: VisualQuality) => Promise<void>;
  shareVisual: (visualId: string) => Promise<string>;
  
  // Search
  searchVisuals: (query: string) => Promise<void>;
  clearSearch: () => void;
  
  // Navigation
  nextVisual: () => void;
  previousVisual: () => void;
  setCurrentVisual: (visual: Visual) => void;
  
  // Gallery management
  createGallery: (title: string, visualIds: string[]) => Promise<void>;
  addToGallery: (galleryId: string, visualIds: string[]) => Promise<void>;
  removeFromGallery: (galleryId: string, visualIds: string[]) => Promise<void>;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type VisualStore = VisualState & VisualActions;

export interface VisualApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface VisualsApiResponse extends VisualApiResponse<Visual[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Visual filters for search/browsing
export interface VisualFilters {
  type?: VisualType[];
  tags?: string[];
  colors?: string[];
  isPremium?: boolean;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'any';
  duration?: {
    min?: number;
    max?: number;
  };
  fileSize?: {
    min?: number;
    max?: number;
  };
  resolution?: {
    min?: { width: number; height: number };
    max?: { width: number; height: number };
  };
}
