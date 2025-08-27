import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme/ThemeProvider';
import { textStyles } from '../../theme/styles';

export const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: 'rgba(2, 19, 40, 0.3)',
      borderTopLeftRadius: borderRadius.md,
      borderTopRightRadius: borderRadius.md,
      paddingBottom: insets.bottom + spacing[5],
      paddingTop: spacing[2],
      paddingHorizontal: spacing[4],
      backdropFilter: 'blur(20px)',
      borderTopWidth: 0.5,
      borderTopColor: colors.border.white,
    },

    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing[2],
      gap: spacing[1],
    },

    iconContainer: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },

    label: {
      ...textStyles.caption,
      fontSize: 12,
      lineHeight: 12 * 1.5,
    },

    labelActive: {
      color: colors.white,
    },

    labelInactive: {
      color: colors.text.tertiary,
    },

    homeIndicator: {
      position: 'absolute',
      bottom: spacing[5],
      alignSelf: 'center',
      width: 134,
      height: 4,
      backgroundColor: colors.text.tertiary,
      borderRadius: 100,
    },
  });

  // Icon mapping
  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const iconColor = isFocused ? colors.white : colors.text.tertiary;
    
    switch (routeName) {
      case 'Home':
        return <Text style={{ color: iconColor, fontSize: 20 }}>🏠</Text>;
      case 'Search':
        return <Text style={{ color: iconColor, fontSize: 20 }}>🔍</Text>;
      case 'Library':
        return <Text style={{ color: iconColor, fontSize: 20 }}>📚</Text>;
      case 'Settings':
        return <Text style={{ color: iconColor, fontSize: 20 }}>⚙️</Text>;
      default:
        return <Text style={{ color: iconColor, fontSize: 20 }}>•</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
          >
            <View style={styles.iconContainer}>
              {getTabIcon(route.name, isFocused)}
            </View>
            
            <Text 
              style={[
                styles.label, 
                isFocused ? styles.labelActive : styles.labelInactive
              ]}
            >
              {typeof label === 'string' ? label : route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
      
      <View style={styles.homeIndicator} />
    </View>
  );
};
