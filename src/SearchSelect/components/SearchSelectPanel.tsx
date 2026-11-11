import React, { useCallback, useEffect, useRef } from 'react';

import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { controlStyles as s, MENU_MAX_HEIGHT } from '../../controls/controlStyles';
import type { ControlOption } from '../../controls/controlTypes';
import type { DetailPlacement } from '../DetailPlacement';
import type { SearchSelectState } from '../hooks/useSearchSelectState';
import { SelectSurface } from '../SelectSurface';
import type { SearchSelectLabels } from '../types';
import type { SelectMotion } from '../utils/searchSelectMotion';
import { OptionSection } from './OptionSection';

const KEY_ESCAPE = 'Escape';
const PANEL_PAD = 8;
const PANEL_RADIUS = 8;
const PANEL_Z = 10;
const SHEET_MAX_HEIGHT = 480;

interface SearchSelectPanelProps {
  motion: SelectMotion;
  state: SearchSelectState;
  labels: SearchSelectLabels;
  placement: DetailPlacement;
  renderLeading?: (option: ControlOption) => React.ReactNode;
  selectedValue: string;
  testID: string;
}

/** The search box and the option list, sliding in as a sheet or unfolding under the field. */
export function SearchSelectPanel({ motion, state, labels, placement, renderLeading, selectedValue, testID }: SearchSelectPanelProps): React.ReactElement {
  const { theme } = useUi();
  const { colors } = theme;
  const progress = useRef(new Animated.Value(0)).current;
  const { durationMs } = motion;

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: durationMs, useNativeDriver: false }).start();
  }, [progress, durationMs]);

  const leave = useCallback((after: () => void) => {
    if (durationMs === 0) return after();
    Animated.timing(progress, { toValue: 0, duration: durationMs, useNativeDriver: false }).start(() => after());
  }, [progress, durationMs]);

  const { close, pick: pickNow, onKey, sections, highlight } = state;
  const dismiss = useCallback(() => leave(close), [leave, close]);
  const pick = useCallback((option: ControlOption) => leave(() => pickNow(option)), [leave, pickNow]);
  const submit = useCallback(() => {
    const option = sections.flat[highlight];
    if (option !== undefined) pick(option);
  }, [sections.flat, highlight, pick]);
  const onKeyPress = useCallback((key: string) => (key === KEY_ESCAPE ? dismiss() : onKey(key)), [dismiss, onKey]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [motion.fromY, 0] });
  const shared = { selectedValue, placement, renderLeading, onPick: pick, optionHint: labels.optionHint, testID, highlight };
  const list = (
    <View style={[styles.panel, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} testID={`${testID}-panel`}>
      <TextInput
        autoFocus
        accessibilityHint={labels.searchHint}
        accessibilityLabel={labels.search}
        placeholder={labels.search}
        placeholderTextColor={colors.textSecondary}
        style={[s.input, { color: colors.text, borderColor: colors.border }]}
        testID={`${testID}-search`}
        value={state.query}
        onChangeText={state.setQuery}
        onKeyPress={(event) => onKeyPress(event.nativeEvent.key)}
        onSubmitEditing={submit}
      />
      <ScrollView keyboardShouldPersistTaps="handled" style={motion.surface === SelectSurface.Sheet ? styles.sheetList : styles.dropList}>
        <OptionSection {...shared} offset={0} options={sections.recent} title={labels.recent} />
        <OptionSection {...shared} offset={sections.recent.length} options={sections.all} title={labels.all} />
        {sections.flat.length === 0 ? <Text style={[styles.empty, { color: colors.textSecondary }]}>{labels.empty}</Text> : null}
      </ScrollView>
    </View>
  );

  if (motion.surface === SelectSurface.Dropdown) {
    return <Animated.View style={[styles.dropdown, { opacity: progress, transform: [{ translateY }] }]}>{list}</Animated.View>;
  }
  return (
    <Modal transparent visible animationType="none" onRequestClose={dismiss}>
      <View style={styles.backdrop}>
        <Pressable accessibilityHint={labels.closeHint} accessibilityLabel={labels.close} accessibilityRole="button" style={StyleSheet.absoluteFill} testID={`${testID}-backdrop`} onPress={dismiss} />
        <Animated.View style={{ transform: [{ translateY }] }}>{list}</Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  panel: { borderWidth: 1, borderRadius: PANEL_RADIUS, padding: PANEL_PAD, gap: PANEL_PAD },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, zIndex: PANEL_Z },
  dropList: { maxHeight: MENU_MAX_HEIGHT },
  sheetList: { maxHeight: SHEET_MAX_HEIGHT },
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  empty: { padding: PANEL_PAD },
});
