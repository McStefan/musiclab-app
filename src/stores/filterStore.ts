import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FilterStore, FilterOptions, Genre, Mood, Purpose, ContentType } from '../types/filters';
import { mmkvStorage } from '../store/mmkvStorage';

// Mock data для доступных фильтров
const mockAvailableGenres = [
  { value: 'ambient' as Genre, label: 'Ambient', count: 45 },
  { value: 'chill' as Genre, label: 'Chill', count: 123 },
  { value: 'electronic' as Genre, label: 'Electronic', count: 67 },
  { value: 'lo-fi' as Genre, label: 'Lo-Fi', count: 89 },
  { value: 'classical' as Genre, label: 'Classical', count: 34 },
  { value: 'jazz' as Genre, label: 'Jazz', count: 28 },
  { value: 'downtempo' as Genre, label: 'Downtempo', count: 56 },
  { value: 'meditation' as Genre, label: 'Meditation', count: 23 },
  { value: 'nature' as Genre, label: 'Nature', count: 15 },
  { value: 'instrumental' as Genre, label: 'Instrumental', count: 78 },
];

const mockAvailableMoods = [
  { value: 'relaxed' as Mood, label: 'Relaxed', count: 156 },
  { value: 'focused' as Mood, label: 'Focused', count: 134 },
  { value: 'energetic' as Mood, label: 'Energetic', count: 67 },
  { value: 'peaceful' as Mood, label: 'Peaceful', count: 89 },
  { value: 'uplifting' as Mood, label: 'Uplifting', count: 45 },
  { value: 'melancholic' as Mood, label: 'Melancholic', count: 23 },
  { value: 'nostalgic' as Mood, label: 'Nostalgic', count: 34 },
  { value: 'inspiring' as Mood, label: 'Inspiring', count: 56 },
  { value: 'meditative' as Mood, label: 'Meditative', count: 28 },
  { value: 'romantic' as Mood, label: 'Romantic', count: 19 },
];

const mockAvailablePurposes = [
  { value: 'work' as Purpose, label: 'Work', count: 98 },
  { value: 'study' as Purpose, label: 'Study', count: 87 },
  { value: 'sleep' as Purpose, label: 'Sleep', count: 34 },
  { value: 'meditation' as Purpose, label: 'Meditation', count: 23 },
  { value: 'exercise' as Purpose, label: 'Exercise', count: 45 },
  { value: 'reading' as Purpose, label: 'Reading', count: 56 },
  { value: 'coding' as Purpose, label: 'Coding', count: 67 },
  { value: 'writing' as Purpose, label: 'Writing', count: 43 },
  { value: 'relaxation' as Purpose, label: 'Relaxation', count: 78 },
  { value: 'concentration' as Purpose, label: 'Concentration', count: 89 },
];

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeFilters: {
        contentType: 'all',
      },
      availableGenres: mockAvailableGenres,
      availableMoods: mockAvailableMoods,
      availablePurposes: mockAvailablePurposes,
      isFilterOpen: false,
      hasActiveFilters: false,

      // Actions
      setGenres: (genres: Genre[]) => {
        const currentFilters = get().activeFilters;
        const newFilters = { ...currentFilters, genres };
        set({ 
          activeFilters: newFilters,
          hasActiveFilters: hasActiveFilters(newFilters)
        });
      },

      setMoods: (moods: Mood[]) => {
        const currentFilters = get().activeFilters;
        const newFilters = { ...currentFilters, moods };
        set({ 
          activeFilters: newFilters,
          hasActiveFilters: hasActiveFilters(newFilters)
        });
      },

      setPurposes: (purposes: Purpose[]) => {
        const currentFilters = get().activeFilters;
        const newFilters = { ...currentFilters, purposes };
        set({ 
          activeFilters: newFilters,
          hasActiveFilters: hasActiveFilters(newFilters)
        });
      },

      setContentType: (contentType: ContentType) => {
        const currentFilters = get().activeFilters;
        const newFilters = { ...currentFilters, contentType };
        set({ 
          activeFilters: newFilters,
          hasActiveFilters: hasActiveFilters(newFilters)
        });
      },

      setDuration: (duration: FilterOptions['duration']) => {
        const currentFilters = get().activeFilters;
        const newFilters = { ...currentFilters, duration };
        set({ 
          activeFilters: newFilters,
          hasActiveFilters: hasActiveFilters(newFilters)
        });
      },

      setQuality: (quality: FilterOptions['quality']) => {
        const currentFilters = get().activeFilters;
        const newFilters = { ...currentFilters, quality };
        set({ 
          activeFilters: newFilters,
          hasActiveFilters: hasActiveFilters(newFilters)
        });
      },

      setOfflineFilter: (isOfflineAvailable: boolean) => {
        const currentFilters = get().activeFilters;
        const newFilters = { ...currentFilters, isOfflineAvailable };
        set({ 
          activeFilters: newFilters,
          hasActiveFilters: hasActiveFilters(newFilters)
        });
      },

      setLikedFilter: (isLiked: boolean) => {
        const currentFilters = get().activeFilters;
        const newFilters = { ...currentFilters, isLiked };
        set({ 
          activeFilters: newFilters,
          hasActiveFilters: hasActiveFilters(newFilters)
        });
      },

      setDateRange: (dateAdded: FilterOptions['dateAdded']) => {
        const currentFilters = get().activeFilters;
        const newFilters = { ...currentFilters, dateAdded };
        set({ 
          activeFilters: newFilters,
          hasActiveFilters: hasActiveFilters(newFilters)
        });
      },

      clearFilters: () => {
        set({ 
          activeFilters: { contentType: 'all' },
          hasActiveFilters: false
        });
      },

      clearFilter: (filterType: keyof FilterOptions) => {
        const currentFilters = get().activeFilters;
        const newFilters = { ...currentFilters };
        delete newFilters[filterType];
        
        // Всегда оставляем contentType
        if (!newFilters.contentType) {
          newFilters.contentType = 'all';
        }

        set({ 
          activeFilters: newFilters,
          hasActiveFilters: hasActiveFilters(newFilters)
        });
      },

      toggleFilterPanel: () => {
        set(state => ({ isFilterOpen: !state.isFilterOpen }));
      },

      applyFilters: () => {
        // В реальном приложении здесь бы был вызов API для загрузки отфильтрованных данных
        console.log('Applying filters:', get().activeFilters);
        set({ isFilterOpen: false });
      },
    }),
    {
      name: 'filter-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        // Сохраняем только активные фильтры
        activeFilters: state.activeFilters,
      }),
    }
  )
);

// Utility function to check if there are active filters
function hasActiveFilters(filters: FilterOptions): boolean {
  return Boolean(
    (filters.genres && filters.genres.length > 0) ||
    (filters.moods && filters.moods.length > 0) ||
    (filters.purposes && filters.purposes.length > 0) ||
    (filters.contentType && filters.contentType !== 'all') ||
    filters.duration ||
    filters.quality ||
    filters.isOfflineAvailable ||
    filters.isLiked ||
    filters.dateAdded
  );
}
