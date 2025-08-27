import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { useFilterStore } from '../../stores/filterStore';
import { useTheme } from '../../theme/ThemeProvider';

interface FilterButtonProps {
  style?: any;
  showLabel?: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ 
  style, 
  showLabel = true 
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { toggleFilterPanel, hasActiveFilters } = useFilterStore();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: hasActiveFilters ? colors.accent : colors.background.card,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: hasActiveFilters ? colors.accent : colors.border.primary,
      position: 'relative',
    },
    icon: {
      width: 20,
      height: 20,
      marginRight: showLabel ? spacing[2] : 0,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: hasActiveFilters ? colors.primary : colors.text.primary,
    },
    activeIndicator: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.status.warning,
    },
    filterIcon: {
      width: 16,
      height: 16,
      borderRadius: 2,
      backgroundColor: hasActiveFilters ? colors.primary : colors.text.secondary,
      marginRight: showLabel ? spacing[1] : 0,
    },
  });

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={toggleFilterPanel}
      activeOpacity={0.7}
    >
      {/* Simple filter icon */}
      <View style={styles.filterIcon} />
      
      {showLabel && (
        <Text style={styles.label}>
          {hasActiveFilters ? 'Filtered' : 'Filters'}
        </Text>
      )}
      
      {hasActiveFilters && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
};
