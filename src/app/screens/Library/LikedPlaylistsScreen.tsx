import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface Playlist {
  id: string;
  title: string;
  trackCount: number;
  duration: string;
  thumbnail?: string;
}

export const LikedPlaylistsScreen: React.FC = () => {
  const { colors, spacing } = useTheme();

  // Mock data for now
  const likedPlaylists: Playlist[] = [
    {
      id: '1',
      title: 'Study Focus',
      trackCount: 25,
      duration: '1h 45m',
    },
    {
      id: '2',
      title: 'Chill Vibes',
      trackCount: 18,
      duration: '1h 12m',
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
    playlistItem: {
      flexDirection: 'row',
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    thumbnail: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: colors.background.secondary,
      marginRight: spacing[3],
    },
    playlistInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    playlistTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 4,
    },
    playlistMeta: {
      fontSize: 14,
      color: colors.text.secondary,
    },
  });

  const renderPlaylist = ({ item }: { item: Playlist }) => (
    <TouchableOpacity style={styles.playlistItem}>
      <View style={styles.thumbnail} />
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle}>{item.title}</Text>
        <Text style={styles.playlistMeta}>
          {item.trackCount} tracks • {item.duration}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liked Playlists</Text>
      </View>

      {likedPlaylists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No liked playlists yet.{'\n'}Discover and save your favorite playlists!
          </Text>
        </View>
      ) : (
        <FlatList
          data={likedPlaylists}
          renderItem={renderPlaylist}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};
