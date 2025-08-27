import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

export const SubscriptionScreen: React.FC = () => {
  const { colors, spacing } = useTheme();

  // Mock subscription data
  const currentPlan = {
    name: 'Premium',
    price: '$9.99/month',
    renewalDate: 'December 15, 2024',
    features: [
      'Lossless audio quality',
      'Unlimited downloads',
      'No ads',
      'Background playback',
      'Premium visuals',
    ],
  };

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
    currentPlanCard: {
      margin: spacing[4],
      padding: spacing[4],
      backgroundColor: colors.background.secondary,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.primary || '#007AFF',
    },
    planBadge: {
      backgroundColor: colors.primary || '#007AFF',
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      borderRadius: 6,
      alignSelf: 'flex-start',
      marginBottom: spacing[3],
    },
    planBadgeText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    planName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text.primary,
      marginBottom: spacing[1],
    },
    planPrice: {
      fontSize: 16,
      color: colors.text.secondary,
      marginBottom: spacing[3],
    },
    renewalInfo: {
      fontSize: 14,
      color: colors.text.secondary,
      marginBottom: spacing[4],
    },
    featuresTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing[2],
    },
    feature: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    featureCheck: {
      fontSize: 16,
      color: colors.primary || '#007AFF',
      marginRight: spacing[2],
    },
    featureText: {
      fontSize: 14,
      color: colors.text.primary,
    },
    section: {
      margin: spacing[4],
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing[3],
    },
    button: {
      backgroundColor: colors.background.secondary,
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[4],
      borderRadius: 12,
      marginBottom: spacing[3],
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.primary,
      textAlign: 'center',
    },
    dangerButton: {
      backgroundColor: colors.error || '#ff4444',
    },
    dangerButtonText: {
      color: '#ffffff',
    },
    primaryButton: {
      backgroundColor: colors.primary || '#007AFF',
    },
    primaryButtonText: {
      color: '#ffffff',
    },
  });

  const handleManageBilling = () => {
    Alert.alert('Manage Billing', 'Redirecting to billing portal...');
  };

  const handleChangePlan = () => {
    Alert.alert('Change Plan', 'Plan options will be shown here.');
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => {
          Alert.alert('Subscription Cancelled', 'Your subscription has been cancelled.');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription</Text>
      </View>

      <ScrollView>
        {/* Current Plan */}
        <View style={styles.currentPlanCard}>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>CURRENT PLAN</Text>
          </View>
          
          <Text style={styles.planName}>{currentPlan.name}</Text>
          <Text style={styles.planPrice}>{currentPlan.price}</Text>
          <Text style={styles.renewalInfo}>
            Renews on {currentPlan.renewalDate}
          </Text>

          <Text style={styles.featuresTitle}>Included Features:</Text>
          {currentPlan.features.map((feature, index) => (
            <View key={index} style={styles.feature}>
              <Text style={styles.featureCheck}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Management Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage Subscription</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={handleChangePlan}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Change Plan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleManageBilling}>
            <Text style={styles.buttonText}>Manage Billing</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.dangerButton]} 
            onPress={handleCancelSubscription}
          >
            <Text style={[styles.buttonText, styles.dangerButtonText]}>
              Cancel Subscription
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
