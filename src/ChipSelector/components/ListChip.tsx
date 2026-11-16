import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ChipProps } from '../types';
import { listOptionLabel } from '../utils/listOptionLabel';

const MIN_TARGET_PX = 44;
const DOT_SIZE = 18;
const DOT_INNER = 8;
const ROW_GAP = 10;
const PAD_H = 12;
const PAD_V = 8;
const RADIUS = 8;
const LABEL_SIZE = 14;
const DESCRIPTION_SIZE = 12;
const DESCRIPTION_LINE = 16;

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderRadius: RADIUS,
    borderWidth: 1,
    columnGap: ROW_GAP,
    flexDirection: 'row',
    minHeight: MIN_TARGET_PX,
    paddingHorizontal: PAD_H,
    paddingVertical: PAD_V,
  },
  dot: { alignItems: 'center', borderRadius: DOT_SIZE / 2, borderWidth: 2, height: DOT_SIZE, justifyContent: 'center', width: DOT_SIZE },
  dotInner: { borderRadius: DOT_INNER / 2, height: DOT_INNER, width: DOT_INNER },
  text: { flex: 1, flexShrink: 1 },
  label: { fontSize: LABEL_SIZE, fontWeight: '600' },
  description: { fontSize: DESCRIPTION_SIZE, lineHeight: DESCRIPTION_LINE },
});

/** A full-width radio row: a dot, the option label and an optional description under it. */
export function ListChip<T extends string | number>(props: ChipProps<T>): React.ReactElement {
  const { option, selected, disabled, colors, testID, accessibilityHint, onPress } = props;
  const accent = selected ? colors.primary : colors.border;
  const hasDescription = option.description !== undefined && option.description !== '';

  return (
    <Pressable
      ref={props.hostRef}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={listOptionLabel(option)}
      accessibilityRole={props.accessibilityRole}
      accessibilityState={{ selected, disabled }}
      aria-checked={props.ariaChecked}
      aria-pressed={props.ariaPressed}
      disabled={disabled}
      style={[styles.row, { borderColor: accent, backgroundColor: selected ? colors.tint : colors.muted }]}
      tabIndex={props.tabIndex}
      testID={testID}
      onPress={onPress}
    >
      <View style={[styles.dot, { borderColor: accent }]}>
        {selected ? <View style={[styles.dotInner, { backgroundColor: colors.primary }]} /> : null}
      </View>
      <View style={styles.text}>
        <Text style={[styles.label, { color: selected ? colors.primary : colors.textStrong }]}>{option.label}</Text>
        {hasDescription ? (
          <Text style={[styles.description, { color: colors.textMuted }]} testID={`${testID}-description`}>
            {option.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
