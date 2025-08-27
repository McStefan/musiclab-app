import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Card, Chip } from '../../../ui';
import { useTheme } from '../../../theme/ThemeProvider';
import { layouts, textStyles, containers } from '../../../theme/styles';
import { StatusBar } from '../../../ui';

// Mock data - would come from API
const mockPlaylists = [
  { id: '1', title: 'Flow in Silence', imageUri: 'https://via.placeholder.com/270x152' },
  { id: '2', title: 'Breathe. Work. Repeat.', imageUri: 'https://via.placeholder.com/270x152' },
  { id: '3', title: 'Deep Within', imageUri: 'https://via.placeholder.com/270x152' },
  { id: '4', title: 'Calm in Every Beat', imageUri: 'https://via.placeholder.com/270x152' },
];

const mockRelaxPlaylists = [
  { id: '5', title: 'No Borders. Just Sound.', imageUri: 'https://via.placeholder.com/270x152' },
  { id: '6', title: 'Power of Stillness', imageUri: 'https://via.placeholder.com/270x152' },
  { id: '7', title: 'Cold Morning Light', imageUri: 'https://via.placeholder.com/270x152' },
  { id: '8', title: 'Work Like a Whisper', imageUri: 'https://via.placeholder.com/270x152' },
];

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      ...containers.screen,
    },
    
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing[4],
      paddingTop: spacing[20],
    },
    
    logo: {
      ...textStyles.h2,
    },
    
    settingsButton: {
      width: 32,
      height: 32,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    heroSection: {
      padding: spacing[4],
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    heroCard: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
      padding: spacing[4],
      justifyContent: 'flex-end',
      backgroundColor: colors.background.card,
    },
    
    heroContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    
    heroText: {
      flex: 1,
      gap: spacing[2],
    },
    
    streamBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 32,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3],
      borderWidth: 0.5,
      borderColor: colors.border.white,
    },
    
    streamText: {
      ...textStyles.body,
      color: colors.white,
    },
    
    artBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 32,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3],
      borderWidth: 0.5,
      borderColor: colors.border.white,
    },
    
    playButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 0.5,
      borderColor: colors.border.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    content: {
      flex: 1,
    },
    
    section: {
      paddingVertical: spacing[4],
    },
    
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      marginBottom: spacing[4],
    },
    
    sectionTitle: {
      ...textStyles.h2,
    },
    
    playlistsContainer: {
      paddingLeft: spacing[4],
    },
    
    playlistItem: {
      marginRight: spacing[4],
    },
    
    scrollIndicator: {
      height: 4,
      width: 190,
      backgroundColor: colors.background.secondary,
      borderRadius: 9999,
      alignSelf: 'center',
      marginTop: spacing[4],
    },
  });

  const renderPlaylistItem = ({ item }: { item: any }) => (
    <View style={styles.playlistItem}>
      <Card
        title={item.title}
        imageUri={item.imageUri}
        size="medium"
        showGradient
        onPress={() => navigation.navigate('PlaylistDetail', { playlistId: item.id })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Music Lab</Text>
          <View style={styles.settingsButton}>
            <Text style={{ color: colors.white }}>⚙️</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.heroText}>
                <View style={styles.streamBadge}>
                  <Text style={styles.streamText}>Chill Stream</Text>
                </View>
              </View>
              
              <View style={styles.artBadge}>
                <Text style={styles.streamText}>Art</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Playlists for Work */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Playlists for Work</Text>
            </View>
            
            <FlatList
              data={mockPlaylists}
              renderItem={renderPlaylistItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.playlistsContainer}
            />
            
            <View style={styles.scrollIndicator} />
          </View>

          {/* Relax */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Relax</Text>
            </View>
            
            <FlatList
              data={mockRelaxPlaylists}
              renderItem={renderPlaylistItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.playlistsContainer}
            />
            
            <View style={styles.scrollIndicator} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
