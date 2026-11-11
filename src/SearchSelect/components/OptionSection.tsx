import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import type { ControlOption } from '../../controls/controlTypes';
import { OptionRow } from './OptionRow';

const ROW_PAD_H = 12;
const ROW_GAP = 8;
const HEADER_FONT = 11;

interface OptionSectionProps {
  title: string;
  options: readonly ControlOption[];
  offset: number;
  highlight: number;
  selectedValue: string;
  renderLeading?: (option: ControlOption) => React.ReactNode;
  renderDetail?: (option: ControlOption) => React.ReactNode;
  onPick: (option: ControlOption) => void;
  optionHint: string;
  testID: string;
}

/** One titled group of option rows (Recent or All). */
export function OptionSection({ title, options, offset, highlight, selectedValue, ...row }: OptionSectionProps): React.ReactElement | null {
  const { theme } = useUi();
  const { colors } = theme;
  if (options.length === 0) return null;
  return (
    <View>
      <Text accessibilityRole="header" style={[styles.header, { color: colors.textSecondary }]}>{title}</Text>
      {options.map((option, index) => (
        <OptionRow key={option.value} {...row} active={offset + index === highlight} current={option.value === selectedValue} option={option} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: HEADER_FONT, paddingHorizontal: ROW_PAD_H, paddingTop: ROW_GAP, textTransform: 'uppercase' },
});
