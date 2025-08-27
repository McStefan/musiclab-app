import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [autoDownload, setAutoDownload] = React.useState(false);

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
      marginTop: spacing[6],
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
    arrow: {
      fontSize: 16,
      color: colors.text.secondary,
    },
    logoutButton: {
      backgroundColor: colors.error || '#ff4444',
      marginHorizontal: spacing[4],
      marginTop: spacing[6],
      paddingVertical: spacing[4],
      borderRadius: 12,
      alignItems: 'center',
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
    },
  });

  const navigationItems = [
    {
      title: 'Profile',
      subtitle: 'Personal information',
      screen: 'Profile',
    },
    {
      title: 'Subscription',
      subtitle: 'Manage your plan',
      screen: 'Subscription',
    },
    {
      title: 'Audio Quality',
      subtitle: 'Streaming & download quality',
      screen: 'AudioQuality',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {navigationItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>Get updates about new music</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Auto Download</Text>
              <Text style={styles.settingSubtitle}>Download liked tracks automatically</Text>
            </View>
            <Switch
              value={autoDownload}
              onValueChange={setAutoDownload}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoDownload ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
