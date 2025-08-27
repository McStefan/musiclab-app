# MusicLab Architecture

## Overview

MusicLab is built using a modular architecture with clear separation of concerns. The app follows React Native best practices with TypeScript for type safety and scalability.

## Core Architecture Principles

### 1. Modular Design
- **Feature Modules**: Each major feature (auth, player, catalog) is self-contained
- **Shared UI Components**: Reusable design system components
- **Clean Interfaces**: Well-defined APIs between modules

### 2. State Management Strategy
- **Zustand**: Local app state (user, player, UI)
- **React Query**: Server state, caching, and synchronization
- **MMKV**: Encrypted persistent storage for sensitive data
- **AsyncStorage**: Non-sensitive local data

### 3. Layered Architecture

```
┌─────────────────────────────────────────┐
│              Presentation Layer          │
│  (Screens, Navigation, UI Components)   │
├─────────────────────────────────────────┤
│               Business Layer            │
│    (Stores, Hooks, Business Logic)     │
├─────────────────────────────────────────┤
│              Service Layer              │
│   (API Clients, External Services)     │
├─────────────────────────────────────────┤
│               Data Layer                │
│     (Storage, Cache, Persistence)      │
└─────────────────────────────────────────┘
```

## Module Architecture

### Authentication Module (`/modules/auth`)

```
auth/
├── services/
│   ├── authService.ts      # API calls
│   ├── oauthService.ts     # OAuth providers
│   └── tokenService.ts     # Token management
├── hooks/
│   ├── useAuth.ts          # Auth hook
│   └── useOAuth.ts         # OAuth hooks
├── types/
│   └── auth.types.ts       # Auth-specific types
└── index.ts                # Module exports
```

**Responsibilities:**
- User authentication (email, OAuth)
- Token management and refresh
- User session handling
- Security and encryption

### Player Module (`/modules/player`)

```
player/
├── services/
│   ├── audioService.ts     # Track Player integration
│   ├── queueService.ts     # Queue management
│   └── timerService.ts     # Pomodoro/Sleep timers
├── hooks/
│   ├── usePlayer.ts        # Player controls
│   ├── useQueue.ts         # Queue management
│   └── useTimer.ts         # Timer controls
├── components/
│   ├── PlayerControls.tsx  # Control buttons
│   ├── ProgressBar.tsx     # Playback progress
│   └── QualitySelector.tsx # Audio quality
└── utils/
    └── audioUtils.ts       # Audio utilities
```

**Responsibilities:**
- Audio playback and control
- Background audio service
- Queue management
- Timers (Pomodoro, Sleep)
- Audio quality switching

### Catalog Module (`/modules/catalog`)

```
catalog/
├── services/
│   ├── catalogService.ts   # Content API
│   └── searchService.ts    # Search API
├── hooks/
│   ├── usePlaylists.ts     # Playlist queries
│   ├── useTracks.ts        # Track queries
│   └── useSearch.ts        # Search functionality
├── components/
│   ├── PlaylistGrid.tsx    # Playlist display
│   ├── SearchFilters.tsx   # Filter UI
│   └── SearchResults.tsx   # Results display
└── types/
    └── catalog.types.ts    # Content types
```

**Responsibilities:**
- Content discovery and browsing
- Search and filtering
- Playlist and track management
- Content recommendations

### Library Module (`/modules/library`)

```
library/
├── services/
│   ├── libraryService.ts   # User library API
│   └── downloadService.ts  # Offline downloads
├── hooks/
│   ├── useLikes.ts         # Likes management
│   ├── useDownloads.ts     # Download management
│   └── useOfflineStorage.ts # Storage management
├── components/
│   ├── LikedItems.tsx      # Liked content
│   ├── DownloadProgress.tsx # Download UI
│   └── StorageManager.tsx  # Storage controls
└── utils/
    └── downloadUtils.ts    # Download utilities
```

**Responsibilities:**
- User's liked content
- Offline download management
- Storage quota management
- Content synchronization

## State Management Architecture

### Zustand Stores

```typescript
// Global state structure
interface RootState {
  auth: AuthState;         // User authentication
  player: PlayerState;     // Audio player
  library: LibraryState;   // User library
  ui: UIState;            // UI state (modals, etc.)
}
```

#### Auth Store
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

#### Player Store
```typescript
interface PlayerState {
  currentTrack?: Track;
  queue: Track[];
  isPlaying: boolean;
  position: number;
  duration: number;
  quality: AudioQuality;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  volume: number;
}
```

### React Query Usage

```typescript
// Example: Playlist queries
const usePlaylistsQuery = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['playlists', filters],
    queryFn: () => catalogService.getPlaylists(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

**Query Strategies:**
- **Lists**: 5-minute stale time, 10-minute cache
- **Details**: 1-minute stale time, 5-minute cache
- **User Data**: Background refetch, optimistic updates
- **Offline**: Persist to MMKV for offline access

## Navigation Architecture

### Navigation Structure

```
RootStack (Native Stack)
├── Auth (Stack Navigator)
│   ├── Welcome
│   ├── SignIn
│   ├── LogIn
│   └── ForgotPassword
└── App (Tab Navigator)
    ├── Home (Stack Navigator)
    │   ├── HomeScreen
    │   ├── PlaylistDetail
    │   └── TrackDetail
    ├── Search (Stack Navigator)
    │   ├── SearchScreen
    │   └── SearchResults
    ├── Library (Stack Navigator)
    │   ├── LibraryScreen
    │   ├── LikedTracks
    │   └── Downloads
    └── Settings (Stack Navigator)
        ├── SettingsScreen
        ├── Profile
        └── Subscription
```

### Modal Screens

```typescript
// Modal presentations
type RootStackParamList = {
  App: undefined;
  Player: { trackId?: string };      // Full-screen player
  Paywall: { source?: string };     // Subscription paywall
};
```

## Audio Architecture

### React Native Track Player Integration

```typescript
// Audio service setup
class AudioService {
  async setupPlayer() {
    await TrackPlayer.setupPlayer({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
    });
  }

  async playTrack(track: Track, quality: AudioQuality) {
    const audioUrl = this.getAudioUrl(track, quality);
    await TrackPlayer.add({
      id: track.id,
      url: audioUrl,
      title: track.title,
      artist: track.artists.join(', '),
      artwork: track.coverUrl,
    });
    await TrackPlayer.play();
  }
}
```

### Background Audio Service

```typescript
// Background service (index.js)
import TrackPlayer from 'react-native-track-player';

TrackPlayer.registerPlaybackService(() => require('./audioService'));
```

## Offline Architecture

### Download Management

```typescript
interface DownloadManager {
  // Queue downloads
  downloadTrack(track: Track, quality: AudioQuality): Promise<void>;
  downloadPlaylist(playlist: Playlist): Promise<void>;
  
  // Manage storage
  getStorageInfo(): OfflineStorage;
  clearExpiredDownloads(): Promise<void>;
  
  // Download progress
  onProgress(callback: (progress: DownloadProgress) => void): void;
}
```

### Storage Strategy

- **MMKV**: Encrypted storage for tokens, user data
- **FileSystem**: Audio files, images, cached content
- **AsyncStorage**: Non-sensitive app settings
- **SQLite** (future): Offline content metadata

## Security Architecture

### Data Protection

1. **Authentication Tokens**
   - Stored in encrypted MMKV
   - Automatic refresh handling
   - Secure key generation

2. **API Communication**
   - HTTPS only
   - JWT tokens with expiration
   - Request/response encryption for sensitive data

3. **Local Storage**
   - Encrypted storage for sensitive data
   - Secure key management via Keychain/Keystore
   - Biometric authentication (future)

### Privacy

- **Analytics**: User-level data anonymization
- **Logs**: No PII in production logs
- **Crash Reports**: Sanitized stack traces
- **GDPR**: Data export/deletion APIs ready

## Performance Architecture

### Optimization Strategies

1. **Rendering Performance**
   - React.memo for expensive components
   - FlatList for large datasets
   - Image lazy loading and caching
   - Native driver animations

2. **Network Performance**
   - React Query caching and background updates
   - Request deduplication
   - Optimistic updates for user actions
   - Image optimization and WebP support

3. **Audio Performance**
   - Progressive audio loading
   - Quality-based streaming
   - Background service optimization
   - Buffer management

### Memory Management

- **Image Caching**: Automatic cleanup based on usage
- **Audio Cache**: LRU cache with size limits
- **Data Structures**: Efficient data normalization
- **Event Listeners**: Proper cleanup in useEffect

## Testing Architecture

### Test Strategy

```
tests/
├── unit/                   # Business logic tests
│   ├── stores/
│   ├── services/
│   └── utils/
├── components/             # Component tests
│   ├── ui/
│   └── screens/
├── integration/            # Feature integration tests
│   ├── auth-flow.test.ts
│   ├── player-flow.test.ts
│   └── download-flow.test.ts
└── e2e/                   # End-to-end tests
    ├── android/
    ├── ios/
    └── web/
```

### Test Tools

- **Vitest**: Unit and integration tests
- **Testing Library**: Component testing
- **Detox**: E2E testing for mobile
- **Playwright**: E2E testing for web
- **Mock Service Worker**: API mocking

## CI/CD Architecture

### Build Pipeline

```yaml
# GitHub Actions workflow
name: CI/CD
on: [push, pull_request]

jobs:
  test:
    - Lint and type check
    - Unit tests
    - Component tests
    
  build:
    - Android APK/AAB
    - iOS build (with credentials)
    - Web bundle
    
  deploy:
    - Staging deployment
    - Production deployment (on main)
    - App store upload (tags)
```

### Environment Management

- **Development**: Local development with mock APIs
- **Staging**: Pre-production with test data
- **Production**: Live environment with real APIs
- **CI**: Automated testing environment

## Scalability Considerations

### Code Scalability

- **Module Federation**: Independent feature development
- **Micro-frontends**: Potential web app splitting
- **Code Splitting**: Dynamic imports for large features
- **Tree Shaking**: Dead code elimination

### Data Scalability

- **Pagination**: Infinite scroll for large lists
- **Virtual Lists**: Efficient rendering of large datasets
- **Background Sync**: Offline-first approach
- **Caching Strategy**: Multi-level caching system

### Team Scalability

- **Feature Flags**: Gradual feature rollouts
- **A/B Testing**: Data-driven feature decisions
- **Monitoring**: Comprehensive app monitoring
- **Documentation**: Living documentation with examples

## Future Architecture Considerations

### Planned Enhancements

1. **Real-time Features**
   - WebSocket integration for live updates
   - Real-time collaboration features
   - Live streaming support

2. **Advanced Analytics**
   - Custom event tracking
   - User behavior analysis
   - Performance monitoring

3. **AI/ML Integration**
   - Personalized recommendations
   - Music discovery algorithms
   - Smart playlist generation

4. **Cross-Platform Expansion**
   - Desktop app (Electron)
   - TV app (React Native TV)
   - Watch app integration

This architecture provides a solid foundation for a production-ready music streaming application while maintaining flexibility for future enhancements and scalability requirements.
