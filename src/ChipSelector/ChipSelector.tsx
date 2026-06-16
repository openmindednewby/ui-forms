/**
 * Chip/pill selector for selecting one or multiple options.
 */
import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity, type TextStyle, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

const TRANSPARENT_COLOR = 'transparent';
const WHITE_COLOR = '#fff';

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipWrapper: {
    marginRight: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: TRANSPARENT_COLOR,
    borderWidth: 1,
  },
  chipText: {},
});

interface ThemeStyles {
  label: TextStyle;
  chip: ViewStyle;
  chipSelected: ViewStyle;
  chipText: TextStyle;
  chipTextSelected: TextStyle;
}

export interface ChipOption<T> {
  value: T;
  label: string;
}

export interface ChipSelectorProps<T> {
  label?: string;
  options: Array<ChipOption<T>>;
  value: T | T[];
  onChange: (value: T) => void;
  multiple?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const ChipSelector = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  multiple = false,
  disabled = false,
  containerStyle,
}: ChipSelectorProps<T>): React.ReactElement => {
  const { theme } = useUi();
  const { colors, palette } = theme;
  const primaryColor = palette.primary['500'];
  const hasLabel = typeof label === 'string' && label !== '';

  const themeStyles = React.useMemo<ThemeStyles>(() => {
    const labelStyle: TextStyle = { color: colors.text };
    const chipStyle: ViewStyle = { borderColor: colors.border };
    const chipSelectedStyle: ViewStyle = { backgroundColor: primaryColor };
    const chipTextStyle: TextStyle = { color: colors.text };
    const chipTextSelectedStyle: TextStyle = { color: WHITE_COLOR };
    return {
      label: labelStyle,
      chip: chipStyle,
      chipSelected: chipSelectedStyle,
      chipText: chipTextStyle,
      chipTextSelected: chipTextSelectedStyle,
    };
  }, [colors.border, colors.text, primaryColor]);

  function isSelected(optionValue: T): boolean {
    if (multiple && Array.isArray(value))
      return value.includes(optionValue);

    return value === optionValue;
  }

  return (
    <View style={containerStyle}>
      {hasLabel ? <Text style={[styles.label, themeStyles.label]}>{label}</Text> : null}
      <View style={styles.chipContainer}>
        {options.map((option) => {
          const selected = isSelected(option.value);
          return (
            <TouchableOpacity
              key={String(option.value)}
              accessibilityHint={`Selects ${option.label}`}
              accessibilityLabel={option.label}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              disabled={disabled}
              style={styles.chipWrapper}
              testID={`chip-selector-chip-${String(option.value)}`}
              onPress={() => onChange(option.value)}
            >
              <View
                style={[
                  styles.chip,
                  themeStyles.chip,
                  selected ? themeStyles.chipSelected : null,
                ]}
              >
                <Text style={[styles.chipText, themeStyles.chipText, selected ? themeStyles.chipTextSelected : null]}>
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ChipSelector;
