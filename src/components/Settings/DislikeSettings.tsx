import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { usePlayerStore } from '../../modules/player/store/playerStore';
import { useTheme } from '../../theme/ThemeProvider';

export const DislikeSettings: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const {
    dislikedTracks,
    skipOnDislike,
    setSkipOnDislike,
    clearDislikedTracks,
    recentDislikes,
  } = usePlayerStore();

  const handleClearDislikes = () => {
    Alert.alert(
      'Clear Disliked Tracks',
      `Are you sure you want to clear all ${dislikedTracks.length} disliked tracks? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearDislikedTracks,
        },
      ]
    );
  };

  const getDislikeStats = () => {
    const last7Days = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentCount = recentDislikes.filter(d => d.timestamp > last7Days).length;
    
    return {
      total: dislikedTracks.length,
      thisWeek: recentCount,
    };
  };

  const stats = getDislikeStats();

  const styles = StyleSheet.create({
    container: {
      padding: spacing[4],
    },
    section: {
      marginBottom: spacing[6],
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing[3],
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    settingInfo: {
      flex: 1,
      marginRight: spacing[3],
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.primary,
      marginBottom: spacing[1],
    },
    settingDescription: {
      fontSize: 14,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    statsContainer: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.md,
      padding: spacing[4],
      marginBottom: spacing[4],
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    statsLabel: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    statsValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
    },
    clearButton: {
      backgroundColor: colors.status.error,
      borderRadius: borderRadius.md,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      alignItems: 'center',
      marginTop: spacing[4],
    },
    clearButtonDisabled: {
      backgroundColor: colors.background.secondary,
      opacity: 0.5,
    },
    clearButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    clearButtonTextDisabled: {
      color: colors.text.tertiary,
    },
    infoBox: {
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.md,
      padding: spacing[3],
      marginTop: spacing[4],
    },
    infoText: {
      fontSize: 13,
      color: colors.text.secondary,
      lineHeight: 18,
    },
  });

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dislike Settings</Text>
        
        {/* Auto-skip setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto-skip disliked tracks</Text>
            <Text style={styles.settingDescription}>
              Automatically skip to the next track when you dislike the current one
            </Text>
          </View>
          <Switch
            value={skipOnDislike}
            onValueChange={setSkipOnDislike}
            trackColor={{ 
              false: colors.border.secondary, 
              true: colors.accent 
            }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dislike Statistics</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Total disliked tracks</Text>
            <Text style={styles.statsValue}>{stats.total}</Text>
          </View>
          
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Disliked this week</Text>
            <Text style={styles.statsValue}>{stats.thisWeek}</Text>
          </View>
        </View>

        {/* Clear all button */}
        <TouchableOpacity
          style={[
            styles.clearButton,
            dislikedTracks.length === 0 && styles.clearButtonDisabled
          ]}
          onPress={handleClearDislikes}
          disabled={dislikedTracks.length === 0}
        >
          <Text style={[
            styles.clearButtonText,
            dislikedTracks.length === 0 && styles.clearButtonTextDisabled
          ]}>
            Clear All Disliked Tracks
          </Text>
        </TouchableOpacity>

        {/* Info box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Disliked tracks help us improve your music recommendations. 
            Your dislikes are stored locally and used to avoid playing 
            similar content in the future.
          </Text>
        </View>
      </View>
    </View>
  );
};
