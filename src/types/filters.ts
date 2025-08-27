export type Genre = 
  | 'ambient' 
  | 'chill' 
  | 'electronic' 
  | 'lo-fi' 
  | 'classical' 
  | 'jazz' 
  | 'downtempo' 
  | 'meditation' 
  | 'nature' 
  | 'instrumental';

export type Mood = 
  | 'relaxed' 
  | 'focused' 
  | 'energetic' 
  | 'peaceful' 
  | 'uplifting' 
  | 'melancholic' 
  | 'nostalgic' 
  | 'inspiring' 
  | 'meditative' 
  | 'romantic';

export type Purpose = 
  | 'work' 
  | 'study' 
  | 'sleep' 
  | 'meditation' 
  | 'exercise' 
  | 'reading' 
  | 'coding' 
  | 'writing' 
  | 'relaxation' 
  | 'concentration';

export type ContentType = 
  | 'track' 
  | 'playlist' 
  | 'visual' 
  | 'all';

export interface FilterOptions {
  genres?: Genre[];
  moods?: Mood[];
  purposes?: Purpose[];
  contentType?: ContentType;
  duration?: {
    min?: number; // в минутах
    max?: number;
  };
  quality?: 'standard' | 'high' | 'lossless';
  isOfflineAvailable?: boolean;
  isLiked?: boolean;
  dateAdded?: {
    from?: string;
    to?: string;
  };
}

export interface FilterSection {
  id: string;
  title: string;
  type: 'single' | 'multiple' | 'range';
  options?: { value: string; label: string; count?: number }[];
  currentValue?: any;
}

export interface FilterState {
  activeFilters: FilterOptions;
  availableGenres: { value: Genre; label: string; count: number }[];
  availableMoods: { value: Mood; label: string; count: number }[];
  availablePurposes: { value: Purpose; label: string; count: number }[];
  isFilterOpen: boolean;
  hasActiveFilters: boolean;
}

export interface FilterActions {
  setGenres: (genres: Genre[]) => void;
  setMoods: (moods: Mood[]) => void;
  setPurposes: (purposes: Purpose[]) => void;
  setContentType: (type: ContentType) => void;
  setDuration: (duration: FilterOptions['duration']) => void;
  setQuality: (quality: FilterOptions['quality']) => void;
  setOfflineFilter: (isOffline: boolean) => void;
  setLikedFilter: (isLiked: boolean) => void;
  setDateRange: (dateRange: FilterOptions['dateAdded']) => void;
  clearFilters: () => void;
  clearFilter: (filterType: keyof FilterOptions) => void;
  toggleFilterPanel: () => void;
  applyFilters: () => void;
}

export type FilterStore = FilterState & FilterActions;
