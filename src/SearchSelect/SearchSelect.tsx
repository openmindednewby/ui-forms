import React, { useCallback, useRef } from 'react';

import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { controlStyles as s } from '../controls/controlStyles';
import type { ControlOption } from '../controls/controlTypes';
import { useRecentValues } from '../useRecentValues/useRecentValues';
import { SearchSelectPanel } from './components/SearchSelectPanel';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useRefocusOnClose } from './hooks/useRefocusOnClose';
import { useSearchSelectState } from './hooks/useSearchSelectState';
import type { SearchSelectLabels, SearchSelectTrigger } from './types';
import { findOption } from './utils/searchSelectModel';
import { resolveSelectMotion } from './utils/searchSelectMotion';

const CHEVRON = '▾';
const VALUE_GAP = 8;
const MIN_TOUCH = 44;
const NOTHING_ON_CLOSE = (): void => undefined;

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
  renderTrigger?: (trigger: SearchSelectTrigger) => React.ReactNode;
  onBlur?: () => void;
}

/** A select you can type into to filter; `renderTrigger` swaps the field box for your own visual; `onBlur` fires when focus leaves the closed field. */
export function SearchSelect(props: SearchSelectProps): React.ReactElement {
  const { options, value, onChange, accessibilityLabel, accessibilityHint, labels, testID, recentKey, renderLeading, renderDetail, renderTrigger, onBlur } = props;
  const { theme } = useUi();
  const { colors } = theme;
  const triggerRef = useRef<View>(null);
  const anchorRef = useRef<View>(null);
  const { width } = useWindowDimensions();
  const motion = resolveSelectMotion(width, useReducedMotion());
  const recents = useRecentValues(recentKey ?? `search-select:${testID}`);
  const state = useSearchSelectState(options, recents, onChange, NOTHING_ON_CLOSE);
  useRefocusOnClose(state.open, triggerRef);
  const selected = findOption(options, value);
  const onPress = state.open ? state.close : state.openList;
  const openRef = useRef(state.open);
  openRef.current = state.open;
  const onTriggerBlur = useCallback(() => {
    if (!openRef.current) onBlur?.();
  }, [onBlur]);

  return (
    <View ref={anchorRef} style={styles.anchor}>
      <Pressable
        ref={triggerRef}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ expanded: state.open }}
        style={renderTrigger === undefined ? [s.selectTrigger, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }] : styles.customTrigger}
        testID={testID}
        onBlur={onTriggerBlur}
        onPress={onPress}
      >
        {renderTrigger !== undefined ? renderTrigger({ open: state.open, selected, onPress, ref: triggerRef }) : (
          <FieldBoxContent colors={colors} placeholder={labels.placeholder} renderDetail={renderDetail} renderLeading={renderLeading} selected={selected} />
        )}
      </Pressable>
      {state.open ? <SearchSelectPanel anchorRef={anchorRef} labels={labels} motion={motion} renderDetail={renderDetail} renderLeading={renderLeading} selectedValue={value} state={state} testID={testID} /> : null}
    </View>
  );
}

interface FieldBoxContentProps {
  selected: ControlOption | null;
  placeholder: string;
  colors: { text: string; textSecondary: string };
  renderLeading?: (option: ControlOption) => React.ReactNode;
  renderDetail?: (option: ControlOption) => React.ReactNode;
}

function FieldBoxContent({ selected, placeholder, colors, renderLeading, renderDetail }: FieldBoxContentProps): React.ReactElement {
  return (
    <>
      <View style={styles.value}>
        {selected !== null && renderLeading !== undefined ? renderLeading(selected) : null}
        <Text numberOfLines={1} style={[s.selectTriggerText, { color: selected === null ? colors.textSecondary : colors.text }]}>{selected?.label ?? placeholder}</Text>
        {selected !== null ? <SelectedDetail colors={colors} option={selected} renderDetail={renderDetail} /> : null}
      </View>
      <Text aria-hidden style={[s.chevron, { color: colors.textSecondary }]}>{CHEVRON}</Text>
    </>
  );
}

interface SelectedDetailProps {
  option: ControlOption;
  colors: { textSecondary: string };
  renderDetail?: (option: ControlOption) => React.ReactNode;
}

function SelectedDetail({ option, colors, renderDetail }: SelectedDetailProps): React.ReactElement | null {
  if (renderDetail !== undefined) return <>{renderDetail(option)}</>;
  if (option.detail === undefined) return null;
  return <Text style={[s.selectTriggerText, { color: colors.textSecondary }]}>{option.detail}</Text>;
}

const styles = StyleSheet.create({
  anchor: { position: 'relative' },
  customTrigger: { minHeight: MIN_TOUCH, minWidth: MIN_TOUCH, alignSelf: 'flex-start', justifyContent: 'center' },
  value: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: VALUE_GAP },
});
