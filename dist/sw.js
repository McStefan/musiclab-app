// MusicLab Service Worker
const CACHE_NAME = 'musiclab-v1.0.0';
const STATIC_CACHE_NAME = 'musiclab-static-v1.0.0';
const AUDIO_CACHE_NAME = 'musiclab-audio-v1.0.0';
const API_CACHE_NAME = 'musiclab-api-v1.0.0';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other critical static assets
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/playlists/featured',
  '/api/playlists/trending',
  '/api/user/profile',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME && 
                cacheName !== AUDIO_CACHE_NAME && 
                cacheName !== API_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - cache with network first strategy
    event.respondWith(handleApiRequest(event.request));
  } else if (isAudioFile(url)) {
    // Audio files - cache with cache first strategy
    event.respondWith(handleAudioRequest(event.request));
  } else if (isStaticAsset(url)) {
    // Static assets - cache first strategy
    event.respondWith(handleStaticRequest(event.request));
  } else {
    // HTML pages - network first with fallback
    event.respondWith(handlePageRequest(event.request));
  }
});

// Handle API requests - Network first, cache fallback
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for API request, trying cache');
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API failures
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This content is not available offline' 
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle audio requests - Cache first, network fallback
async function handleAudioRequest(request) {
  const cache = await caches.open(AUDIO_CACHE_NAME);
  
  // Try cache first for audio files
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('[SW] Serving audio from cache:', request.url);
    return cachedResponse;
  }
  
  try {
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Only cache audio files if they're not too large (< 50MB)
      const contentLength = networkResponse.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 50 * 1024 * 1024) {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Audio file not available offline:', request.url);
    
    // Return offline audio response
    return new Response('Audio not available offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle static assets - Cache first
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // For critical assets, return a fallback
    if (request.destination === 'document') {
      return caches.match('/');
    }
    
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Handle page requests - Network first with offline fallback
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Page request failed, trying cache');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    return caches.match('/') || new Response(
      getOfflineHTML(),
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Utility functions
function isAudioFile(url) {
  const audioExtensions = ['.mp3', '.m4a', '.wav', '.flac', '.aac', '.ogg'];
  return audioExtensions.some(ext => url.pathname.includes(ext)) ||
         url.hostname.includes('audio') ||
         url.pathname.includes('/stream/');
}

function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname.startsWith('/static/');
}

function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>MusicLab - Offline</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          text-align: center;
        }
        .offline-container {
          max-width: 400px;
          padding: 2rem;
        }
        .offline-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        p {
          color: #888;
          line-height: 1.5;
        }
        button {
          background: #1DB954;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">🎵</div>
        <h1>You're offline</h1>
        <p>Check your internet connection to continue streaming music. Your downloaded tracks are still available in your library.</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `;
}

// Background sync for analytics and user actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  } else if (event.tag === 'sync-user-actions') {
    event.waitUntil(syncUserActions());
  }
});

async function syncAnalytics() {
  // Sync analytics events when back online
  try {
    const pendingEvents = await getStoredData('pending-analytics');
    if (pendingEvents && pendingEvents.length > 0) {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: pendingEvents })
      });
      
      // Clear stored events after successful sync
      await clearStoredData('pending-analytics');
      console.log('[SW] Analytics synced successfully');
    }
  } catch (error) {
    console.error('[SW] Failed to sync analytics:', error);
  }
}

async function syncUserActions() {
  // Sync user actions like likes, downloads when back online
  try {
    const pendingActions = await getStoredData('pending-actions');
    if (pendingActions && pendingActions.length > 0) {
      for (const action of pendingActions) {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
      }
      
      await clearStoredData('pending-actions');
      console.log('[SW] User actions synced successfully');
    }
  } catch (error) {
    console.error('[SW] Failed to sync user actions:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'general',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {}
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  event.waitUntil(
    clients.openWindow(data.url || '/')
  );
});

// Media Session API for audio controls
self.addEventListener('message', (event) => {
  if (event.data.type === 'MEDIA_SESSION_UPDATE') {
    // Handle media session updates from the app
    const { metadata, playbackState } = event.data;
    
    // This would typically be handled in the main thread,
    // but we can relay information if needed
    console.log('[SW] Media session update:', metadata, playbackState);
  }
});

// Helper functions for data storage
async function getStoredData(key) {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(`/stored-data/${key}`);
  return response ? response.json() : null;
}

async function storeData(key, data) {
  const cache = await caches.open(CACHE_NAME);
  const response = new Response(JSON.stringify(data));
  await cache.put(`/stored-data/${key}`, response);
}

async function clearStoredData(key) {
  const cache = await caches.open(CACHE_NAME);
  await cache.delete(`/stored-data/${key}`);
}

console.log('[SW] Service worker loaded successfully');
