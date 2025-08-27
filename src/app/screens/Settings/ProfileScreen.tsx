import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

export const ProfileScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [isEditing, setIsEditing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    editButton: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      backgroundColor: colors.primary || '#007AFF',
      borderRadius: 8,
    },
    editButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
    section: {
      margin: spacing[4],
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.background.secondary,
      alignSelf: 'center',
      marginBottom: spacing[4],
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 32,
      color: colors.text.primary,
    },
    fieldContainer: {
      marginBottom: spacing[4],
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing[2],
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: 8,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
      fontSize: 16,
      color: colors.text.primary,
      backgroundColor: colors.background.secondary,
    },
    readOnlyInput: {
      backgroundColor: colors.background.primary,
      color: colors.text.secondary,
    },
    saveButton: {
      backgroundColor: colors.primary || '#007AFF',
      marginHorizontal: spacing[4],
      paddingVertical: spacing[4],
      borderRadius: 12,
      alignItems: 'center',
      marginTop: spacing[4],
    },
    saveButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    dangerZone: {
      marginTop: spacing[6],
      paddingTop: spacing[4],
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
    },
    dangerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.error || '#ff4444',
      marginBottom: spacing[3],
      paddingHorizontal: spacing[4],
    },
    dangerButton: {
      backgroundColor: colors.error || '#ff4444',
      marginHorizontal: spacing[4],
      paddingVertical: spacing[4],
      borderRadius: 12,
      alignItems: 'center',
    },
    dangerButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const handleSave = () => {
    // Here you would save the changes
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // Handle account deletion
          Alert.alert('Account Deleted', 'Your account has been deleted.');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.readOnlyInput]}
              value={name}
              onChangeText={setName}
              editable={isEditing}
              placeholder="Enter your full name"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.readOnlyInput]}
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              placeholder="Enter your email"
              placeholderTextColor={colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
