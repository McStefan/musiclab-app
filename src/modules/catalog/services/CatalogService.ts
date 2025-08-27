import axios from 'axios';
import { 
  Playlist, 
  CatalogTrack, 
  SearchFilters, 
  SearchResult, 
  Category,
  PlaylistApiResponse,
  TrackApiResponse,
  SearchApiResponse,
  GENRE_OPTIONS,
  MOOD_OPTIONS,
  PURPOSE_OPTIONS
} from '../types';

class CatalogService {
  private static instance: CatalogService;
  private baseUrl = 'https://api.musiclab.app'; // Mock API
  private apiKey = process.env.EXPO_PUBLIC_API_KEY || 'mock_api_key';

  static getInstance(): CatalogService {
    if (!CatalogService.instance) {
      CatalogService.instance = new CatalogService();
    }
    return CatalogService.instance;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock data generators
  private generateMockPlaylist(id: string, index: number): Playlist {
    const genres = ['Pop', 'Rock', 'Electronic', 'Jazz', 'Classical'];
    const moods = ['Happy', 'Calm', 'Energetic', 'Melancholic', 'Uplifting'];
    const purposes = ['Workout', 'Study', 'Work', 'Sleep', 'Party'];
    
    return {
      id,
      title: `Playlist ${index + 1}`,
      description: `A curated collection of amazing tracks for your listening pleasure`,
      artwork: `https://picsum.photos/300/300?random=${index}`,
      author: `Artist ${index % 5 + 1}`,
      duration: 3600 + (index * 300), // Random duration
      trackCount: 12 + (index % 8),
      genre: [genres[index % genres.length]],
      mood: [moods[index % moods.length]],
      purpose: [purposes[index % purposes.length]],
      type: index % 3 === 0 ? 'album' : 'curated',
      tags: ['popular', 'trending'],
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      isLiked: Math.random() > 0.7,
      isDownloaded: Math.random() > 0.8,
      playCount: Math.floor(Math.random() * 10000),
      isPremium: Math.random() > 0.6,
    };
  }

  private generateMockTrack(id: string, index: number, playlistId?: string): CatalogTrack {
    const artists = ['Artist A', 'Artist B', 'Artist C', 'Artist D', 'Artist E'];
    const albums = ['Album 1', 'Album 2', 'Album 3', 'Album 4', 'Album 5'];
    
    return {
      id,
      title: `Track ${index + 1}`,
      artist: artists[index % artists.length],
      album: albums[index % albums.length],
      artwork: `https://picsum.photos/300/300?random=${index + 100}`,
      url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(index % 16) + 1}.mp3`,
      duration: 180 + (index * 15), // 3-7 minutes
      genre: 'Pop',
      releaseYear: 2020 + (index % 4),
      playlistId,
      isLiked: Math.random() > 0.8,
      isDownloaded: Math.random() > 0.9,
      quality: ['low', 'medium', 'high', 'lossless'],
      isPremium: Math.random() > 0.7,
    };
  }

  // Featured content
  async getFeaturedPlaylists(): Promise<Playlist[]> {
    await this.delay(800);
    
    return Array.from({ length: 8 }, (_, i) => 
      this.generateMockPlaylist(`featured_${i}`, i)
    );
  }

  async getNewReleases(): Promise<Playlist[]> {
    await this.delay(600);
    
    return Array.from({ length: 6 }, (_, i) => 
      this.generateMockPlaylist(`new_${i}`, i)
    );
  }

  async getTrendingPlaylists(): Promise<Playlist[]> {
    await this.delay(700);
    
    return Array.from({ length: 10 }, (_, i) => 
      this.generateMockPlaylist(`trending_${i}`, i)
    );
  }

  async getRecommendedPlaylists(userId: string): Promise<Playlist[]> {
    await this.delay(900);
    
    return Array.from({ length: 8 }, (_, i) => 
      this.generateMockPlaylist(`recommended_${i}`, i)
    );
  }

  // Search
  async search(filters: SearchFilters, cursor?: string): Promise<SearchResult> {
    await this.delay(1000);
    
    const { query, genres, moods, purposes, types } = filters;
    
    // Mock search logic
    let allPlaylists = Array.from({ length: 50 }, (_, i) => 
      this.generateMockPlaylist(`search_${i}`, i)
    );
    
    let allTracks = Array.from({ length: 100 }, (_, i) => 
      this.generateMockTrack(`search_track_${i}`, i)
    );

    // Filter by query
    if (query) {
      allPlaylists = allPlaylists.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.author.toLowerCase().includes(query.toLowerCase())
      );
      
      allTracks = allTracks.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.artist.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by genres
    if (genres.length > 0) {
      allPlaylists = allPlaylists.filter(p => 
        p.genre.some(g => genres.includes(g))
      );
    }

    // Filter by moods
    if (moods.length > 0) {
      allPlaylists = allPlaylists.filter(p => 
        p.mood.some(m => moods.includes(m))
      );
    }

    // Filter by purposes
    if (purposes.length > 0) {
      allPlaylists = allPlaylists.filter(p => 
        p.purpose.some(pur => purposes.includes(pur))
      );
    }

    // Filter by types
    if (types.length > 0) {
      allPlaylists = allPlaylists.filter(p => types.includes(p.type));
    }

    // Pagination
    const page = cursor ? parseInt(cursor) : 0;
    const limit = 20;
    const startIndex = page * limit;
    
    const paginatedPlaylists = allPlaylists.slice(startIndex, startIndex + limit);
    const paginatedTracks = allTracks.slice(startIndex, startIndex + limit);
    
    return {
      playlists: paginatedPlaylists,
      tracks: paginatedTracks,
      total: allPlaylists.length + allTracks.length,
      hasMore: startIndex + limit < Math.max(allPlaylists.length, allTracks.length),
      nextCursor: startIndex + limit < Math.max(allPlaylists.length, allTracks.length) 
        ? (page + 1).toString() 
        : undefined,
    };
  }

  // Categories
  async getCategories(): Promise<{
    genres: Category[];
    moods: Category[];
    purposes: Category[];
  }> {
    await this.delay(500);
    
    const genres: Category[] = GENRE_OPTIONS.map((genre, index) => ({
      id: `genre_${genre.toLowerCase()}`,
      name: genre,
      icon: '🎵',
      color: `hsl(${index * 20}, 70%, 50%)`,
      description: `Discover the best ${genre} music`,
      playlistCount: Math.floor(Math.random() * 100) + 10,
    }));

    const moods: Category[] = MOOD_OPTIONS.map((mood, index) => ({
      id: `mood_${mood.toLowerCase()}`,
      name: mood,
      icon: '😊',
      color: `hsl(${index * 15}, 60%, 45%)`,
      description: `Music to match your ${mood.toLowerCase()} mood`,
      playlistCount: Math.floor(Math.random() * 80) + 5,
    }));

    const purposes: Category[] = PURPOSE_OPTIONS.map((purpose, index) => ({
      id: `purpose_${purpose.toLowerCase()}`,
      name: purpose,
      icon: '🎯',
      color: `hsl(${index * 25}, 65%, 55%)`,
      description: `Perfect playlists for ${purpose.toLowerCase()}`,
      playlistCount: Math.floor(Math.random() * 60) + 8,
    }));

    return { genres, moods, purposes };
  }

  // Playlist details
  async getPlaylist(playlistId: string): Promise<Playlist> {
    await this.delay(600);
    
    // Extract index from ID for consistent mock data
    const index = parseInt(playlistId.split('_').pop() || '0');
    return this.generateMockPlaylist(playlistId, index);
  }

  async getPlaylistTracks(playlistId: string): Promise<CatalogTrack[]> {
    await this.delay(800);
    
    const trackCount = 12 + Math.floor(Math.random() * 8);
    return Array.from({ length: trackCount }, (_, i) => 
      this.generateMockTrack(`${playlistId}_track_${i}`, i, playlistId)
    );
  }

  // Playlist actions
  async likePlaylist(playlistId: string): Promise<void> {
    await this.delay(300);
    // Would make API call to like playlist
    console.log(`Liked playlist: ${playlistId}`);
  }

  async unlikePlaylist(playlistId: string): Promise<void> {
    await this.delay(300);
    // Would make API call to unlike playlist
    console.log(`Unliked playlist: ${playlistId}`);
  }

  async downloadPlaylist(playlistId: string): Promise<void> {
    await this.delay(2000);
    // Would initiate playlist download
    console.log(`Started download for playlist: ${playlistId}`);
  }

  async sharePlaylist(playlistId: string): Promise<string> {
    await this.delay(200);
    // Would generate share URL
    return `https://musiclab.app/playlist/${playlistId}`;
  }

  // Track actions
  async likeTrack(trackId: string): Promise<void> {
    await this.delay(300);
    console.log(`Liked track: ${trackId}`);
  }

  async unlikeTrack(trackId: string): Promise<void> {
    await this.delay(300);
    console.log(`Unliked track: ${trackId}`);
  }

  // Advanced search
  async searchByCategory(
    category: Category, 
    type: 'genre' | 'mood' | 'purpose'
  ): Promise<Playlist[]> {
    await this.delay(800);
    
    // Mock category-based search
    return Array.from({ length: 15 }, (_, i) => {
      const playlist = this.generateMockPlaylist(`${type}_${category.id}_${i}`, i);
      
      // Ensure playlist matches the category
      switch (type) {
        case 'genre':
          playlist.genre = [category.name];
          break;
        case 'mood':
          playlist.mood = [category.name];
          break;
        case 'purpose':
          playlist.purpose = [category.name];
          break;
      }
      
      return playlist;
    });
  }

  // Suggestions and autocomplete
  async getSearchSuggestions(query: string): Promise<string[]> {
    await this.delay(200);
    
    const suggestions = [
      'pop music', 'rock classics', 'electronic vibes', 'jazz standards',
      'workout motivation', 'study focus', 'sleep sounds', 'party hits',
      'road trip', 'morning coffee', 'evening chill', 'romantic dinner'
    ];
    
    return suggestions
      .filter(s => s.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }
}

export const catalogService = CatalogService.getInstance();
