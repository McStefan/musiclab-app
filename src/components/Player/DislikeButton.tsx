import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { usePlayerStore } from '../../modules/player/store/playerStore';
import { useTheme } from '../../theme/ThemeProvider';
import { analyticsService } from '../../modules/analytics/services/AnalyticsService';

interface DislikeButtonProps {
  trackId?: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: any;
}

export const DislikeButton: React.FC<DislikeButtonProps> = ({
  trackId,
  size = 'medium',
  showLabel = false,
  style,
}) => {
  const { colors, spacing } = useTheme();
  const {
    currentTrack,
    dislikeTrack,
    undoDislike,
    isTrackDisliked,
    skipOnDislike,
  } = usePlayerStore();

  const [isAnimating, setIsAnimating] = useState(false);
  const animatedScale = useState(new Animated.Value(1))[0];
  const animatedOpacity = useState(new Animated.Value(1))[0];

  const targetTrackId = trackId || currentTrack?.id;
  const isDisliked = targetTrackId ? isTrackDisliked(targetTrackId) : false;

  const handlePress = async () => {
    if (!targetTrackId || isAnimating) return;

    setIsAnimating(true);

    // Animate button press
    Animated.sequence([
      Animated.parallel([
        Animated.timing(animatedScale, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.6,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(animatedScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsAnimating(false);
    });

    try {
      if (isDisliked) {
        await undoDislike(targetTrackId);
        analyticsService.trackUndoDislike(targetTrackId);
      } else {
        await dislikeTrack(targetTrackId);
        analyticsService.trackDislike(targetTrackId, {
          autoSkip: skipOnDislike,
          context: 'player_button',
        });
      }
    } catch (error) {
      console.error('Error handling dislike:', error);
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          buttonSize: 32,
          iconSize: 16,
          fontSize: 12,
        };
      case 'large':
        return {
          buttonSize: 56,
          iconSize: 28,
          fontSize: 16,
        };
      default: // medium
        return {
          buttonSize: 44,
          iconSize: 20,
          fontSize: 14,
        };
    }
  };

  const sizeConfig = getSizeConfig();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    button: {
      width: sizeConfig.buttonSize,
      height: sizeConfig.buttonSize,
      borderRadius: sizeConfig.buttonSize / 2,
      backgroundColor: isDisliked ? colors.status.error : 'transparent',
      borderWidth: isDisliked ? 0 : 1,
      borderColor: colors.border.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: targetTrackId ? 1 : 0.3,
    },
    buttonPressed: {
      backgroundColor: colors.status.error,
      borderColor: colors.status.error,
    },
    icon: {
      fontSize: sizeConfig.iconSize,
      color: isDisliked ? colors.white : colors.text.secondary,
    },
    label: {
      marginTop: spacing[1],
      fontSize: sizeConfig.fontSize,
      color: colors.text.secondary,
      fontWeight: '500',
    },
    disabledButton: {
      opacity: 0.3,
    },
  });

  if (!targetTrackId) {
    return null; // Don't render if no track
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        style,
        {
          transform: [{ scale: animatedScale }],
          opacity: animatedOpacity,
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          isAnimating && styles.buttonPressed,
        ]}
        onPress={handlePress}
        disabled={isAnimating}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>
          {isDisliked ? '👎' : '👎🏻'}
        </Text>
      </TouchableOpacity>
      
      {showLabel && (
        <Text style={styles.label}>
          {isDisliked ? 'Disliked' : 'Dislike'}
        </Text>
      )}
    </Animated.View>
  );
};
