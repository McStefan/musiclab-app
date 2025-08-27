import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterSectionProps {
  title: string;
  type: 'single' | 'multiple';
  options: FilterOption[];
  currentValue?: string | string[];
  onValueChange: (value: string | string[]) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  type,
  options,
  currentValue,
  onValueChange,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const handleOptionPress = (optionValue: string) => {
    if (type === 'single') {
      onValueChange(optionValue);
    } else {
      const currentValues = Array.isArray(currentValue) ? currentValue : [];
      const isSelected = currentValues.includes(optionValue);
      
      if (isSelected) {
        onValueChange(currentValues.filter(value => value !== optionValue));
      } else {
        onValueChange([...currentValues, optionValue]);
      }
    }
  };

  const isOptionSelected = (optionValue: string): boolean => {
    if (type === 'single') {
      return currentValue === optionValue;
    } else {
      const currentValues = Array.isArray(currentValue) ? currentValue : [];
      return currentValues.includes(optionValue);
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing[6],
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing[3],
    },
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    option: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border.secondary,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    optionText: {
      fontSize: 14,
      color: colors.text.secondary,
      fontWeight: '500',
    },
    optionTextSelected: {
      color: colors.primary,
    },
    countText: {
      fontSize: 12,
      color: colors.text.tertiary,
      marginLeft: spacing[1],
    },
    countTextSelected: {
      color: colors.primary,
      opacity: 0.8,
    },
    scrollContainer: {
      maxHeight: 200,
    },
  });

  const renderOptions = () => {
    // Для коротких списков показываем все опции
    if (options.length <= 8) {
      return (
        <View style={styles.optionsContainer}>
          {options.map((option) => {
            const isSelected = isOptionSelected(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => handleOptionPress(option.value)}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option.label}
                </Text>
                {option.count !== undefined && option.count > 0 && (
                  <Text style={[styles.countText, isSelected && styles.countTextSelected]}>
                    ({option.count})
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    // Для длинных списков добавляем прокрутку
    return (
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsContainer}>
          {options.map((option) => {
            const isSelected = isOptionSelected(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => handleOptionPress(option.value)}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option.label}
                </Text>
                {option.count !== undefined && option.count > 0 && (
                  <Text style={[styles.countText, isSelected && styles.countTextSelected]}>
                    ({option.count})
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {renderOptions()}
    </View>
  );
};
