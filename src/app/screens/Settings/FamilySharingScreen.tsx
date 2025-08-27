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

interface FamilyMember {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  joinDate: string;
}

export const FamilySharingScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const [inviteEmail, setInviteEmail] = useState('');

  // Mock family members data
  const familyMembers: FamilyMember[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      status: 'active',
      joinDate: 'Owner',
    },
    {
      id: '2',
      email: 'jane.doe@example.com',
      name: 'Jane Doe',
      status: 'active',
      joinDate: 'Nov 15, 2024',
    },
    {
      id: '3',
      email: 'teen.doe@example.com',
      name: 'Teen Doe',
      status: 'pending',
      joinDate: 'Invited Dec 1, 2024',
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
    planInfo: {
      backgroundColor: colors.background.secondary,
      margin: spacing[4],
      padding: spacing[4],
      borderRadius: 12,
    },
    planTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing[2],
    },
    planDetail: {
      fontSize: 14,
      color: colors.text.secondary,
      marginBottom: spacing[1],
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
    inviteSection: {
      backgroundColor: colors.background.secondary,
      margin: spacing[4],
      padding: spacing[4],
      borderRadius: 12,
    },
    inviteTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing[3],
    },
    inviteInput: {
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: 8,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
      fontSize: 16,
      color: colors.text.primary,
      backgroundColor: colors.background.primary,
      marginBottom: spacing[3],
    },
    inviteButton: {
      backgroundColor: colors.primary || '#007AFF',
      paddingVertical: spacing[3],
      borderRadius: 8,
      alignItems: 'center',
    },
    inviteButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    memberItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
      backgroundColor: colors.background.secondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary || '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[3],
    },
    avatarText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.primary,
      marginBottom: 2,
    },
    memberEmail: {
      fontSize: 14,
      color: colors.text.secondary,
      marginBottom: 2,
    },
    memberStatus: {
      fontSize: 12,
      fontWeight: '500',
    },
    statusActive: {
      color: '#4CAF50',
    },
    statusPending: {
      color: '#FF9800',
    },
    statusInactive: {
      color: '#757575',
    },
    memberActions: {
      alignItems: 'flex-end',
    },
    actionButton: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: 6,
      marginBottom: spacing[1],
    },
    removeButton: {
      backgroundColor: colors.error || '#ff4444',
    },
    resendButton: {
      backgroundColor: colors.primary || '#007AFF',
    },
    actionButtonText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    memberJoinDate: {
      fontSize: 12,
      color: colors.text.secondary,
    },
  });

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    
    Alert.alert(
      'Invitation Sent',
      `An invitation has been sent to ${inviteEmail}`,
      [{ text: 'OK', onPress: () => setInviteEmail('') }]
    );
  };

  const handleRemoveMember = (member: FamilyMember) => {
    Alert.alert(
      'Remove Member',
      `Remove ${member.name} from your family plan?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          Alert.alert('Member Removed', `${member.name} has been removed from your family plan.`);
        }},
      ]
    );
  };

  const handleResendInvite = (member: FamilyMember) => {
    Alert.alert('Invitation Resent', `Invitation resent to ${member.email}`);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'pending': return styles.statusPending;
      default: return styles.statusInactive;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Family Sharing</Text>
      </View>

      <ScrollView>
        {/* Plan Information */}
        <View style={styles.planInfo}>
          <Text style={styles.planTitle}>Family Premium Plan</Text>
          <Text style={styles.planDetail}>• Up to 6 family members</Text>
          <Text style={styles.planDetail}>• Individual accounts for each member</Text>
          <Text style={styles.planDetail}>• Premium features for everyone</Text>
          <Text style={styles.planDetail}>• $14.99/month</Text>
        </View>

        {/* Invite New Member */}
        <View style={styles.inviteSection}>
          <Text style={styles.inviteTitle}>Invite Family Member</Text>
          <TextInput
            style={styles.inviteInput}
            value={inviteEmail}
            onChangeText={setInviteEmail}
            placeholder="Enter email address"
            placeholderTextColor={colors.text.secondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.inviteButton} onPress={handleInviteMember}>
            <Text style={styles.inviteButtonText}>Send Invitation</Text>
          </TouchableOpacity>
        </View>

        {/* Family Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Members ({familyMembers.length}/6)</Text>
          {familyMembers.map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(member.name)}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberEmail}>{member.email}</Text>
                <Text style={[styles.memberStatus, getStatusStyle(member.status)]}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </Text>
              </View>
              <View style={styles.memberActions}>
                <Text style={styles.memberJoinDate}>{member.joinDate}</Text>
                {member.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.resendButton]}
                    onPress={() => handleResendInvite(member)}
                  >
                    <Text style={styles.actionButtonText}>Resend</Text>
                  </TouchableOpacity>
                )}
                {member.joinDate !== 'Owner' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() => handleRemoveMember(member)}
                  >
                    <Text style={styles.actionButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
