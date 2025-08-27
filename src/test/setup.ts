import '@testing-library/jest-native/extend-expect';
import { beforeAll, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react-native';

// Mock React Native modules
vi.mock('react-native', async () => {
  const actual = await vi.importActual('react-native');
  return {
    ...actual,
    Platform: {
      OS: 'ios',
      select: vi.fn((obj) => obj.ios),
    },
    Dimensions: {
      get: vi.fn(() => ({ width: 375, height: 667 })),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
    StatusBar: {
      setBarStyle: vi.fn(),
      setBackgroundColor: vi.fn(),
    },
  };
});

// Mock Expo modules
vi.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      name: 'MusicLab',
      version: '1.0.0',
    },
  },
}));

vi.mock('expo-file-system', () => ({
  documentDirectory: '/mock/documents/',
  getInfoAsync: vi.fn(),
  makeDirectoryAsync: vi.fn(),
  writeAsStringAsync: vi.fn(),
  readAsStringAsync: vi.fn(),
  deleteAsync: vi.fn(),
  readDirectoryAsync: vi.fn(),
  createDownloadResumable: vi.fn(),
  getFreeDiskStorageAsync: vi.fn(() => Promise.resolve(1000000000)),
  getTotalDiskCapacityAsync: vi.fn(() => Promise.resolve(64000000000)),
}));

vi.mock('expo-auth-session', () => ({
  AuthRequest: vi.fn(),
  makeRedirectUri: vi.fn(() => 'musiclab://auth'),
}));

vi.mock('expo-linking', () => ({
  openURL: vi.fn(),
  canOpenURL: vi.fn(() => Promise.resolve(true)),
}));

// Mock react-native-mmkv
vi.mock('react-native-mmkv', () => ({
  MMKV: vi.fn().mockImplementation(() => ({
    set: vi.fn(),
    getString: vi.fn(),
    getBoolean: vi.fn(),
    getNumber: vi.fn(),
    delete: vi.fn(),
    clearAll: vi.fn(),
  })),
}));

// Mock react-native-track-player
vi.mock('react-native-track-player', () => ({
  setupPlayer: vi.fn(() => Promise.resolve()),
  updateOptions: vi.fn(() => Promise.resolve()),
  add: vi.fn(() => Promise.resolve()),
  play: vi.fn(() => Promise.resolve()),
  pause: vi.fn(() => Promise.resolve()),
  stop: vi.fn(() => Promise.resolve()),
  skipToNext: vi.fn(() => Promise.resolve()),
  skipToPrevious: vi.fn(() => Promise.resolve()),
  seekTo: vi.fn(() => Promise.resolve()),
  setVolume: vi.fn(() => Promise.resolve()),
  setRepeatMode: vi.fn(() => Promise.resolve()),
  reset: vi.fn(() => Promise.resolve()),
  getCurrentTrack: vi.fn(() => Promise.resolve(null)),
  getQueue: vi.fn(() => Promise.resolve([])),
  remove: vi.fn(() => Promise.resolve()),
  move: vi.fn(() => Promise.resolve()),
  destroy: vi.fn(() => Promise.resolve()),
  usePlaybackState: vi.fn(() => 'stopped'),
  useProgress: vi.fn(() => ({ position: 0, duration: 0 })),
  useTrackPlayerEvents: vi.fn(),
  Event: {
    PlaybackState: 'playback-state',
    PlaybackTrackChanged: 'playback-track-changed',
  },
  State: {
    None: 'none',
    Stopped: 'stopped',
    Paused: 'paused',
    Playing: 'playing',
    Loading: 'loading',
    Buffering: 'buffering',
  },
  RepeatMode: {
    Off: 0,
    Track: 1,
    Queue: 2,
  },
  Capability: {
    Play: 'play',
    Pause: 'pause',
    SkipToNext: 'skip-to-next',
    SkipToPrevious: 'skip-to-previous',
    SeekTo: 'seek-to',
    Stop: 'stop',
  },
  AppKilledPlaybackBehavior: {
    ContinuePlayback: 'continue-playback',
    PausePlayback: 'pause-playback',
    StopPlaybackAndRemoveNotification: 'stop-playback-and-remove-notification',
  },
}));

// Mock React Navigation
vi.mock('@react-navigation/native', () => ({
  useNavigation: vi.fn(() => ({
    navigate: vi.fn(),
    goBack: vi.fn(),
    canGoBack: vi.fn(() => true),
    reset: vi.fn(),
    setOptions: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    params: {},
    name: 'MockScreen',
  })),
  useFocusEffect: vi.fn(),
  NavigationContainer: ({ children }: any) => children,
  createNavigationContainerRef: vi.fn(),
}));

vi.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: vi.fn(() => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ children }: any) => children,
  })),
}));

vi.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: vi.fn(() => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ children }: any) => children,
  })),
}));

// Mock Amplitude
vi.mock('@amplitude/analytics-react-native', () => ({
  init: vi.fn(() => Promise.resolve()),
  track: vi.fn(),
  identify: vi.fn(),
  setUserId: vi.fn(),
  Identify: vi.fn().mockImplementation(() => ({
    set: vi.fn(),
    add: vi.fn(),
  })),
}));

// Mock crypto for encryption
vi.mock('expo-crypto', () => ({
  AES: {
    encrypt: vi.fn((data) => `encrypted_${data}`),
    decrypt: vi.fn((data) => data.replace('encrypted_', '')),
  },
  enc: {
    Utf8: {
      stringify: vi.fn((data) => data),
    },
  },
}));

// Mock AsyncStorage if needed
global.fetch = vi.fn();

beforeAll(() => {
  // Setup global mocks
  global.console.warn = vi.fn();
  global.console.error = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock setTimeout/setInterval for tests
vi.mock('timers', () => ({
  setTimeout: vi.fn((fn, delay) => {
    return global.setTimeout(fn, delay);
  }),
  clearTimeout: vi.fn((id) => {
    return global.clearTimeout(id);
  }),
  setInterval: vi.fn((fn, delay) => {
    return global.setInterval(fn, delay);
  }),
  clearInterval: vi.fn((id) => {
    return global.clearInterval(id);
  }),
}));
