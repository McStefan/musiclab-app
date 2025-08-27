import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface QualityOption {
  id: string;
  name: string;
  bitrate: string;
  description: string;
  premium?: boolean;
}

export const AudioQualityScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const [streamingQuality, setStreamingQuality] = useState('320kbps');
  const [downloadQuality, setDownloadQuality] = useState('320kbps');
  const [wifiOnlyDownloads, setWifiOnlyDownloads] = useState(true);
  const [smartDownloads, setSmartDownloads] = useState(false);

  const qualityOptions: QualityOption[] = [
    {
      id: '128kbps',
      name: 'Standard',
      bitrate: '128 kbps',
      description: 'Good quality, uses less data',
    },
    {
      id: '320kbps',
      name: 'High',
      bitrate: '320 kbps',
      description: 'Great quality, balanced data usage',
    },
    {
      id: 'lossless',
      name: 'Lossless',
      bitrate: 'FLAC',
      description: 'Best quality, uses more data',
      premium: true,
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
    sectionDescription: {
      fontSize: 14,
      color: colors.text.secondary,
      paddingHorizontal: spacing[4],
      marginBottom: spacing[4],
    },
    qualityOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
      backgroundColor: colors.background.secondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    selectedOption: {
      backgroundColor: `${colors.primary || '#007AFF'}15`,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border.primary,
      marginRight: spacing[3],
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedRadio: {
      borderColor: colors.primary || '#007AFF',
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary || '#007AFF',
    },
    qualityInfo: {
      flex: 1,
    },
    qualityName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.primary,
      marginBottom: 2,
    },
    qualityBitrate: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text.secondary,
      marginBottom: 2,
    },
    qualityDescription: {
      fontSize: 12,
      color: colors.text.secondary,
    },
    premiumBadge: {
      backgroundColor: colors.primary || '#007AFF',
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
      borderRadius: 4,
      marginLeft: spacing[2],
    },
    premiumText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: '600',
    },
    switchOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
      backgroundColor: colors.background.secondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    switchText: {
      flex: 1,
    },
    switchTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.primary,
      marginBottom: 2,
    },
    switchDescription: {
      fontSize: 14,
      color: colors.text.secondary,
    },
  });

  const renderQualitySection = (
    title: string,
    description: string,
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{description}</Text>
      {qualityOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.qualityOption,
            selectedValue === option.id && styles.selectedOption,
          ]}
          onPress={() => onSelect(option.id)}
        >
          <View
            style={[
              styles.radioButton,
              selectedValue === option.id && styles.selectedRadio,
            ]}
          >
            {selectedValue === option.id && <View style={styles.radioInner} />}
          </View>
          <View style={styles.qualityInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.qualityName}>{option.name}</Text>
              {option.premium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>PREMIUM</Text>
                </View>
              )}
            </View>
            <Text style={styles.qualityBitrate}>{option.bitrate}</Text>
            <Text style={styles.qualityDescription}>{option.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Audio Quality</Text>
      </View>

      <ScrollView>
        {renderQualitySection(
          'Streaming Quality',
          'Choose the audio quality for streaming music',
          streamingQuality,
          setStreamingQuality
        )}

        {renderQualitySection(
          'Download Quality',
          'Choose the audio quality for downloaded music',
          downloadQuality,
          setDownloadQuality
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Download Options</Text>
          
          <View style={styles.switchOption}>
            <View style={styles.switchText}>
              <Text style={styles.switchTitle}>Wi-Fi only downloads</Text>
              <Text style={styles.switchDescription}>
                Only download music when connected to Wi-Fi
              </Text>
            </View>
            <Switch
              value={wifiOnlyDownloads}
              onValueChange={setWifiOnlyDownloads}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={wifiOnlyDownloads ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.switchOption}>
            <View style={styles.switchText}>
              <Text style={styles.switchTitle}>Smart downloads</Text>
              <Text style={styles.switchDescription}>
                Automatically download new releases from your liked artists
              </Text>
            </View>
            <Switch
              value={smartDownloads}
              onValueChange={setSmartDownloads}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={smartDownloads ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
