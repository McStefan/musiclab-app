// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: SubscriptionPlan;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  preferredQuality: AudioQuality;
  autoDownload: boolean;
  offlineStorageLimit: number; // in MB
  favoriteGenres: string[];
  favoriteMoods: string[];
  favoritePurposes: string[];
}

// Audio types
export type AudioQuality = 'LOW' | 'STD' | 'HI' | 'LOSSLESS';

export interface AudioQualityOption {
  quality: AudioQuality;
  bitrate: string; // e.g., '128 kbps'
  url: string;
}

export interface Track {
  id: string;
  title: string;
  artists: string[];
  durationSec: number;
  qualities: AudioQualityOption[];
  coverUrl?: string;
  visual?: Visual;
  genre?: string;
  mood?: string;
  purpose?: string;
  isLiked?: boolean;
  isDownloaded?: boolean;
  createdAt: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  mood?: string;
  genre?: string;
  purpose?: string;
  tracks: string[]; // Track IDs
  visual?: Visual;
  isLiked?: boolean;
  isDownloaded?: boolean;
  downloadProgress?: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface Visual {
  type: 'video' | 'image';
  url: string;
  thumbnailUrl?: string;
  isLiked?: boolean;
}

// User interactions
export interface UserLike {
  id: string;
  type: 'track' | 'playlist' | 'visual';
  itemId: string;
  createdAt: string;
}

export interface UserDislike {
  id: string;
  trackId: string;
  createdAt: string;
}

// Player types
export interface PlayerState {
  currentTrack?: Track;
  queue: Track[];
  position: number; // Current playback position in seconds
  duration: number; // Track duration in seconds
  isPlaying: boolean;
  isLoading: boolean;
  quality: AudioQuality;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  volume: number; // 0-1
}

export type RepeatMode = 'off' | 'track' | 'queue';

export interface TimerState {
  type: 'pomodoro' | 'sleep';
  isActive: boolean;
  remainingTime: number; // in seconds
  totalTime: number; // in seconds
}

export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesUntilLongBreak: number;
}

// Search and filter types
export interface SearchFilters {
  genre?: string;
  mood?: string;
  purpose?: string;
  contentType?: ContentType;
}

export type ContentType = 'all' | 'tracks' | 'playlists' | 'visuals';

export interface SearchResult {
  tracks: Track[];
  playlists: Playlist[];
  visuals: Visual[];
  totalCount: number;
}

// Subscription types
export type SubscriptionPlan = 'FREE' | 'TRIAL' | 'STANDARD' | 'PREMIUM' | 'FAMILY';

export interface Subscription {
  plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  expiresAt?: string;
  trialStartedAt?: string;
  trialEndsAt?: string;
  autoRenew: boolean;
  paymentMethod?: PaymentMethod;
}

export interface PaymentMethod {
  id: string;
  type: 'stripe' | 'google_play' | 'apple_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface SubscriptionPlanDetails {
  id: SubscriptionPlan;
  name: string;
  price: number;
  currency: string;
  features: string[];
  maxQuality: AudioQuality;
  offlineDownloads: boolean;
  familySharing: boolean;
  adFree: boolean;
}

// Family sharing
export interface FamilyInvite {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedBy: string; // User ID
  createdAt: string;
  expiresAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  isOwner: boolean;
}

// Download management
export interface DownloadItem {
  id: string;
  type: 'track' | 'playlist';
  itemId: string;
  status: 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';
  progress: number; // 0-100
  sizeMB: number;
  downloadedMB: number;
  quality: AudioQuality;
  createdAt: string;
  completedAt?: string;
}

export interface OfflineStorage {
  totalSpaceMB: number;
  usedSpaceMB: number;
  availableSpaceMB: number;
  downloads: DownloadItem[];
}

// Analytics events
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

// API types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  Player: {
    trackId?: string;
    playlistId?: string;
  };
  Paywall: {
    source?: 'trial_expired' | 'feature_locked' | 'quality_upgrade';
  };
};

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  LogIn: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
  };
};

export type AppTabParamList = {
  Home: undefined;
  Search: undefined;
  Library: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  PlaylistDetail: {
    playlistId: string;
  };
  TrackDetail: {
    trackId: string;
  };
};

export type SearchStackParamList = {
  SearchScreen: undefined;
  SearchResults: {
    query: string;
    filters?: SearchFilters;
  };
};

export type LibraryStackParamList = {
  LibraryScreen: undefined;
  LikedTracks: undefined;
  LikedPlaylists: undefined;
  LikedVisuals: undefined;
  Downloads: undefined;
};

export type SettingsStackParamList = {
  SettingsScreen: undefined;
  Profile: undefined;
  Subscription: undefined;
  AudioQuality: undefined;
  OfflineSettings: undefined;
  FamilySharing: undefined;
  About: undefined;
};

// Store types
export interface RootState {
  auth: AuthState;
  player: PlayerState;
  library: LibraryState;
  search: SearchState;
  subscription: SubscriptionState;
  downloads: DownloadState;
  analytics: AnalyticsState;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LibraryState {
  likedTracks: string[];
  likedPlaylists: string[];
  likedVisuals: string[];
  isLoading: boolean;
  error: string | null;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: SearchResult | null;
  recentSearches: string[];
  isLoading: boolean;
  error: string | null;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  availablePlans: SubscriptionPlanDetails[];
  familyMembers: FamilyMember[];
  pendingInvites: FamilyInvite[];
  isLoading: boolean;
  error: string | null;
}

export interface DownloadState {
  storage: OfflineStorage;
  isLoading: boolean;
  error: string | null;
}

export interface AnalyticsState {
  isEnabled: boolean;
  userId: string | null;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
