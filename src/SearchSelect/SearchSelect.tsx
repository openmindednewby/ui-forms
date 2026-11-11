import React, { useCallback, useRef } from 'react';

import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { controlStyles as s } from '../controls/controlStyles';
import type { ControlOption } from '../controls/controlTypes';
import { useRecentValues } from '../useRecentValues/useRecentValues';
import { SearchSelectPanel } from './components/SearchSelectPanel';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useSearchSelectState } from './hooks/useSearchSelectState';
import type { SearchSelectLabels } from './types';
import { findOption } from './utils/searchSelectModel';
import { resolveSelectMotion } from './utils/searchSelectMotion';

const CHEVRON = '▾';
const VALUE_GAP = 8;

export interface SearchSelectProps {
  options: readonly ControlOption[];
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  labels: SearchSelectLabels;
  testID: string;
  recentKey?: string;
  renderLeading?: (option: ControlOption) => React.ReactNode;
  renderDetail?: (option: ControlOption) => React.ReactNode;
}

/** A select you can type into to filter; the value is always a picked option, never typed text. */
export function SearchSelect(props: SearchSelectProps): React.ReactElement {
  const { options, value, onChange, accessibilityLabel, accessibilityHint, labels, testID, recentKey, renderLeading, renderDetail } = props;
  const { theme } = useUi();
  const { colors } = theme;
  const triggerRef = useRef<View>(null);
  const anchorRef = useRef<View>(null);
  const { width } = useWindowDimensions();
  const motion = resolveSelectMotion(width, useReducedMotion());
  const recents = useRecentValues(recentKey ?? `search-select:${testID}`);
  const refocus = useCallback(() => triggerRef.current?.focus(), []);
  const state = useSearchSelectState(options, recents, onChange, refocus);
  const selected = findOption(options, value);

  return (
    <View ref={anchorRef} style={styles.anchor}>
      <Pressable
        ref={triggerRef}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ expanded: state.open }}
        style={[s.selectTrigger, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}
        testID={testID}
        onPress={state.openList}
      >
        <View style={styles.value}>
          {selected !== null && renderLeading !== undefined ? renderLeading(selected) : null}
          <Text numberOfLines={1} style={[s.selectTriggerText, { color: selected === null ? colors.textSecondary : colors.text }]}>{selected?.label ?? labels.placeholder}</Text>
          {selected?.detail !== undefined ? <Text style={[s.selectTriggerText, { color: colors.textSecondary }]}>{selected.detail}</Text> : null}
        </View>
        <Text aria-hidden style={[s.chevron, { color: colors.textSecondary }]}>{CHEVRON}</Text>
      </Pressable>
      {state.open ? <SearchSelectPanel anchorRef={anchorRef} labels={labels} motion={motion} renderDetail={renderDetail} renderLeading={renderLeading} selectedValue={value} state={state} testID={testID} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { position: 'relative' },
  value: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: VALUE_GAP },
});
