import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

export const LikedTracksScreen: React.FC = () => {
  const { colors, spacing } = useTheme();

  // Mock data for now
  const likedTracks: Track[] = [
    {
      id: '1',
      title: 'Chill Vibes',
      artist: 'Ambient Artist',
      duration: '3:24',
    },
    {
      id: '2',
      title: 'Focus Flow',
      artist: 'Study Music',
      duration: '4:15',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing[4],
    },
    emptyText: {
      fontSize: 16,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    trackItem: {
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    trackTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 4,
    },
    trackInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    trackArtist: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    trackDuration: {
      fontSize: 14,
      color: colors.text.secondary,
    },
  });

  const renderTrack = ({ item }: { item: Track }) => (
    <TouchableOpacity style={styles.trackItem}>
      <Text style={styles.trackTitle}>{item.title}</Text>
      <View style={styles.trackInfo}>
        <Text style={styles.trackArtist}>{item.artist}</Text>
        <Text style={styles.trackDuration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liked Tracks</Text>
      </View>

      {likedTracks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No liked tracks yet.{'\n'}Start exploring and like your favorite songs!
          </Text>
        </View>
      ) : (
        <FlatList
          data={likedTracks}
          renderItem={renderTrack}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};
