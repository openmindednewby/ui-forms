import React from 'react';

import { Pressable, StyleSheet, Text } from 'react-native';

import { CHIP_HIT_SLOP } from '../../ChipSelector/constants';

import type { ControlOption } from '../../controls/controlTypes';

const REMOVE_GLYPH = '×';
const CHIP_GAP = 4;
const CHIP_PAD_H = 8;
const CHIP_PAD_V = 4;
const CHIP_RADIUS = 999;
const CHIP_FONT = 13;

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CHIP_GAP,
    paddingHorizontal: CHIP_PAD_H,
    paddingVertical: CHIP_PAD_V,
    borderWidth: 1,
    borderRadius: CHIP_RADIUS,
    maxWidth: '100%',
  },
  text: { fontSize: CHIP_FONT, flexShrink: 1 },
});

export interface SelectedChipColors {
  text: string;
  border: string;
  surface: string;
}

export interface SelectedChipProps {
  option: ControlOption;
  colors: SelectedChipColors;
  removeLabel: string;
  removeHint: string;
  onRemove: (value: string) => void;
  testID: string;
}

/** One chosen option inside a multi-select box; pressing it removes the option. */
export function SelectedChip({ option, colors, removeLabel, removeHint, onRemove, testID }: SelectedChipProps): React.ReactElement {
  return (
    <Pressable
      accessibilityHint={removeHint}
      accessibilityLabel={removeLabel}
      accessibilityRole="button"
      hitSlop={CHIP_HIT_SLOP}
      style={[styles.chip, { borderColor: colors.border, backgroundColor: colors.surface }]}
      testID={testID}
      onPress={() => onRemove(option.value)}
    >
      <Text numberOfLines={1} style={[styles.text, { color: colors.text }]}>{option.label}</Text>
      <Text aria-hidden style={[styles.text, { color: colors.text }]}>{REMOVE_GLYPH}</Text>
    </Pressable>
  );
}
