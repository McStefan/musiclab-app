import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../theme/ThemeProvider';
import { textStyles } from '../../theme/styles';
import { usePlayerControls, usePlayerModal } from '../../modules/player/hooks/useTrackPlayer';

export const PlayerMiniBar = () => {
  const navigation = useNavigation();
  const { colors, spacing, borderRadius } = useTheme();
  const { togglePlayPause, isPlaying, currentTrack } = usePlayerControls();
  const { showPlayerModal, canShowModal } = usePlayerModal();

  // Don't render if no track is playing
  if (!currentTrack || !canShowModal()) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 88, // Above tab bar
      left: 0,
      right: 0,
      marginHorizontal: spacing[4],
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 0.5,
      borderColor: colors.border.white,
      borderRadius: borderRadius.md,
      backdropFilter: 'blur(20px)',
      padding: spacing[2],
    },

    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },

    coverContainer: {
      width: 50,
      height: 50,
      borderRadius: borderRadius.sm,
      overflow: 'hidden',
      backgroundColor: colors.background.card,
    },

    cover: {
      width: '100%',
      height: '100%',
    },

    playButton: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },

    trackInfo: {
      flex: 1,
    },

    trackTitle: {
      ...textStyles.bodySmall,
      color: colors.white,
    },

    trackArtist: {
      ...textStyles.caption,
      color: colors.text.secondary,
    },

    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },

    controlButton: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const handlePress = () => {
    showPlayerModal();
  };

  const handlePlayPause = (e: any) => {
    e.stopPropagation();
    togglePlayPause();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <View style={styles.coverContainer}>
          {currentTrack.artwork ? (
            <Image
              source={{ uri: currentTrack.artwork }}
              style={styles.cover}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cover, { backgroundColor: colors.background.card, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: colors.text.secondary, fontSize: 20 }}>♪</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Text style={{ color: colors.white, fontSize: 18 }}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={{ color: colors.text.secondary, fontSize: 16 }}>❤️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
