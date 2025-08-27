import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

export const AboutScreen: React.FC = () => {
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
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    appInfo: {
      alignItems: 'center',
      padding: spacing[6],
    },
    appIcon: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: colors.primary || '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing[4],
    },
    appIconText: {
      fontSize: 32,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    appName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.primary,
      marginBottom: spacing[2],
    },
    appVersion: {
      fontSize: 16,
      color: colors.text.secondary,
      marginBottom: spacing[1],
    },
    appDescription: {
      fontSize: 14,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    section: {
      marginTop: spacing[4],
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      paddingHorizontal: spacing[4],
      marginBottom: spacing[3],
    },
    linkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
      backgroundColor: colors.background.secondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    linkText: {
      fontSize: 16,
      color: colors.text.primary,
    },
    arrow: {
      fontSize: 16,
      color: colors.text.secondary,
    },
    infoSection: {
      backgroundColor: colors.background.secondary,
      margin: spacing[4],
      padding: spacing[4],
      borderRadius: 12,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing[3],
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[2],
    },
    infoLabel: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.primary,
    },
    copyright: {
      fontSize: 12,
      color: colors.text.secondary,
      textAlign: 'center',
      padding: spacing[4],
      marginTop: spacing[4],
    },
  });

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const links = [
    {
      title: 'Privacy Policy',
      url: 'https://musiclab.com/privacy',
    },
    {
      title: 'Terms of Service',
      url: 'https://musiclab.com/terms',
    },
    {
      title: 'Support',
      url: 'https://musiclab.com/support',
    },
    {
      title: 'Website',
      url: 'https://musiclab.com',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About</Text>
      </View>

      <ScrollView>
        {/* App Information */}
        <View style={styles.appInfo}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>ML</Text>
          </View>
          <Text style={styles.appName}>MusicLab</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Your ultimate destination for focus music, study beats, and ambient soundscapes. 
            Curated playlists to enhance productivity and relaxation.
          </Text>
        </View>

        {/* App Details */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>App Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0 (Build 1)</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Updated</Text>
            <Text style={styles.infoValue}>December 10, 2024</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Size</Text>
            <Text style={styles.infoValue}>45.2 MB</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>React Native Expo</Text>
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          {links.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.linkItem}
              onPress={() => openLink(link.url)}
            >
              <Text style={styles.linkText}>{link.title}</Text>
              <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legal */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Legal</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Developer</Text>
            <Text style={styles.infoValue}>MusicLab Team</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Contact</Text>
            <Text style={styles.infoValue}>support@musiclab.com</Text>
          </View>
        </View>

        {/* Acknowledgments */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Acknowledgments</Text>
          <Text style={styles.infoValue}>
            Built with React Native, Expo, Zustand, React Query, and many other amazing open source libraries.
          </Text>
        </View>

        {/* Copyright */}
        <Text style={styles.copyright}>
          © 2024 MusicLab. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
};
