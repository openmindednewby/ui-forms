import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { useUi } from '@dloizides/ui-feedback';

import type { ControlOption } from '../../controls/controlTypes';
import { useKeepInView } from '../../useKeepInView/useKeepInView';

const ROW_PAD_H = 12;
const ROW_GAP = 8;
const OPTION_FONT = 14;
const DETAIL_FONT = 12;

export interface OptionRowProps {
  option: ControlOption;
  active: boolean;
  current: boolean;
  renderLeading?: (option: ControlOption) => React.ReactNode;
  renderDetail?: (option: ControlOption) => React.ReactNode;
  onPick: (option: ControlOption) => void;
  optionHint: string;
  testID: string;
}

/** One option row; the highlighted row is announced as selected and kept in view. */
export function OptionRow({ option, active, current, renderLeading, renderDetail, onPick, optionHint, testID }: OptionRowProps): React.ReactElement {
  const { theme } = useUi();
  const { colors } = theme;
  const ref = useKeepInView(active ? option.value : null);
  const detailBelow = renderDetail === undefined && option.detail !== undefined;
  return (
    <Pressable
      ref={ref}
      accessibilityHint={optionHint}
      accessibilityLabel={option.label}
      accessibilityRole="button"
      accessibilityState={{ selected: active, checked: current }}
      style={[styles.row, active ? { backgroundColor: colors.surface } : null]}
      testID={`${testID}-option-${option.value}`}
      onPress={() => onPick(option)}
    >
      {renderLeading?.(option)}
      <View style={styles.label}>
        <Text style={[styles.primary, { color: colors.text }]}>{option.label}</Text>
        {detailBelow ? <Text style={[styles.secondary, { color: colors.textSecondary }]}>{option.detail}</Text> : null}
      </View>
      {renderDetail?.(option)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: MIN_TOUCH_TARGET_PX, flexDirection: 'row', alignItems: 'center', gap: ROW_GAP, paddingHorizontal: ROW_PAD_H },
  label: { flex: 1 },
  primary: { fontSize: OPTION_FONT, flexShrink: 1 },
  secondary: { fontSize: DETAIL_FONT },
});
