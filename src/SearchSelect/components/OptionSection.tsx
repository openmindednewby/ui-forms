import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { useUi } from '@dloizides/ui-feedback';

import type { ControlOption } from '../../controls/controlTypes';
import { DetailPlacement } from '../DetailPlacement';
import { toRow } from '../utils/searchSelectModel';

const ROW_PAD_H = 12;
const ROW_GAP = 8;
const HEADER_FONT = 11;
const OPTION_FONT = 14;
const DETAIL_FONT = 12;

interface OptionSectionProps {
  title: string;
  options: readonly ControlOption[];
  offset: number;
  highlight: number;
  selectedValue: string;
  placement: DetailPlacement;
  renderLeading?: (option: ControlOption) => React.ReactNode;
  onPick: (option: ControlOption) => void;
  optionHint: string;
  testID: string;
}

/** One titled group of option rows (Recent or All). */
export function OptionSection({ title, options, offset, highlight, selectedValue, placement, renderLeading, onPick, optionHint, testID }: OptionSectionProps): React.ReactElement | null {
  const { theme } = useUi();
  const { colors } = theme;
  if (options.length === 0) return null;
  return (
    <View>
      <Text accessibilityRole="header" style={[styles.header, { color: colors.textSecondary }]}>{title}</Text>
      {options.map((option, index) => {
        const row = toRow(option, placement);
        const active = offset + index === highlight;
        return (
          <Pressable
            key={option.value}
            accessibilityHint={optionHint}
            accessibilityLabel={option.label}
            accessibilityRole="button"
            accessibilityState={{ selected: option.value === selectedValue }}
            style={[styles.row, active ? { backgroundColor: colors.surface } : null]}
            testID={`${testID}-option-${option.value}`}
            onPress={() => onPick(option)}
          >
            {renderLeading?.(option)}
            <View style={row.placement === DetailPlacement.End ? styles.inline : styles.stack}>
              <Text style={[styles.primary, { color: colors.text }]}>{row.primary}</Text>
              {row.secondary !== null ? <Text style={[styles.secondary, { color: colors.textSecondary }]}>{row.secondary}</Text> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: HEADER_FONT, paddingHorizontal: ROW_PAD_H, paddingTop: ROW_GAP, textTransform: 'uppercase' },
  row: { minHeight: MIN_TOUCH_TARGET_PX, flexDirection: 'row', alignItems: 'center', gap: ROW_GAP, paddingHorizontal: ROW_PAD_H },
  stack: { flex: 1 },
  inline: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', gap: ROW_GAP },
  primary: { fontSize: OPTION_FONT, flexShrink: 1 },
  secondary: { fontSize: DETAIL_FONT },
});
