import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFilterStore } from '../../stores/filterStore';
import { useTheme } from '../../theme/ThemeProvider';
import { Genre, Mood, Purpose } from '../../types/filters';

export const ActiveFilters: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const { 
    activeFilters, 
    hasActiveFilters, 
    clearFilter, 
    clearFilters,
    availableGenres,
    availableMoods,
    availablePurposes,
  } = useFilterStore();

  if (!hasActiveFilters) {
    return null;
  }

  const getLabelByValue = (value: string, type: 'genre' | 'mood' | 'purpose'): string => {
    let options;
    switch (type) {
      case 'genre':
        options = availableGenres;
        break;
      case 'mood':
        options = availableMoods;
        break;
      case 'purpose':
        options = availablePurposes;
        break;
    }
    
    const option = options.find(opt => opt.value === value);
    return option?.label || value;
  };

  const renderFilterChips = () => {
    const chips: JSX.Element[] = [];

    // Content Type
    if (activeFilters.contentType && activeFilters.contentType !== 'all') {
      chips.push(
        <FilterChip
          key="contentType"
          label={`Type: ${activeFilters.contentType}`}
          onRemove={() => clearFilter('contentType')}
        />
      );
    }

    // Genres
    if (activeFilters.genres && activeFilters.genres.length > 0) {
      activeFilters.genres.forEach((genre: Genre) => {
        chips.push(
          <FilterChip
            key={`genre-${genre}`}
            label={getLabelByValue(genre, 'genre')}
            category="Genre"
            onRemove={() => {
              const newGenres = activeFilters.genres?.filter(g => g !== genre) || [];
              if (newGenres.length === 0) {
                clearFilter('genres');
              } else {
                // Используем store action для обновления
                useFilterStore.getState().setGenres(newGenres);
              }
            }}
          />
        );
      });
    }

    // Moods
    if (activeFilters.moods && activeFilters.moods.length > 0) {
      activeFilters.moods.forEach((mood: Mood) => {
        chips.push(
          <FilterChip
            key={`mood-${mood}`}
            label={getLabelByValue(mood, 'mood')}
            category="Mood"
            onRemove={() => {
              const newMoods = activeFilters.moods?.filter(m => m !== mood) || [];
              if (newMoods.length === 0) {
                clearFilter('moods');
              } else {
                useFilterStore.getState().setMoods(newMoods);
              }
            }}
          />
        );
      });
    }

    // Purposes
    if (activeFilters.purposes && activeFilters.purposes.length > 0) {
      activeFilters.purposes.forEach((purpose: Purpose) => {
        chips.push(
          <FilterChip
            key={`purpose-${purpose}`}
            label={getLabelByValue(purpose, 'purpose')}
            category="Purpose"
            onRemove={() => {
              const newPurposes = activeFilters.purposes?.filter(p => p !== purpose) || [];
              if (newPurposes.length === 0) {
                clearFilter('purposes');
              } else {
                useFilterStore.getState().setPurposes(newPurposes);
              }
            }}
          />
        );
      });
    }

    // Quality
    if (activeFilters.quality) {
      chips.push(
        <FilterChip
          key="quality"
          label={`Quality: ${activeFilters.quality}`}
          onRemove={() => clearFilter('quality')}
        />
      );
    }

    // Offline filter
    if (activeFilters.isOfflineAvailable) {
      chips.push(
        <FilterChip
          key="offline"
          label="Available Offline"
          onRemove={() => clearFilter('isOfflineAvailable')}
        />
      );
    }

    // Liked filter
    if (activeFilters.isLiked) {
      chips.push(
        <FilterChip
          key="liked"
          label="Liked Only"
          onRemove={() => clearFilter('isLiked')}
        />
      );
    }

    return chips;
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    title: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.secondary,
    },
    clearAllButton: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
    },
    clearAllText: {
      fontSize: 12,
      color: colors.accent,
      fontWeight: '500',
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Filters</Text>
        <TouchableOpacity style={styles.clearAllButton} onPress={clearFilters}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {renderFilterChips()}
      </ScrollView>
    </View>
  );
};

interface FilterChipProps {
  label: string;
  category?: string;
  onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, category, onRemove }) => {
  const { colors, spacing, borderRadius } = useTheme();

  const styles = StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accent,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      borderRadius: borderRadius.lg,
      marginRight: spacing[2],
    },
    labelContainer: {
      flexDirection: 'column',
    },
    category: {
      fontSize: 10,
      color: colors.primary,
      opacity: 0.7,
      fontWeight: '400',
    },
    label: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    removeButton: {
      marginLeft: spacing[2],
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeText: {
      fontSize: 10,
      color: colors.accent,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.chip}>
      <View style={styles.labelContainer}>
        {category && <Text style={styles.category}>{category}</Text>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};
