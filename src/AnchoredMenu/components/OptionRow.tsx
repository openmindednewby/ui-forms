import React from 'react';

import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { controlStyles as s } from '../../controls/controlStyles';
import type { ControlOption } from '../../controls/controlTypes';
import { COMPACT_VIEWPORT_MAX_WIDTH } from '../menuPortal';

const ACTIVE_WEIGHT = '700' as const;
const IDLE_WEIGHT = '400' as const;
const DETAIL_FONT = 12;
const DETAIL_GAP = 12;
const STACK_GAP = 2;

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
  brand: string;
}

export interface OptionRowProps {
  option: ControlOption;
  isActive: boolean;
  isHighlighted: boolean;
  isListboxRow: boolean;
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
export function isDetailBesideTitle(windowWidth: number): boolean {
  return windowWidth >= COMPACT_VIEWPORT_MAX_WIDTH;
}

export function OptionRow({ option, isActive, isHighlighted, isListboxRow, hint, colors, testID, onSelect }: OptionRowProps): React.ReactElement {
  const { width } = useWindowDimensions();
  const hasDetail = option.detail !== undefined && option.detail !== '';
  const label = hasDetail ? `${option.label}, ${option.detail}` : option.label;
  const roleProps = isListboxRow
    ? { role: 'option' as const, tabIndex: -1 as const, id: optionDomId(testID, option.value), 'aria-selected': isHighlighted }
    : { accessibilityRole: 'menuitem' as const, 'aria-selected': isActive };
  const isBold = isActive || isHighlighted;
  const titleColor = isActive ? colors.brand : colors.text;

  return (
    <Pressable
      {...roleProps}
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ selected: isActive }}
      onPress={() => onSelect(option.value)}
      style={[s.option, isHighlighted ? { backgroundColor: colors.border } : null]}
      testID={`${testID}-option-${option.value}`}
    >
      <View style={isDetailBesideTitle(width) ? styles.beside : styles.stacked}>
        <Text style={[s.optionText, styles.shrink, { color: titleColor, fontWeight: isBold ? ACTIVE_WEIGHT : IDLE_WEIGHT }]}>
          {option.label}
        </Text>
        {hasDetail ? <Text style={[styles.detail, { color: colors.textSecondary ?? colors.text }]}>{option.detail}</Text> : null}
      </View>
    </Pressable>
  );
}
