import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { controlStyles as s } from '../../controls/controlStyles';
import type { ControlOption } from '../../controls/controlTypes';

const ACTIVE_WEIGHT = '700' as const;
const IDLE_WEIGHT = '400' as const;
const DETAIL_FONT = 12;
const DETAIL_GAP = 12;
const STACK_GAP = 2;
const DETAIL_BESIDE_MIN_MENU_WIDTH = 400;

const styles = StyleSheet.create({
  beside: { alignItems: 'baseline', flexDirection: 'row', gap: DETAIL_GAP, justifyContent: 'space-between' },
  stacked: { gap: STACK_GAP },
  shrink: { flexShrink: 1 },
  detail: { flexShrink: 1, fontSize: DETAIL_FONT },
});

export interface OptionRowColors {
  text: string;
  textSecondary?: string;
  border: string;
  surface: string;
  brand: string;
}

export interface OptionRowProps {
  option: ControlOption;
  isActive: boolean;
  isHighlighted: boolean;
  isListboxRow: boolean;
  menuWidth: number;
  hint: string;
  colors: OptionRowColors;
  testID: string;
  onSelect: (value: string) => void;
}

/** The DOM id `aria-activedescendant` points at; whitespace is replaced to keep it one token. */
export function optionDomId(testID: string, value: string): string {
  return `${testID}-option-${value}`.replace(/\s+/g, '_');
}

/** The DOM id `aria-controls` points at. */
export function listboxDomId(testID: string): string {
  return `${testID}-listbox`;
}

/** Whether a row has the width to show its detail beside the title instead of under it. */
export function isDetailBesideTitle(menuWidth: number): boolean {
  return menuWidth >= DETAIL_BESIDE_MIN_MENU_WIDTH;
}

function rowInk(colors: OptionRowColors, isActive: boolean, isHighlighted: boolean): { title: string; detail: string } {
  if (isHighlighted) return { title: colors.surface, detail: colors.surface };
  return { title: isActive ? colors.brand : colors.text, detail: colors.textSecondary ?? colors.text };
}

export function OptionRow({ option, isActive, isHighlighted, isListboxRow, menuWidth, hint, colors, testID, onSelect }: OptionRowProps): React.ReactElement {
  const hasDetail = option.detail !== undefined && option.detail !== '';
  const label = hasDetail ? `${option.label}, ${option.detail}` : option.label;
  const roleProps = isListboxRow
    ? { role: 'option' as const, tabIndex: -1 as const, id: optionDomId(testID, option.value), 'aria-selected': isHighlighted }
    : { accessibilityRole: 'menuitem' as const, 'aria-selected': isActive };
  const isBold = isActive || isHighlighted;
  const ink = rowInk(colors, isActive, isHighlighted);

  return (
    <Pressable
      {...roleProps}
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ selected: isActive }}
      onPress={() => onSelect(option.value)}
      style={[s.option, isHighlighted ? { backgroundColor: colors.text } : null]}
      testID={`${testID}-option-${option.value}`}
    >
      <View style={isDetailBesideTitle(menuWidth) ? styles.beside : styles.stacked}>
        <Text style={[s.optionText, styles.shrink, { color: ink.title, fontWeight: isBold ? ACTIVE_WEIGHT : IDLE_WEIGHT }]}>
          {option.label}
        </Text>
        {hasDetail ? <Text style={[styles.detail, { color: ink.detail }]}>{option.detail}</Text> : null}
      </View>
    </Pressable>
  );
}
