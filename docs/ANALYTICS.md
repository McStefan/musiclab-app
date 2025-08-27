# MusicLab Analytics Schema

## Overview

MusicLab uses Amplitude for comprehensive user analytics and event tracking. This document outlines all tracked events, user properties, and analytics implementation guidelines.

## User Properties

### Core User Properties

```typescript
interface UserProperties {
  // Identity
  user_id: string;                    // Unique user identifier
  email: string;                      // User email (hashed in production)
  subscription_plan: SubscriptionPlan; // FREE, TRIAL, STANDARD, PREMIUM, FAMILY
  subscription_status: string;        // active, inactive, cancelled, expired
  
  // Preferences
  preferred_quality: AudioQuality;    // LOW, STD, HI, LOSSLESS
  auto_download: boolean;             // Auto-download preference
  offline_storage_limit: number;     // Storage limit in MB
  
  // Behavior
  favorite_genres: string[];          // Preferred music genres
  favorite_moods: string[];           // Preferred moods
  favorite_purposes: string[];        // Preferred purposes (work, relax, etc.)
  
  // Device & Platform
  platform: string;                  // ios, android, web
  app_version: string;               // App version (1.0.0)
  device_model: string;              // Device model
  os_version: string;                // OS version
  
  // Session
  session_count: number;             // Total app sessions
  first_seen: string;                // First app open (ISO date)
  last_seen: string;                 // Last app activity (ISO date)
}
```

### Computed Properties

```typescript
interface ComputedProperties {
  // Engagement
  total_listening_time: number;      // Total minutes listened
  average_session_duration: number; // Average session length
  tracks_liked: number;              // Total liked tracks
  playlists_liked: number;           // Total liked playlists
  
  // Content
  tracks_downloaded: number;         // Offline tracks count
  storage_used_mb: number;           // Offline storage used
  
  // Monetization
  trial_started_date?: string;       // Trial start date
  subscription_started_date?: string; // Subscription start date
  ltv: number;                       // Lifetime value (calculated)
}
```

## Event Schema

### Authentication Events

#### `auth_signup`
```typescript
{
  event: 'auth_signup',
  properties: {
    method: 'email' | 'google' | 'apple',
    source: 'welcome' | 'paywall' | 'force_login',
    trial_offered: boolean,
    success: boolean,
    error_code?: string,
    time_to_complete: number, // milliseconds
  }
}
```

#### `auth_login`
```typescript
{
  event: 'auth_login',
  properties: {
    method: 'email' | 'google' | 'apple',
    source: 'welcome' | 'session_expired' | 'manual',
    success: boolean,
    error_code?: string,
    time_to_complete: number,
  }
}
```

#### `auth_logout`
```typescript
{
  event: 'auth_logout',
  properties: {
    method: 'manual' | 'session_expired' | 'error',
    session_duration: number, // minutes
  }
}
```

### Playback Events

#### `play_started`
```typescript
{
  event: 'play_started',
  properties: {
    track_id: string,
    playlist_id?: string,
    source: 'playlist' | 'search' | 'recommendation' | 'queue',
    quality: AudioQuality,
    is_offline: boolean,
    position_in_playlist?: number,
    shuffle_enabled: boolean,
    repeat_mode: RepeatMode,
  }
}
```

#### `play_completed`
```typescript
{
  event: 'play_completed',
  properties: {
    track_id: string,
    playlist_id?: string,
    listen_duration: number,     // seconds actually listened
    total_duration: number,      // track total duration
    completion_rate: number,     // listen_duration / total_duration
    quality: AudioQuality,
    is_offline: boolean,
    skipped: boolean,
  }
}
```

#### `play_skipped`
```typescript
{
  event: 'play_skipped',
  properties: {
    track_id: string,
    playlist_id?: string,
    listen_duration: number,     // seconds before skip
    total_duration: number,
    skip_reason: 'manual' | 'dislike' | 'next_track',
    position_when_skipped: number, // seconds
  }
}
```

#### `play_paused`
```typescript
{
  event: 'play_paused',
  properties: {
    track_id: string,
    position: number,           // seconds when paused
    duration_before_pause: number, // seconds of continuous play
    source: 'manual' | 'interruption' | 'background',
  }
}
```

### User Interaction Events

#### `like`
```typescript
{
  event: 'like',
  properties: {
    item_type: 'track' | 'playlist' | 'visual',
    item_id: string,
    source: 'player' | 'playlist' | 'search',
    is_offline: boolean,
    playlist_id?: string,        // if liked from playlist context
  }
}
```

#### `dislike`
```typescript
{
  event: 'dislike',
  properties: {
    track_id: string,
    source: 'player' | 'playlist',
    listen_duration: number,     // how long before dislike
    auto_skip: boolean,          // if dislike caused auto-skip
    playlist_id?: string,
  }
}
```

#### `share`
```typescript
{
  event: 'share',
  properties: {
    item_type: 'track' | 'playlist',
    item_id: string,
    method: 'copy_link' | 'social' | 'message',
    platform?: string,          // if social sharing
  }
}
```

### Discovery Events

#### `search_performed`
```typescript
{
  event: 'search_performed',
  properties: {
    query: string,              // search terms (may be hashed)
    filters: {
      genre?: string,
      mood?: string,
      purpose?: string,
      content_type?: ContentType,
    },
    results_count: number,
    time_to_search: number,     // milliseconds
  }
}
```

#### `filter_applied`
```typescript
{
  event: 'filter_applied',
  properties: {
    filter_type: 'genre' | 'mood' | 'purpose' | 'content_type',
    filter_value: string,
    source: 'search' | 'browse' | 'home',
    results_count: number,
  }
}
```

#### `content_discovered`
```typescript
{
  event: 'content_discovered',
  properties: {
    item_type: 'track' | 'playlist',
    item_id: string,
    discovery_method: 'search' | 'recommendation' | 'browse' | 'trending',
    source_section?: string,     // home section name
    position_in_list?: number,
  }
}
```

### Download & Offline Events

#### `download_started`
```typescript
{
  event: 'download_started',
  properties: {
    item_type: 'track' | 'playlist',
    item_id: string,
    quality: AudioQuality,
    estimated_size_mb: number,
    available_storage_mb: number,
    source: 'player' | 'library' | 'bulk',
  }
}
```

#### `download_completed`
```typescript
{
  event: 'download_completed',
  properties: {
    item_type: 'track' | 'playlist',
    item_id: string,
    quality: AudioQuality,
    actual_size_mb: number,
    download_duration: number,   // seconds
    success: boolean,
    error_code?: string,
  }
}
```

#### `download_failed`
```typescript
{
  event: 'download_failed',
  properties: {
    item_type: 'track' | 'playlist',
    item_id: string,
    quality: AudioQuality,
    error_code: string,
    error_message: string,
    retry_count: number,
    available_storage_mb: number,
  }
}
```

#### `offline_storage_full`
```typescript
{
  event: 'offline_storage_full',
  properties: {
    total_storage_mb: number,
    used_storage_mb: number,
    attempted_download_size_mb: number,
    action_taken: 'cancelled' | 'cleaned_up' | 'upgraded',
  }
}
```

### Subscription & Monetization Events

#### `paywall_view`
```typescript
{
  event: 'paywall_view',
  properties: {
    source: 'trial_expired' | 'feature_locked' | 'quality_upgrade' | 'onboarding',
    trigger_feature?: string,    // specific feature that triggered paywall
    plans_shown: SubscriptionPlan[],
    is_dismissible: boolean,
  }
}
```

#### `trial_started`
```typescript
{
  event: 'trial_started',
  properties: {
    plan: SubscriptionPlan,
    trial_duration_days: number,
    source: 'paywall' | 'onboarding',
    previous_plan?: SubscriptionPlan,
  }
}
```

#### `subscribed`
```typescript
{
  event: 'subscribed',
  properties: {
    plan: SubscriptionPlan,
    billing_cycle: 'monthly' | 'yearly',
    price: number,
    currency: string,
    payment_method: 'stripe' | 'google_play' | 'apple_pay',
    source: 'paywall' | 'trial_conversion' | 'upgrade',
    discount_applied?: number,   // percentage or amount
  }
}
```

#### `subscription_cancelled`
```typescript
{
  event: 'subscription_cancelled',
  properties: {
    plan: SubscriptionPlan,
    cancellation_reason?: string,
    days_subscribed: number,
    will_continue_until: string, // ISO date
    offered_retention?: boolean,
  }
}
```

#### `family_invite_sent`
```typescript
{
  event: 'family_invite_sent',
  properties: {
    invitee_email: string,       // hashed in production
    family_size: number,         // current members
    max_family_size: number,
  }
}
```

### Timer & Productivity Events

#### `timer_started`
```typescript
{
  event: 'timer_started',
  properties: {
    timer_type: 'pomodoro' | 'sleep',
    duration_minutes: number,
    source: 'player' | 'settings',
    custom_duration: boolean,    // if user set custom time
  }
}
```

#### `timer_completed`
```typescript
{
  event: 'timer_completed',
  properties: {
    timer_type: 'pomodoro' | 'sleep',
    planned_duration: number,    // minutes
    actual_duration: number,     // minutes (may differ if stopped early)
    action_taken: 'auto_stop' | 'continue_playing' | 'snooze',
  }
}
```

### App Lifecycle Events

#### `app_open`
```typescript
{
  event: 'app_open',
  properties: {
    source: 'direct' | 'notification' | 'deeplink' | 'background',
    time_since_last_open?: number, // minutes
    is_first_open: boolean,
    previous_version?: string,     // if app was updated
  }
}
```

#### `session_end`
```typescript
{
  event: 'session_end',
  properties: {
    session_duration: number,    // minutes
    tracks_played: number,
    tracks_liked: number,
    searches_performed: number,
    screens_visited: string[],   // screen names
    background_time: number,     // minutes in background
  }
}
```

#### `app_error`
```typescript
{
  event: 'app_error',
  properties: {
    error_type: 'crash' | 'network' | 'audio' | 'storage',
    error_message: string,
    error_code?: string,
    screen: string,              // screen where error occurred
    user_action?: string,        // action that triggered error
    is_fatal: boolean,
  }
}
```

## Implementation Guidelines

### Event Naming Convention

- Use `snake_case` for event names
- Use present tense for user actions (`play_started`, not `play_start`)
- Use past tense for completed actions (`download_completed`)
- Group related events with common prefixes (`auth_`, `play_`, `download_`)

### Property Guidelines

```typescript
// Good: Consistent, descriptive properties
{
  event: 'play_started',
  properties: {
    track_id: 'track_123',
    quality: 'HI',
    is_offline: false,
  }
}

// Avoid: Inconsistent naming, unclear values
{
  event: 'trackPlay',
  properties: {
    id: '123',
    qual: 'high',
    offline: 0,
  }
}
```

### Privacy & GDPR Compliance

1. **PII Handling**
   - Hash email addresses in production
   - Don't track IP addresses
   - Anonymize user IDs when possible

2. **Data Retention**
   - Raw events: 2 years
   - Aggregated data: 7 years
   - User-level data: Until account deletion

3. **User Consent**
   - Respect analytics opt-out
   - Provide data export functionality
   - Support data deletion requests

### Implementation Example

```typescript
// Analytics service
class AnalyticsService {
  private amplitude: AmplitudeClient;
  
  // Track event with automatic user properties
  track(event: string, properties?: Record<string, any>) {
    if (!this.hasUserConsent()) return;
    
    const enrichedProperties = {
      ...properties,
      platform: Platform.OS,
      app_version: Constants.expoConfig?.version,
      timestamp: new Date().toISOString(),
    };
    
    this.amplitude.track(event, enrichedProperties);
  }
  
  // Set user properties
  setUserProperties(properties: Partial<UserProperties>) {
    if (!this.hasUserConsent()) return;
    
    this.amplitude.setUserProperties(properties);
  }
  
  // Privacy-compliant user identification
  identify(userId: string) {
    const anonymizedId = this.hashUserId(userId);
    this.amplitude.setUserId(anonymizedId);
  }
}
```

### Testing Analytics

```typescript
// Mock analytics for testing
export const mockAnalytics = {
  events: [] as Array<{ event: string; properties: any }>,
  
  track(event: string, properties?: any) {
    this.events.push({ event, properties });
  },
  
  clear() {
    this.events = [];
  },
  
  getEvents(eventName?: string) {
    return eventName 
      ? this.events.filter(e => e.event === eventName)
      : this.events;
  },
};
```

## Dashboards & Monitoring

### Key Metrics to Monitor

1. **User Engagement**
   - DAU/MAU (Daily/Monthly Active Users)
   - Session duration
   - Retention rates (Day 1, 7, 30)
   - Feature adoption rates

2. **Content Performance**
   - Track completion rates
   - Skip rates by genre/mood
   - Most liked content
   - Search success rates

3. **Monetization**
   - Trial conversion rates
   - Subscription churn
   - Revenue per user
   - Feature-to-upgrade attribution

4. **Technical Performance**
   - App crash rates
   - Audio playback errors
   - Download success rates
   - Network error rates

### Alerts & Monitoring

```typescript
// Critical alerts
const alerts = {
  crash_rate: {
    threshold: '> 1%',
    window: '1 hour',
    severity: 'critical',
  },
  
  subscription_drop: {
    threshold: '> 20% daily decrease',
    window: '24 hours', 
    severity: 'high',
  },
  
  audio_errors: {
    threshold: '> 5%',
    window: '15 minutes',
    severity: 'medium',
  },
};
```

This analytics schema provides comprehensive tracking while maintaining user privacy and enabling data-driven product decisions.
