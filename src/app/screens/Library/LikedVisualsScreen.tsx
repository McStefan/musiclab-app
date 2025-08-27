import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface Visual {
  id: string;
  title: string;
  type: 'image' | 'video';
  duration?: string;
  associatedTrack?: string;
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 2 columns with padding

export const LikedVisualsScreen: React.FC = () => {
  const { colors, spacing } = useTheme();

  // Mock data for now
  const likedVisuals: Visual[] = [
    {
      id: '1',
      title: 'Sunset Meditation',
      type: 'video',
      duration: '3:24',
      associatedTrack: 'Calm Waves',
    },
    {
      id: '2',
      title: 'Forest Rain',
      type: 'image',
      associatedTrack: 'Nature Sounds',
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
    visualItem: {
      width: itemWidth,
      margin: spacing[2],
    },
    visualThumbnail: {
      width: '100%',
      height: itemWidth * 0.75,
      borderRadius: 8,
      backgroundColor: colors.background.secondary,
      marginBottom: spacing[2],
      justifyContent: 'center',
      alignItems: 'center',
    },
    typeIndicator: {
      fontSize: 12,
      color: colors.text.secondary,
      backgroundColor: colors.background.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      position: 'absolute',
      top: 8,
      right: 8,
    },
    visualTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 2,
    },
    visualMeta: {
      fontSize: 12,
      color: colors.text.secondary,
    },
  });

  const renderVisual = ({ item }: { item: Visual }) => (
    <TouchableOpacity style={styles.visualItem}>
      <View style={styles.visualThumbnail}>
        <Text style={styles.typeIndicator}>
          {item.type === 'video' ? '▶️' : '🖼️'}
        </Text>
      </View>
      <Text style={styles.visualTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.visualMeta}>
        {item.associatedTrack}
        {item.duration && ` • ${item.duration}`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liked Visuals</Text>
      </View>

      {likedVisuals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No liked visuals yet.{'\n'}Save beautiful videos and images that inspire you!
          </Text>
        </View>
      ) : (
        <FlatList
          data={likedVisuals}
          renderItem={renderVisual}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: spacing[2] }}
        />
      )}
    </View>
  );
};
