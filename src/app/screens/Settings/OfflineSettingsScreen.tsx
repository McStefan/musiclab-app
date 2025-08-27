import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

export const OfflineSettingsScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoOffline, setAutoOffline] = useState(true);
  const [offlineQuality, setOfflineQuality] = useState('high');

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
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
      backgroundColor: colors.background.secondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.primary,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    storageInfo: {
      backgroundColor: colors.background.secondary,
      margin: spacing[4],
      padding: spacing[4],
      borderRadius: 12,
    },
    storageTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing[2],
    },
    storageItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[2],
    },
    storageLabel: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    storageValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.primary,
    },
    button: {
      backgroundColor: colors.primary || '#007AFF',
      marginHorizontal: spacing[4],
      paddingVertical: spacing[4],
      borderRadius: 12,
      alignItems: 'center',
      marginTop: spacing[4],
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    dangerButton: {
      backgroundColor: colors.error || '#ff4444',
    },
  });

  const handleClearOfflineData = () => {
    Alert.alert(
      'Clear Offline Data',
      'This will remove all downloaded music. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          Alert.alert('Data Cleared', 'All offline data has been removed.');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Offline Settings</Text>
      </View>

      <ScrollView>
        {/* Offline Mode Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offline Mode</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Offline Mode</Text>
              <Text style={styles.settingSubtitle}>
                Play only downloaded music
              </Text>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={offlineMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Auto-offline mode</Text>
              <Text style={styles.settingSubtitle}>
                Automatically switch to offline when no internet
              </Text>
            </View>
            <Switch
              value={autoOffline}
              onValueChange={setAutoOffline}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoOffline ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Storage Information */}
        <View style={styles.storageInfo}>
          <Text style={styles.storageTitle}>Storage Usage</Text>
          <View style={styles.storageItem}>
            <Text style={styles.storageLabel}>Downloaded Music</Text>
            <Text style={styles.storageValue}>2.4 GB</Text>
          </View>
          <View style={styles.storageItem}>
            <Text style={styles.storageLabel}>Cache</Text>
            <Text style={styles.storageValue}>156 MB</Text>
          </View>
          <View style={styles.storageItem}>
            <Text style={styles.storageLabel}>Total Used</Text>
            <Text style={styles.storageValue}>2.6 GB</Text>
          </View>
          <View style={styles.storageItem}>
            <Text style={styles.storageLabel}>Available Space</Text>
            <Text style={styles.storageValue}>45.2 GB</Text>
          </View>
        </View>

        {/* Download Quality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Download Quality</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Quality</Text>
              <Text style={styles.settingSubtitle}>
                {offlineQuality === 'high' ? 'High (320 kbps)' : 'Standard (128 kbps)'}
              </Text>
            </View>
            <Text style={{ color: colors.text.secondary }}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Management */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Downloads</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]} 
          onPress={handleClearOfflineData}
        >
          <Text style={styles.buttonText}>Clear All Offline Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
