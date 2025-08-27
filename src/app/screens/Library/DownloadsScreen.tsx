import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface DownloadedItem {
  id: string;
  title: string;
  type: 'track' | 'playlist';
  size: string;
  downloadDate: string;
  duration?: string;
  trackCount?: number;
}

export const DownloadsScreen: React.FC = () => {
  const { colors, spacing } = useTheme();

  // Mock data for now
  const downloads: DownloadedItem[] = [
    {
      id: '1',
      title: 'Study Beats Playlist',
      type: 'playlist',
      size: '125 MB',
      downloadDate: '2 days ago',
      trackCount: 20,
      duration: '1h 30m',
    },
    {
      id: '2',
      title: 'Ambient Dreams',
      type: 'track',
      size: '8.5 MB',
      downloadDate: '1 week ago',
      duration: '3:45',
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
    subtitle: {
      fontSize: 14,
      color: colors.text.secondary,
      marginTop: 4,
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
    downloadItem: {
      flexDirection: 'row',
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      alignItems: 'center',
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.background.secondary,
      marginRight: spacing[3],
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconText: {
      fontSize: 18,
    },
    itemInfo: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 4,
    },
    itemMeta: {
      fontSize: 12,
      color: colors.text.secondary,
      marginBottom: 2,
    },
    itemDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    downloadInfo: {
      alignItems: 'flex-end',
    },
    size: {
      fontSize: 12,
      color: colors.text.secondary,
      fontWeight: '500',
    },
    downloadDate: {
      fontSize: 11,
      color: colors.text.secondary,
      marginTop: 2,
    },
  });

  const renderDownload = ({ item }: { item: DownloadedItem }) => (
    <TouchableOpacity style={styles.downloadItem}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>
          {item.type === 'playlist' ? '📁' : '🎵'}
        </Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemMeta}>
          {item.type === 'playlist' 
            ? `${item.trackCount} tracks • ${item.duration}`
            : `Track • ${item.duration}`
          }
        </Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemMeta}>Downloaded offline</Text>
        </View>
      </View>
      <View style={styles.downloadInfo}>
        <Text style={styles.size}>{item.size}</Text>
        <Text style={styles.downloadDate}>{item.downloadDate}</Text>
      </View>
    </TouchableOpacity>
  );

  const totalSize = downloads.reduce((total, item) => {
    const size = parseFloat(item.size.replace(/[^\d.]/g, ''));
    return total + size;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Downloads</Text>
        <Text style={styles.subtitle}>
          {downloads.length} items • {totalSize.toFixed(1)} MB used
        </Text>
      </View>

      {downloads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No downloads yet.{'\n'}Download your favorite music for offline listening!
          </Text>
        </View>
      ) : (
        <FlatList
          data={downloads}
          renderItem={renderDownload}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};
