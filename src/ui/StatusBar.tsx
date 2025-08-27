import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { StatusBar as RNStatusBar } from 'expo-status-bar';
import { useTheme } from '../theme/ThemeProvider';
import { textStyles } from '../theme/styles';

interface StatusBarProps {
  /** Custom style */
  style?: ViewStyle;
  /** Show dynamic island (iOS) */
  showDynamicIsland?: boolean;
  /** Dark mode */
  darkMode?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  style,
  showDynamicIsland = true,
  darkMode = false,
}) => {
  const { colors, spacing, borderRadius, sizes } = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: sizes.statusBar.height,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: spacing[4],
      backgroundColor: 'rgba(1, 7, 21, 0.01)',
      backdropFilter: 'blur(0px)',
    },

    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[2],
    },

    timeContainer: {
      flex: 1,
      alignItems: 'center',
    },

    time: {
      ...textStyles.systemTime,
      color: colors.white,
      textAlign: 'center',
    },

    dynamicIsland: {
      position: 'absolute',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing[2],
    },

    pill: {
      width: 138.21,
      height: 40.95,
      backgroundColor: colors.black,
      borderRadius: 76.78,
    },

    lens: {
      position: 'absolute',
      right: -4,
      top: 11.52,
      width: 17.92,
      height: 17.92,
    },

    lensOuter: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.system.island,
      borderRadius: 10,
      borderWidth: 1.38,
      borderColor: colors.system.islandBorder,
    },

    lensInner1: {
      position: 'absolute',
      top: 3.45,
      left: 6.89,
      width: 4.13,
      height: 4.13,
      backgroundColor: colors.system.lens,
      borderRadius: 2,
      filter: 'blur(2.76px)',
    },

    lensInner2: {
      position: 'absolute',
      top: 11.03,
      left: 7.58,
      width: 3.45,
      height: 3.45,
      backgroundColor: colors.system.lensSecondary,
      borderRadius: 2,
      filter: 'blur(2.76px)',
    },

    rightSide: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11.52,
      paddingRight: 29.24,
      paddingLeft: 9.24,
    },

    signalIcon: {
      width: 21.76,
      height: 15.36,
      backgroundColor: colors.white,
    },

    wifiIcon: {
      width: 21.76,
      height: 15.14,
      backgroundColor: colors.white,
    },

    batteryContainer: {
      width: 34.55,
      height: 16.64,
      position: 'relative',
    },

    batteryBody: {
      width: 31.99,
      height: 16.64,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderRadius: 5.12,
      borderWidth: 1,
      borderColor: colors.system.battery,
    },

    batteryFill: {
      width: 26.88,
      height: 16.64,
      backgroundColor: colors.black,
      borderRadius: '5.12px 0px 0px 5.12px',
    },

    batteryTip: {
      position: 'absolute',
      right: 0,
      top: 5.12,
      width: 3.84,
      height: 6.4,
      backgroundColor: colors.white,
      borderRadius: 2,
    },

    batteryPercentage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      ...textStyles.systemBattery,
      color: colors.white,
      textAlign: 'center',
      lineHeight: 16.64,
    },
  });

  // Get current time
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <>
      <RNStatusBar style={darkMode ? 'dark' : 'light'} />
      
      <View style={[styles.container, style]}>
        <View style={styles.content}>
          {/* Time */}
          <View style={styles.timeContainer}>
            <Text style={styles.time}>
              {currentTime}
            </Text>
          </View>

          {/* Dynamic Island (iOS) */}
          {showDynamicIsland && Platform.OS === 'ios' && (
            <View style={styles.dynamicIsland}>
              <View style={styles.pill}>
                <View style={styles.lens}>
                  <View style={styles.lensOuter}>
                    <View style={styles.lensInner1} />
                    <View style={styles.lensInner2} />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Right side - Signal, WiFi, Battery */}
          <View style={styles.rightSide}>
            {/* Signal */}
            <View style={styles.signalIcon} />
            
            {/* WiFi */}
            <View style={styles.wifiIcon} />
            
            {/* Battery */}
            <View style={styles.batteryContainer}>
              <View style={styles.batteryBody}>
                <View style={styles.batteryFill} />
              </View>
              <View style={styles.batteryTip} />
              <Text style={styles.batteryPercentage}>99</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
