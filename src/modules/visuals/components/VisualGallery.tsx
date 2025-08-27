import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { useVisualsStore } from '../store/visualsStore';
import { useTheme } from '../../../theme/ThemeProvider';
import { Visual } from '../types';

interface VisualGalleryProps {
  visuals: Visual[];
  onVisualPress: (visual: Visual) => void;
  numColumns?: number;
  showInfo?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export const VisualGallery: React.FC<VisualGalleryProps> = ({
  visuals,
  onVisualPress,
  numColumns = 2,
  showInfo = true,
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { likeVisual, unlikeVisual } = useVisualsStore();

  const itemWidth = (screenWidth - spacing[4] * 2 - spacing[2] * (numColumns - 1)) / numColumns;

  const handleLikePress = (visual: Visual, event: any) => {
    event.stopPropagation();
    
    if (visual.isLiked) {
      unlikeVisual(visual.id);
    } else {
      likeVisual(visual.id);
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderVisualItem = ({ item }: { item: Visual }) => {
    const styles = StyleSheet.create({
      itemContainer: {
        width: itemWidth,
        marginBottom: spacing[3],
      },
      imageContainer: {
        position: 'relative',
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        backgroundColor: colors.background.secondary,
      },
      image: {
        width: '100%',
        aspectRatio: item.aspectRatio || 1,
      },
      overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      typeIndicator: {
        position: 'absolute',
        top: spacing[2],
        left: spacing[2],
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.sm,
      },
      typeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
      },
      durationText: {
        position: 'absolute',
        bottom: spacing[2],
        right: spacing[2],
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.sm,
        color: colors.white,
        fontSize: 10,
        fontWeight: '500',
      },
      likeButton: {
        position: 'absolute',
        top: spacing[2],
        right: spacing[2],
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      likeIcon: {
        fontSize: 16,
      },
      playIcon: {
        fontSize: 32,
        color: colors.white,
      },
      info: {
        paddingTop: spacing[2],
      },
      title: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing[1],
      },
      metadata: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      author: {
        fontSize: 12,
        color: colors.text.secondary,
        flex: 1,
      },
      stats: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      statsText: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginLeft: spacing[1],
      },
      premiumBadge: {
        position: 'absolute',
        bottom: spacing[2],
        left: spacing[2],
        backgroundColor: colors.accent,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.sm,
      },
      premiumText: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '600',
      },
    });

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onVisualPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.thumbnailUrl || item.url }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Type indicator */}
          <View style={styles.typeIndicator}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          
          {/* Duration for videos */}
          {item.duration && (
            <Text style={styles.durationText}>
              {formatDuration(item.duration)}
            </Text>
          )}
          
          {/* Premium badge */}
          {item.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
          
          {/* Like button */}
          <TouchableOpacity
            style={styles.likeButton}
            onPress={(event) => handleLikePress(item, event)}
          >
            <Text style={[styles.likeIcon, { color: item.isLiked ? '#ff4757' : colors.white }]}>
              {item.isLiked ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
          
          {/* Play overlay for videos */}
          {item.type === 'video' && (
            <View style={styles.overlay}>
              <Text style={styles.playIcon}>▶️</Text>
            </View>
          )}
        </View>
        
        {/* Visual info */}
        {showInfo && (
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            
            <View style={styles.metadata}>
              <Text style={styles.author} numberOfLines={1}>
                {item.author || 'Unknown'}
              </Text>
              
              <View style={styles.stats}>
                <Text style={styles.statsText}>👁 {item.viewCount}</Text>
                <Text style={styles.statsText}>❤️ {item.likeCount}</Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    list: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
    },
    columnWrapper: {
      justifyContent: 'space-between',
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={visuals}
        renderItem={renderVisualItem}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
