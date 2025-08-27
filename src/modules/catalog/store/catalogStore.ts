import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CatalogStore, SearchFilters, Category } from '../types';
import { catalogService } from '../services/CatalogService';
import { mmkvStorage } from '../../../store/mmkvStorage';
import { FilterOptions } from '../../../types/filters';
import { useFilterStore } from '../../../stores/filterStore';

const initialFilters: SearchFilters = {
  query: '',
  genres: [],
  moods: [],
  purposes: [],
  types: [],
  audioQuality: [],
  isPremiumOnly: false,
  sortBy: 'relevance',
  sortOrder: 'desc',
};

export const useCatalogStore = create<CatalogStore>()(
  persist(
    (set, get) => ({
      // Initial state
      searchQuery: '',
      filters: initialFilters,
      searchResults: null,
      isSearching: false,
      searchHistory: [],
      
      featuredPlaylists: [],
      newReleases: [],
      trendingPlaylists: [],
      recommendedPlaylists: [],
      
      genres: [],
      moods: [],
      purposes: [],
      
      selectedPlaylist: null,
      playlistTracks: [],
      isLoadingPlaylist: false,
      
      isLoading: false,
      error: null,
      refreshing: false,

      // Actions
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      updateFilters: (newFilters: Partial<SearchFilters>) => {
        const currentFilters = get().filters;
        set({ filters: { ...currentFilters, ...newFilters } });
      },

      search: async (query?: string) => {
        const state = get();
        const searchQuery = query || state.searchQuery;
        
        // Get current filters from filter store
        const globalFilters = useFilterStore.getState().activeFilters;
        
        // Convert global filters to search filters
        const searchFilters = convertGlobalFiltersToSearchFilters(globalFilters, searchQuery);
        
        set({ isSearching: true, error: null });
        
        try {
          const results = await catalogService.search(searchFilters);
          set({ 
            searchResults: results, 
            isSearching: false,
            searchQuery,
            filters: searchFilters 
          });
          
          // Add to search history if query is not empty
          if (searchQuery.trim()) {
            get().addToSearchHistory(searchQuery);
          }
        } catch (error) {
          set({ 
            isSearching: false, 
            error: error instanceof Error ? error.message : 'Search failed' 
          });
        }
      },

      searchWithFilters: async (globalFilters: FilterOptions, query?: string) => {
        const state = get();
        const searchQuery = query || state.searchQuery;
        
        // Convert global filters to search filters
        const searchFilters = convertGlobalFiltersToSearchFilters(globalFilters, searchQuery);
        
        set({ isSearching: true, error: null });
        
        try {
          const results = await catalogService.search(searchFilters);
          set({ 
            searchResults: results, 
            isSearching: false,
            searchQuery,
            filters: searchFilters 
          });
        } catch (error) {
          set({ 
            isSearching: false, 
            error: error instanceof Error ? error.message : 'Search with filters failed' 
          });
        }
      },

      clearSearch: () => {
        set({ 
          searchQuery: '', 
          searchResults: null, 
          filters: initialFilters 
        });
      },

      addToSearchHistory: (query: string) => {
        const currentHistory = get().searchHistory;
        const trimmedQuery = query.trim();
        
        if (trimmedQuery && !currentHistory.includes(trimmedQuery)) {
          const newHistory = [trimmedQuery, ...currentHistory.slice(0, 9)]; // Keep last 10
          set({ searchHistory: newHistory });
        }
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      loadFeaturedContent: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const [featured, newReleases, trending, recommended] = await Promise.all([
            catalogService.getFeaturedPlaylists(),
            catalogService.getNewReleases(),
            catalogService.getTrendingPlaylists(),
            catalogService.getRecommendedPlaylists('current_user'), // Would use actual user ID
          ]);
          
          set({ 
            featuredPlaylists: featured,
            newReleases,
            trendingPlaylists: trending,
            recommendedPlaylists: recommended,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load content' 
          });
        }
      },

      loadPlaylist: async (playlistId: string) => {
        set({ isLoadingPlaylist: true, error: null });
        
        try {
          const [playlist, tracks] = await Promise.all([
            catalogService.getPlaylist(playlistId),
            catalogService.getPlaylistTracks(playlistId),
          ]);
          
          set({ 
            selectedPlaylist: playlist,
            playlistTracks: tracks,
            isLoadingPlaylist: false 
          });
        } catch (error) {
          set({ 
            isLoadingPlaylist: false, 
            error: error instanceof Error ? error.message : 'Failed to load playlist' 
          });
        }
      },

      loadPlaylistTracks: async (playlistId: string) => {
        try {
          const tracks = await catalogService.getPlaylistTracks(playlistId);
          set({ playlistTracks: tracks });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load tracks' });
        }
      },

      loadMoreSearchResults: async () => {
        const state = get();
        const { searchResults, filters, isSearching } = state;
        
        if (!searchResults || !searchResults.hasMore || isSearching) return;
        
        set({ isSearching: true });
        
        try {
          const moreResults = await catalogService.search(filters, searchResults.nextCursor);
          
          set({ 
            searchResults: {
              ...moreResults,
              playlists: [...searchResults.playlists, ...moreResults.playlists],
              tracks: [...searchResults.tracks, ...moreResults.tracks],
            },
            isSearching: false 
          });
        } catch (error) {
          set({ 
            isSearching: false, 
            error: error instanceof Error ? error.message : 'Failed to load more results' 
          });
        }
      },

      refresh: async () => {
        set({ refreshing: true });
        
        try {
          await get().loadFeaturedContent();
          await get().loadCategories();
          set({ refreshing: false });
        } catch (error) {
          set({ 
            refreshing: false, 
            error: error instanceof Error ? error.message : 'Failed to refresh' 
          });
        }
      },

      loadCategories: async () => {
        try {
          const categories = await catalogService.getCategories();
          set({ 
            genres: categories.genres,
            moods: categories.moods,
            purposes: categories.purposes 
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load categories' });
        }
      },

      searchByCategory: async (category: Category, type: 'genre' | 'mood' | 'purpose') => {
        set({ isSearching: true, error: null });
        
        try {
          const playlists = await catalogService.searchByCategory(category, type);
          
          set({ 
            searchResults: {
              playlists,
              tracks: [],
              total: playlists.length,
              hasMore: false,
            },
            isSearching: false 
          });
        } catch (error) {
          set({ 
            isSearching: false, 
            error: error instanceof Error ? error.message : 'Category search failed' 
          });
        }
      },

      likePlaylist: async (playlistId: string) => {
        try {
          await catalogService.likePlaylist(playlistId);
          
          // Update local state
          const state = get();
          
          // Update featured playlists
          const updatePlaylistLike = (playlists: any[]) =>
            playlists.map(p => p.id === playlistId ? { ...p, isLiked: true } : p);
          
          set({
            featuredPlaylists: updatePlaylistLike(state.featuredPlaylists),
            newReleases: updatePlaylistLike(state.newReleases),
            trendingPlaylists: updatePlaylistLike(state.trendingPlaylists),
            recommendedPlaylists: updatePlaylistLike(state.recommendedPlaylists),
            searchResults: state.searchResults ? {
              ...state.searchResults,
              playlists: updatePlaylistLike(state.searchResults.playlists),
            } : null,
            selectedPlaylist: state.selectedPlaylist?.id === playlistId 
              ? { ...state.selectedPlaylist, isLiked: true }
              : state.selectedPlaylist,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to like playlist' });
        }
      },

      unlikePlaylist: async (playlistId: string) => {
        try {
          await catalogService.unlikePlaylist(playlistId);
          
          // Update local state
          const state = get();
          
          const updatePlaylistUnlike = (playlists: any[]) =>
            playlists.map(p => p.id === playlistId ? { ...p, isLiked: false } : p);
          
          set({
            featuredPlaylists: updatePlaylistUnlike(state.featuredPlaylists),
            newReleases: updatePlaylistUnlike(state.newReleases),
            trendingPlaylists: updatePlaylistUnlike(state.trendingPlaylists),
            recommendedPlaylists: updatePlaylistUnlike(state.recommendedPlaylists),
            searchResults: state.searchResults ? {
              ...state.searchResults,
              playlists: updatePlaylistUnlike(state.searchResults.playlists),
            } : null,
            selectedPlaylist: state.selectedPlaylist?.id === playlistId 
              ? { ...state.selectedPlaylist, isLiked: false }
              : state.selectedPlaylist,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to unlike playlist' });
        }
      },

      downloadPlaylist: async (playlistId: string) => {
        try {
          await catalogService.downloadPlaylist(playlistId);
          
          // Update local state
          const state = get();
          
          const updatePlaylistDownload = (playlists: any[]) =>
            playlists.map(p => p.id === playlistId ? { ...p, isDownloaded: true } : p);
          
          set({
            featuredPlaylists: updatePlaylistDownload(state.featuredPlaylists),
            newReleases: updatePlaylistDownload(state.newReleases),
            trendingPlaylists: updatePlaylistDownload(state.trendingPlaylists),
            recommendedPlaylists: updatePlaylistDownload(state.recommendedPlaylists),
            searchResults: state.searchResults ? {
              ...state.searchResults,
              playlists: updatePlaylistDownload(state.searchResults.playlists),
            } : null,
            selectedPlaylist: state.selectedPlaylist?.id === playlistId 
              ? { ...state.selectedPlaylist, isDownloaded: true }
              : state.selectedPlaylist,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to download playlist' });
        }
      },

      sharePlaylist: async (playlistId: string) => {
        try {
          return await catalogService.sharePlaylist(playlistId);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to share playlist' });
          throw error;
        }
      },

      likeTrack: async (trackId: string) => {
        try {
          await catalogService.likeTrack(trackId);
          
          // Update local state
          const state = get();
          
          const updateTrackLike = (tracks: any[]) =>
            tracks.map(t => t.id === trackId ? { ...t, isLiked: true } : t);
          
          set({
            playlistTracks: updateTrackLike(state.playlistTracks),
            searchResults: state.searchResults ? {
              ...state.searchResults,
              tracks: updateTrackLike(state.searchResults.tracks),
            } : null,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to like track' });
        }
      },

      unlikeTrack: async (trackId: string) => {
        try {
          await catalogService.unlikeTrack(trackId);
          
          // Update local state
          const state = get();
          
          const updateTrackUnlike = (tracks: any[]) =>
            tracks.map(t => t.id === trackId ? { ...t, isLiked: false } : t);
          
          set({
            playlistTracks: updateTrackUnlike(state.playlistTracks),
            searchResults: state.searchResults ? {
              ...state.searchResults,
              tracks: updateTrackUnlike(state.searchResults.tracks),
            } : null,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to unlike track' });
        }
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'catalog-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        // Only persist search history and filters
        searchHistory: state.searchHistory,
        filters: state.filters,
      }),
    }
  )
);

// Helper function to convert global filters to search filters
function convertGlobalFiltersToSearchFilters(
  globalFilters: FilterOptions, 
  query: string = ''
): SearchFilters {
  return {
    query,
    genres: globalFilters.genres || [],
    moods: globalFilters.moods || [],
    purposes: globalFilters.purposes || [],
    types: globalFilters.contentType === 'all' ? [] : [globalFilters.contentType || ''],
    audioQuality: globalFilters.quality ? [globalFilters.quality] : [],
    isPremiumOnly: globalFilters.quality === 'lossless',
    sortBy: 'relevance',
    sortOrder: 'desc',
    isOfflineAvailable: globalFilters.isOfflineAvailable,
    isLiked: globalFilters.isLiked,
    duration: globalFilters.duration,
    dateAdded: globalFilters.dateAdded,
  };
}
