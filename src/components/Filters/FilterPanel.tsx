import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useFilterStore } from '../../stores/filterStore';
import { useTheme } from '../../theme/ThemeProvider';
import { FilterSection } from './FilterSection';
import { Genre, Mood, Purpose, ContentType } from '../../types/filters';

export const FilterPanel: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const {
    isFilterOpen,
    activeFilters,
    availableGenres,
    availableMoods,
    availablePurposes,
    hasActiveFilters,
    setGenres,
    setMoods,
    setPurposes,
    setContentType,
    setQuality,
    setOfflineFilter,
    setLikedFilter,
    toggleFilterPanel,
    clearFilters,
    applyFilters,
  } = useFilterStore();

  const contentTypeOptions = [
    { value: 'all', label: 'All Content', count: 0 },
    { value: 'playlist', label: 'Playlists', count: 245 },
    { value: 'track', label: 'Tracks', count: 1847 },
    { value: 'visual', label: 'Visuals', count: 156 },
  ];

  const qualityOptions = [
    { value: 'standard', label: 'Standard (128kbps)', count: 0 },
    { value: 'high', label: 'High (320kbps)', count: 0 },
    { value: 'lossless', label: 'Lossless', count: 0 },
  ];

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      marginTop: 100,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    clearButton: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    clearButtonText: {
      color: colors.accent,
      fontSize: 16,
      fontWeight: '500',
    },
    scrollContent: {
      padding: spacing[4],
    },
    footer: {
      flexDirection: 'row',
      gap: spacing[3],
      padding: spacing[4],
      borderTopWidth: 1,
      borderTopColor: colors.border.secondary,
    },
    applyButton: {
      flex: 1,
      backgroundColor: colors.accent,
      paddingVertical: spacing[3],
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
    cancelButton: {
      flex: 1,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border.primary,
      paddingVertical: spacing[3],
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
    applyButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: colors.text.primary,
      fontSize: 16,
      fontWeight: '500',
    },
    activeFiltersIndicator: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
    },
  });

  return (
    <Modal
      visible={isFilterOpen}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={toggleFilterPanel}
    >
      <View style={styles.modal}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            {hasActiveFilters && (
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Sections */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
            
            {/* Content Type */}
            <FilterSection
              title="Content Type"
              type="single"
              options={contentTypeOptions}
              currentValue={activeFilters.contentType}
              onValueChange={(value) => setContentType(value as ContentType)}
            />

            {/* Genres */}
            <FilterSection
              title="Genres"
              type="multiple"
              options={availableGenres}
              currentValue={activeFilters.genres || []}
              onValueChange={(values) => setGenres(values as Genre[])}
            />

            {/* Moods */}
            <FilterSection
              title="Moods"
              type="multiple"
              options={availableMoods}
              currentValue={activeFilters.moods || []}
              onValueChange={(values) => setMoods(values as Mood[])}
            />

            {/* Purposes */}
            <FilterSection
              title="Purpose"
              type="multiple"
              options={availablePurposes}
              currentValue={activeFilters.purposes || []}
              onValueChange={(values) => setPurposes(values as Purpose[])}
            />

            {/* Audio Quality */}
            <FilterSection
              title="Audio Quality"
              type="single"
              options={qualityOptions}
              currentValue={activeFilters.quality}
              onValueChange={(value) => setQuality(value as any)}
            />

            {/* Quick Filters */}
            <FilterSection
              title="Quick Filters"
              type="multiple"
              options={[
                { value: 'offline', label: 'Available Offline', count: 0 },
                { value: 'liked', label: 'Liked Only', count: 0 },
              ]}
              currentValue={[
                ...(activeFilters.isOfflineAvailable ? ['offline'] : []),
                ...(activeFilters.isLiked ? ['liked'] : []),
              ]}
              onValueChange={(values) => {
                setOfflineFilter(values.includes('offline'));
                setLikedFilter(values.includes('liked'));
              }}
            />

          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleFilterPanel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
