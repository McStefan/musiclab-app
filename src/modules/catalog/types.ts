export interface Playlist {
  id: string;
  title: string;
  description?: string;
  artwork?: string;
  author: string;
  duration: number; // in seconds
  trackCount: number;
  genre: string[];
  mood: string[];
  purpose: string[];
  type: PlaylistType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  isDownloaded?: boolean;
  playCount: number;
  shareUrl?: string;
  isPremium: boolean;
  tracks?: CatalogTrack[];
}

export interface CatalogTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  url: string;
  duration: number;
  genre?: string;
  releaseYear?: number;
  playlistId?: string;
  isLiked?: boolean;
  isDownloaded?: boolean;
  quality: AudioQuality[];
  isPremium: boolean;
  lyrics?: TrackLyrics;
  waveform?: number[];
}

export interface TrackLyrics {
  id: string;
  trackId: string;
  lyrics: LyricLine[];
  language: string;
  isTimeSynced: boolean;
}

export interface LyricLine {
  timestamp: number; // in milliseconds
  text: string;
  duration?: number;
}

export type PlaylistType = 'album' | 'compilation' | 'curated' | 'user' | 'generated';
export type AudioQuality = 'low' | 'medium' | 'high' | 'lossless';

export interface SearchFilters {
  query: string;
  genres: string[];
  moods: string[];
  purposes: string[];
  types: PlaylistType[];
  audioQuality: AudioQuality[];
  isPremiumOnly: boolean;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export type SortOption = 
  | 'relevance'
  | 'popularity'
  | 'newest'
  | 'oldest'
  | 'title'
  | 'duration'
  | 'trackCount';

export interface SearchResult {
  playlists: Playlist[];
  tracks: CatalogTrack[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface CatalogState {
  // Search
  searchQuery: string;
  filters: SearchFilters;
  searchResults: SearchResult | null;
  isSearching: boolean;
  searchHistory: string[];
  
  // Featured content
  featuredPlaylists: Playlist[];
  newReleases: Playlist[];
  trendingPlaylists: Playlist[];
  recommendedPlaylists: Playlist[];
  
  // Categories
  genres: Category[];
  moods: Category[];
  purposes: Category[];
  
  // Current selection
  selectedPlaylist: Playlist | null;
  playlistTracks: CatalogTrack[];
  isLoadingPlaylist: boolean;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  refreshing: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  playlistCount: number;
}

export interface CatalogActions {
  // Search
  setSearchQuery: (query: string) => void;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  search: (query?: string) => Promise<void>;
  searchWithFilters: (globalFilters: import('../../types/filters').FilterOptions, query?: string) => Promise<void>;
  clearSearch: () => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  // Load data
  loadFeaturedContent: () => Promise<void>;
  loadPlaylist: (playlistId: string) => Promise<void>;
  loadPlaylistTracks: (playlistId: string) => Promise<void>;
  loadMoreSearchResults: () => Promise<void>;
  
  // Refresh
  refresh: () => Promise<void>;
  
  // Categories
  loadCategories: () => Promise<void>;
  searchByCategory: (category: Category, type: 'genre' | 'mood' | 'purpose') => Promise<void>;
  
  // Playlist actions
  likePlaylist: (playlistId: string) => Promise<void>;
  unlikePlaylist: (playlistId: string) => Promise<void>;
  downloadPlaylist: (playlistId: string) => Promise<void>;
  sharePlaylist: (playlistId: string) => Promise<string>;
  
  // Track actions
  likeTrack: (trackId: string) => Promise<void>;
  unlikeTrack: (trackId: string) => Promise<void>;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type CatalogStore = CatalogState & CatalogActions;

// API Response Types
export interface CatalogApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    nextCursor?: string;
  };
  success: boolean;
  message?: string;
}

export interface PlaylistApiResponse extends CatalogApiResponse<Playlist[]> {}
export interface TrackApiResponse extends CatalogApiResponse<CatalogTrack[]> {}
export interface SearchApiResponse extends CatalogApiResponse<SearchResult> {}

// Filter Options
export const GENRE_OPTIONS = [
  'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical',
  'R&B', 'Country', 'Folk', 'Reggae', 'Blues', 'Ambient',
  'Techno', 'House', 'Dubstep', 'Indie', 'Alternative', 'Punk'
] as const;

export const MOOD_OPTIONS = [
  'Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Aggressive',
  'Melancholic', 'Uplifting', 'Dark', 'Nostalgic', 'Dreamy', 'Intense',
  'Peaceful', 'Motivational', 'Mysterious', 'Playful', 'Emotional', 'Groovy'
] as const;

export const PURPOSE_OPTIONS = [
  'Workout', 'Study', 'Work', 'Sleep', 'Meditation', 'Party',
  'Road Trip', 'Cooking', 'Gaming', 'Reading', 'Shower', 'Morning',
  'Evening', 'Focus', 'Relaxation', 'Dancing', 'Running', 'Yoga'
] as const;

export const AUDIO_QUALITY_OPTIONS = [
  { label: '128 kbps', value: 'low' as AudioQuality },
  { label: '256 kbps', value: 'medium' as AudioQuality },
  { label: '320 kbps', value: 'high' as AudioQuality },
  { label: 'Lossless', value: 'lossless' as AudioQuality },
] as const;

export const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' as SortOption },
  { label: 'Popularity', value: 'popularity' as SortOption },
  { label: 'Newest', value: 'newest' as SortOption },
  { label: 'Oldest', value: 'oldest' as SortOption },
  { label: 'Title A-Z', value: 'title' as SortOption },
  { label: 'Duration', value: 'duration' as SortOption },
  { label: 'Track Count', value: 'trackCount' as SortOption },
] as const;
