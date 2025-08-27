import { init, track, identify, setUserId, Identify } from '@amplitude/analytics-react-native';
import { Platform } from 'react-native';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export interface UserProperties {
  userId: string;
  email?: string;
  subscriptionType?: string;
  country?: string;
  language?: string;
  appVersion?: string;
  deviceType?: string;
  platform?: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized = false;
  private apiKey: string;
  private enabledInDevelopment = false;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY || 'mock_amplitude_key';
    this.enabledInDevelopment = process.env.NODE_ENV === 'development' && 
                                process.env.EXPO_PUBLIC_ANALYTICS_DEV === 'true';
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await init(this.apiKey, undefined, {
        trackingOptions: {
          ipAddress: false, // Respect privacy
          city: false,
          country: true,
          region: false,
        },
        defaultTracking: {
          attribution: true,
          pageViews: false, // We'll track screen views manually
          sessions: true,
          formInteractions: false,
          fileDownloads: false,
        },
        minIdLength: 1,
        serverZone: 'US', // or 'EU' for GDPR compliance
        useBatch: true,
        flushQueueSize: 10,
        flushIntervalMillis: 10000, // Flush every 10 seconds
      });

      this.initialized = true;
      
      // Track initialization
      this.trackEvent('app_initialized', {
        platform: Platform.OS,
        app_version: '1.0.0', // Would come from app.json
        timestamp: Date.now(),
      });

    } catch (error) {
      console.error('Failed to initialize Analytics:', error);
    }
  }

  private shouldTrack(): boolean {
    if (!this.initialized) {
      console.warn('Analytics not initialized');
      return false;
    }

    // Don't track in development unless explicitly enabled
    if (__DEV__ && !this.enabledInDevelopment) {
      return false;
    }

    return true;
  }

  // Core tracking methods
  trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (!this.shouldTrack()) return;

    try {
      const eventProperties = {
        ...properties,
        timestamp: Date.now(),
        platform: Platform.OS,
        session_id: this.getSessionId(),
      };

      track(eventName, eventProperties);
      
      if (__DEV__) {
        console.log(`[Analytics] ${eventName}:`, eventProperties);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  identifyUser(userProperties: UserProperties): void {
    if (!this.shouldTrack()) return;

    try {
      setUserId(userProperties.userId);
      
      const identifyEvent = new Identify();
      
      if (userProperties.email) identifyEvent.set('email', userProperties.email);
      if (userProperties.subscriptionType) identifyEvent.set('subscription_type', userProperties.subscriptionType);
      if (userProperties.country) identifyEvent.set('country', userProperties.country);
      if (userProperties.language) identifyEvent.set('language', userProperties.language);
      if (userProperties.appVersion) identifyEvent.set('app_version', userProperties.appVersion);
      if (userProperties.deviceType) identifyEvent.set('device_type', userProperties.deviceType);
      if (userProperties.platform) identifyEvent.set('platform', userProperties.platform);
      
      identifyEvent.set('last_seen', new Date().toISOString());
      
      identify(identifyEvent);
      
      if (__DEV__) {
        console.log('[Analytics] User identified:', userProperties);
      }
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }

  // App lifecycle events
  trackAppStart(): void {
    this.trackEvent('app_start', {
      cold_start: true,
    });
  }

  trackAppBackground(): void {
    this.trackEvent('app_background');
  }

  trackAppForeground(): void {
    this.trackEvent('app_foreground');
  }

  trackScreenView(screenName: string, properties?: Record<string, any>): void {
    this.trackEvent('screen_view', {
      screen_name: screenName,
      ...properties,
    });
  }

  // Authentication events
  trackSignIn(method: 'email' | 'google' | 'apple', success: boolean): void {
    this.trackEvent('sign_in', {
      method,
      success,
    });
  }

  trackSignUp(method: 'email' | 'google' | 'apple', success: boolean): void {
    this.trackEvent('sign_up', {
      method,
      success,
    });
  }

  trackSignOut(): void {
    this.trackEvent('sign_out');
  }

  // Music playback events
  trackPlayTrack(trackId: string, playlistId?: string, source?: string): void {
    this.trackEvent('track_play', {
      track_id: trackId,
      playlist_id: playlistId,
      source, // 'search', 'playlist', 'recommendation', etc.
    });
  }

  trackPauseTrack(trackId: string, position: number): void {
    this.trackEvent('track_pause', {
      track_id: trackId,
      position,
    });
  }

  trackSkipTrack(trackId: string, position: number, direction: 'forward' | 'backward'): void {
    this.trackEvent('track_skip', {
      track_id: trackId,
      position,
      direction,
    });
  }

  trackTrackComplete(trackId: string, duration: number): void {
    this.trackEvent('track_complete', {
      track_id: trackId,
      duration,
    });
  }

  trackSeek(trackId: string, fromPosition: number, toPosition: number): void {
    this.trackEvent('track_seek', {
      track_id: trackId,
      from_position: fromPosition,
      to_position: toPosition,
    });
  }

  // Playlist events
  trackPlaylistPlay(playlistId: string, source?: string): void {
    this.trackEvent('playlist_play', {
      playlist_id: playlistId,
      source,
    });
  }

  trackPlaylistLike(playlistId: string): void {
    this.trackEvent('playlist_like', {
      playlist_id: playlistId,
    });
  }

  trackPlaylistUnlike(playlistId: string): void {
    this.trackEvent('playlist_unlike', {
      playlist_id: playlistId,
    });
  }

  trackPlaylistDownload(playlistId: string, trackCount: number): void {
    this.trackEvent('playlist_download', {
      playlist_id: playlistId,
      track_count: trackCount,
    });
  }

  // Search events
  trackSearch(query: string, resultCount: number, filters?: Record<string, any>): void {
    this.trackEvent('search', {
      query,
      result_count: resultCount,
      filters,
    });
  }

  trackSearchResultClick(query: string, resultType: 'track' | 'playlist', resultId: string, position: number): void {
    this.trackEvent('search_result_click', {
      query,
      result_type: resultType,
      result_id: resultId,
      position,
    });
  }

  // Subscription events
  trackSubscriptionStart(planId: string, method: 'trial' | 'purchase'): void {
    this.trackEvent('subscription_start', {
      plan_id: planId,
      method,
    });
  }

  trackSubscriptionCancel(planId: string, reason?: string): void {
    this.trackEvent('subscription_cancel', {
      plan_id: planId,
      reason,
    });
  }

  trackSubscriptionUpgrade(fromPlan: string, toPlan: string): void {
    this.trackEvent('subscription_upgrade', {
      from_plan: fromPlan,
      to_plan: toPlan,
    });
  }

  trackSubscriptionDowngrade(fromPlan: string, toPlan: string): void {
    this.trackEvent('subscription_downgrade', {
      from_plan: fromPlan,
      to_plan: toPlan,
    });
  }

  // Download events
  trackDownloadStart(itemType: 'track' | 'playlist', itemId: string): void {
    this.trackEvent('download_start', {
      item_type: itemType,
      item_id: itemId,
    });
  }

  trackDownloadComplete(itemType: 'track' | 'playlist', itemId: string, size: number): void {
    this.trackEvent('download_complete', {
      item_type: itemType,
      item_id: itemId,
      size_bytes: size,
    });
  }

  trackDownloadFailed(itemType: 'track' | 'playlist', itemId: string, error: string): void {
    this.trackEvent('download_failed', {
      item_type: itemType,
      item_id: itemId,
      error,
    });
  }

  // Feature usage events
  trackFeatureUsed(featureName: string, properties?: Record<string, any>): void {
    this.trackEvent('feature_used', {
      feature_name: featureName,
      ...properties,
    });
  }

  trackTimerStart(timerType: 'sleep' | 'pomodoro', duration: number): void {
    this.trackEvent('timer_start', {
      timer_type: timerType,
      duration_minutes: duration,
    });
  }

  trackTimerComplete(timerType: 'sleep' | 'pomodoro'): void {
    this.trackEvent('timer_complete', {
      timer_type: timerType,
    });
  }

  // Error tracking
  trackError(error: string, context?: string, properties?: Record<string, any>): void {
    this.trackEvent('error', {
      error_message: error,
      context,
      ...properties,
    });
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, unit: string): void {
    this.trackEvent('performance', {
      metric,
      value,
      unit,
    });
  }

  // Social events
  trackShare(itemType: 'track' | 'playlist', itemId: string, method: string): void {
    this.trackEvent('share', {
      item_type: itemType,
      item_id: itemId,
      method, // 'copy_link', 'social_media', etc.
    });
  }

  // User feedback events
  trackDislike(trackId: string, properties?: Record<string, any>): void {
    this.trackEvent('track_disliked', {
      track_id: trackId,
      ...properties,
    });
  }

  trackUndoDislike(trackId: string): void {
    this.trackEvent('track_undo_dislike', {
      track_id: trackId,
    });
  }

  // Visual events
  trackVisualView(visualId: string, visualType: string): void {
    this.trackEvent('visual_view', {
      visual_id: visualId,
      visual_type: visualType,
    });
  }

  trackVisualPlay(visualId: string): void {
    this.trackEvent('visual_play', {
      visual_id: visualId,
    });
  }

  trackVisualPause(visualId: string, currentTime: number): void {
    this.trackEvent('visual_pause', {
      visual_id: visualId,
      current_time: currentTime,
    });
  }

  trackVisualSeek(visualId: string, seekTime: number): void {
    this.trackEvent('visual_seek', {
      visual_id: visualId,
      seek_time: seekTime,
    });
  }

  trackVisualLike(visualId: string): void {
    this.trackEvent('visual_like', {
      visual_id: visualId,
    });
  }

  trackVisualUnlike(visualId: string): void {
    this.trackEvent('visual_unlike', {
      visual_id: visualId,
    });
  }

  trackVisualDownload(visualId: string, quality: string, fileSize: number): void {
    this.trackEvent('visual_download', {
      visual_id: visualId,
      quality,
      file_size: fileSize,
    });
  }

  trackVisualShare(visualId: string, method: string): void {
    this.trackEvent('visual_share', {
      visual_id: visualId,
      method,
    });
  }

  trackPlaylistVisualLoad(playlistId: string, visualCount: number): void {
    this.trackEvent('playlist_visuals_loaded', {
      playlist_id: playlistId,
      visual_count: visualCount,
    });
  }

  trackGalleryCreate(galleryId: string, visualCount: number): void {
    this.trackEvent('gallery_create', {
      gallery_id: galleryId,
      visual_count: visualCount,
    });
  }

  trackGalleryAddVisuals(galleryId: string, visualCount: number): void {
    this.trackEvent('gallery_add_visuals', {
      gallery_id: galleryId,
      visual_count: visualCount,
    });
  }

  trackGalleryRemoveVisuals(galleryId: string, visualCount: number): void {
    this.trackEvent('gallery_remove_visuals', {
      gallery_id: galleryId,
      visual_count: visualCount,
    });
  }

  // Filter usage events
  trackFilterApplied(filterType: string, filterValues: any): void {
    this.trackEvent('filter_applied', {
      filter_type: filterType,
      filter_values: filterValues,
    });
  }

  trackFilterCleared(filterType?: string): void {
    this.trackEvent('filter_cleared', {
      filter_type: filterType || 'all',
    });
  }

  // Utility methods
  private getSessionId(): string {
    // In real implementation, would manage session IDs properly
    return `session_${Date.now()}`;
  }

  // Flush events immediately (useful before app closes)
  async flush(): Promise<void> {
    if (!this.shouldTrack()) return;
    
    try {
      // Amplitude automatically batches and flushes events
      // In real implementation, might call specific flush method
      console.log('[Analytics] Flushing events...');
    } catch (error) {
      console.error('Failed to flush analytics:', error);
    }
  }

  // Set custom user properties
  setUserProperty(key: string, value: any): void {
    if (!this.shouldTrack()) return;

    try {
      const identifyEvent = new Identify();
      identifyEvent.set(key, value);
      identify(identifyEvent);
    } catch (error) {
      console.error('Failed to set user property:', error);
    }
  }

  // Increment user properties
  incrementUserProperty(key: string, value: number = 1): void {
    if (!this.shouldTrack()) return;

    try {
      const identifyEvent = new Identify();
      identifyEvent.add(key, value);
      identify(identifyEvent);
    } catch (error) {
      console.error('Failed to increment user property:', error);
    }
  }
}

export const analyticsService = AnalyticsService.getInstance();
