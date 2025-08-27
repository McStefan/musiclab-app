import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface LibraryScreenProps {
  navigation: any;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigation }) => {
  const { colors, spacing } = useTheme();

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
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    section: {
      padding: spacing[4],
    },
    sectionButton: {
      backgroundColor: colors.background.secondary,
      padding: spacing[4],
      borderRadius: 12,
      marginBottom: spacing[3],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.text.secondary,
      marginTop: 2,
    },
    arrow: {
      fontSize: 16,
      color: colors.text.secondary,
    },
  });

  const sections = [
    {
      title: 'Liked Tracks',
      subtitle: 'Your favorite songs',
      screen: 'LikedTracks',
    },
    {
      title: 'Liked Playlists',
      subtitle: 'Saved playlists',
      screen: 'LikedPlaylists',
    },
    {
      title: 'Liked Visuals',
      subtitle: 'Saved videos and images',
      screen: 'LikedVisuals',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
      </View>

      <ScrollView style={styles.section}>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={styles.sectionButton}
            onPress={() => navigation.navigate(section.screen)}
          >
            <View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
