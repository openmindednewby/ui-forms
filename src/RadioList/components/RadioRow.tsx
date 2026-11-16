import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ChipColors } from '../../ChipSelector/types';
import type { RadioOption } from '../types';
import type { RadioRowIdentity } from '../utils/radioRowIdentity';

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

export interface RadioRowProps<T> {
  option: RadioOption<T>;
  identity: RadioRowIdentity;
  colors: ChipColors;
  tabIndex?: 0 | -1;
  hostRef: (node: unknown) => void;
  onPress: () => void;
}

/** One full-width radio row: a dot, the option label and an optional description under it. */
export function RadioRow<T>({ option, identity, colors, tabIndex, hostRef, onPress }: RadioRowProps<T>): React.ReactElement {
  const { checked, disabled } = identity.accessibilityState;
  const accent = checked ? colors.primary : colors.border;
  const hasDescription = option.description !== undefined && option.description !== '';

  return (
    <Pressable
      ref={hostRef}
      accessibilityHint={option.hint}
      accessibilityLabel={identity.accessibilityLabel}
      accessibilityRole="radio"
      accessibilityState={identity.accessibilityState}
      aria-checked={checked}
      disabled={disabled}
      style={[styles.row, { borderColor: accent, backgroundColor: checked ? colors.tint : colors.muted }]}
      tabIndex={tabIndex}
      testID={identity.testID}
      onPress={onPress}
    >
      <View style={[styles.dot, { borderColor: accent }]}>
        {checked ? <View style={[styles.dotInner, { backgroundColor: colors.primary }]} /> : null}
      </View>
      <View style={styles.text}>
        <Text style={[styles.label, { color: checked ? colors.primary : colors.textStrong }]}>{option.label}</Text>
        {hasDescription ? (
          <Text style={[styles.description, { color: colors.textMuted }]} testID={`${identity.testID}-description`}>
            {option.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
