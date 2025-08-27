import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { usePlayerStore } from '../../modules/player/store/playerStore';
import { useTheme } from '../../theme/ThemeProvider';

interface DislikedTracksListProps {
  onTrackPress?: (trackId: string) => void;
  showUndoButton?: boolean;
}

// Mock function to get track details by ID
// In real app, this would come from catalog store or API
const getTrackById = (trackId: string) => {
  return {
    id: trackId,
    title: `Track ${trackId.slice(0, 8)}`,
    artist: 'Unknown Artist',
    album: 'Unknown Album',
    artwork: `https://picsum.photos/300/300?random=${trackId}`,
    duration: 180,
  };
};

export const DislikedTracksList: React.FC<DislikedTracksListProps> = ({
  onTrackPress,
  showUndoButton = true,
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const {
    dislikedTracks,
    recentDislikes,
    undoDislike,
  } = usePlayerStore();

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDislikeTime = (trackId: string): string => {
    const dislike = recentDislikes.find(d => d.trackId === trackId);
    if (!dislike) return '';
    
    const now = Date.now();
    const diff = now - dislike.timestamp;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor(diff / (60 * 1000));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleUndoDislike = async (trackId: string, event: any) => {
    event.stopPropagation();
    try {
      await undoDislike(trackId);
    } catch (error) {
      console.error('Failed to undo dislike:', error);
    }
  };

  const renderTrackItem = ({ item: trackId }: { item: string }) => {
    const track = getTrackById(trackId);
    const dislikeTime = formatDislikeTime(trackId);

    return (
      <TouchableOpacity
        style={styles.trackItem}
        onPress={() => onTrackPress?.(trackId)}
        activeOpacity={0.7}
      >
        {/* Track artwork */}
        <Image
          source={{ uri: track.artwork }}
          style={styles.artwork}
          defaultSource={{ uri: 'https://via.placeholder.com/50x50/333/fff?text=♪' }}
        />
        
        {/* Track info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {track.artist}
          </Text>
          <Text style={styles.dislikeTime}>
            Disliked {dislikeTime}
          </Text>
        </View>
        
        {/* Track duration */}
        <View style={styles.trackMeta}>
          <Text style={styles.duration}>
            {formatDuration(track.duration)}
          </Text>
          
          {/* Undo button */}
          {showUndoButton && (
            <TouchableOpacity
              style={styles.undoButton}
              onPress={(event) => handleUndoDislike(trackId, event)}
            >
              <Text style={styles.undoButtonText}>Undo</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>👍</Text>
      <Text style={styles.emptyTitle}>No disliked tracks</Text>
      <Text style={styles.emptyDescription}>
        Tracks you dislike will appear here. You can always undo a dislike later.
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    trackItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    artwork: {
      width: 50,
      height: 50,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.background.secondary,
    },
    trackInfo: {
      flex: 1,
      marginLeft: spacing[3],
    },
    trackTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.primary,
      marginBottom: spacing[1],
    },
    trackArtist: {
      fontSize: 14,
      color: colors.text.secondary,
      marginBottom: spacing[1],
    },
    dislikeTime: {
      fontSize: 12,
      color: colors.text.tertiary,
    },
    trackMeta: {
      alignItems: 'flex-end',
    },
    duration: {
      fontSize: 12,
      color: colors.text.tertiary,
      marginBottom: spacing[2],
    },
    undoButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      borderRadius: borderRadius.sm,
    },
    undoButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: spacing[4],
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing[2],
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: 14,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    header: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.text.secondary,
      marginTop: spacing[1],
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      {dislikedTracks.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Disliked Tracks</Text>
          <Text style={styles.headerSubtitle}>
            {dislikedTracks.length} track{dislikedTracks.length !== 1 ? 's' : ''} disliked
          </Text>
        </View>
      )}
      
      {/* Track list */}
      <FlatList
        data={dislikedTracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
