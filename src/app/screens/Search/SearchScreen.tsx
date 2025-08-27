import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '../../../ui';
import { useTheme } from '../../../theme/ThemeProvider';
import { layouts, textStyles, containers } from '../../../theme/styles';
import { StatusBar } from '../../../ui';

// Mock data for genres
const mockGenres = [
  { id: '1', label: 'Downtempo', imageUri: 'https://via.placeholder.com/150' },
  { id: '2', label: 'Chillstep', imageUri: 'https://via.placeholder.com/150' },
  { id: '3', label: 'Ambient', imageUri: 'https://via.placeholder.com/150' },
  { id: '4', label: 'Chillout', imageUri: 'https://via.placeholder.com/150' },
  { id: '5', label: 'Future Garage', imageUri: 'https://via.placeholder.com/150' },
  { id: '6', label: 'Lo Fi', imageUri: 'https://via.placeholder.com/150' },
  { id: '7', label: 'Deep house', imageUri: 'https://via.placeholder.com/150' },
  { id: '8', label: 'Synthwave', imageUri: 'https://via.placeholder.com/150' },
];

export const SearchScreen = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<'genre' | 'mood'>('genre');

  const styles = StyleSheet.create({
    container: {
      ...containers.screen,
    },
    
    header: {
      padding: spacing[4],
      paddingTop: spacing[20],
      gap: spacing[4],
    },
    
    title: {
      ...textStyles.h2,
    },
    
    filterTabs: {
      flexDirection: 'row',
      height: 36,
      gap: spacing[3],
    },
    
    filterTab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border.secondary,
    },
    
    filterTabActive: {
      backgroundColor: colors.white,
      borderColor: colors.white,
    },
    
    filterTabText: {
      ...textStyles.bodySmall,
      fontWeight: '700',
      color: colors.white,
    },
    
    filterTabTextActive: {
      color: colors.primary,
    },
    
    content: {
      flex: 1,
      padding: spacing[4],
    },
    
    genreGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[4],
    },
    
    genreCard: {
      width: '48%',
      aspectRatio: 1.77, // 188/106 from Figma
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      backgroundColor: colors.background.card,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      padding: spacing[4],
    },
    
    genreLabel: {
      ...textStyles.bodySmall,
      fontWeight: '500',
      color: colors.white,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar />
      
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'genre' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('genre')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'genre' && styles.filterTabTextActive,
              ]}
            >
              Genre
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'mood' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('mood')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'mood' && styles.filterTabTextActive,
              ]}
            >
              Mood
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.genreGrid}>
          {mockGenres.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              style={styles.genreCard}
              onPress={() => {
                // TODO: Navigate to search results with genre filter
                console.log('Selected genre:', genre.label);
              }}
            >
              <Text style={styles.genreLabel}>{genre.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
