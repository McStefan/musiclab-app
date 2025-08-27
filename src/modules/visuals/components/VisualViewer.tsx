import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Text,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useVisualsStore } from '../store/visualsStore';
import { useTheme } from '../../../theme/ThemeProvider';
import { Visual } from '../types';

interface VisualViewerProps {
  visual: Visual;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onToggleControls?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const VisualViewer: React.FC<VisualViewerProps> = ({
  visual,
  isFullscreen = false,
  onToggleFullscreen,
  onToggleControls,
}) => {
  const { colors, spacing } = useTheme();
  const videoRef = useRef<Video>(null);
  
  const {
    isPlaying,
    currentTime,
    volume,
    isMuted,
    showControls,
    playbackRate,
    loop,
    playVideo,
    pauseVideo,
    seekToTime,
    setVolume,
    toggleMute,
  } = useVisualsStore();

  useEffect(() => {
    if (visual.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isPlaying, visual.type]);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      // Update store with current time and duration
      if (status.durationMillis && status.positionMillis !== undefined) {
        const newCurrentTime = status.positionMillis / 1000;
        const duration = status.durationMillis / 1000;
        
        // Only update if significantly changed to avoid too frequent updates
        if (Math.abs(newCurrentTime - currentTime) > 0.5) {
          seekToTime(newCurrentTime);
        }
      }
    }
  };

  const renderImageVisual = () => (
    <Image
      source={{ uri: visual.url }}
      style={[
        styles.media,
        isFullscreen && styles.fullscreenMedia,
      ]}
      resizeMode="contain"
      onError={(error) => {
        console.error('Error loading image:', error);
      }}
    />
  );

  const renderVideoVisual = () => (
    <Video
      ref={videoRef}
      style={[
        styles.media,
        isFullscreen && styles.fullscreenMedia,
      ]}
      source={{ uri: visual.url }}
      useNativeControls={false}
      resizeMode={ResizeMode.CONTAIN}
      isLooping={loop}
      isMuted={isMuted}
      volume={volume}
      rate={playbackRate}
      onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      onError={(error) => {
        console.error('Error loading video:', error);
      }}
    />
  );

  const renderControls = () => {
    if (!showControls || visual.type !== 'video') return null;

    return (
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={isPlaying ? pauseVideo : playVideo}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>
        
        {isFullscreen && onToggleFullscreen && (
          <TouchableOpacity
            style={styles.fullscreenButton}
            onPress={onToggleFullscreen}
          >
            <Text style={styles.controlButtonText}>⛶</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handlePress = () => {
    if (visual.type === 'video') {
      if (isPlaying) {
        pauseVideo();
      } else {
        playVideo();
      }
    }
    
    if (onToggleControls) {
      onToggleControls();
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.primary,
      ...(isFullscreen && {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }),
    },
    media: {
      width: '100%',
      aspectRatio: visual.aspectRatio || 16/9,
      backgroundColor: colors.background.secondary,
    },
    fullscreenMedia: {
      width: screenWidth,
      height: screenHeight,
      aspectRatio: undefined,
    },
    controls: {
      position: 'absolute',
      bottom: spacing[4],
      left: spacing[4],
      right: spacing[4],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    playButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButtonText: {
      fontSize: 24,
      color: colors.white,
    },
    fullscreenButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    controlButtonText: {
      fontSize: 16,
      color: colors.white,
    },
    touchArea: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  return (
    <View style={styles.container}>
      {isFullscreen && <StatusBar hidden />}
      
      <TouchableOpacity
        style={styles.touchArea}
        onPress={handlePress}
        activeOpacity={1}
      >
        {visual.type === 'video' ? renderVideoVisual() : renderImageVisual()}
      </TouchableOpacity>
      
      {renderControls()}
    </View>
  );
};
