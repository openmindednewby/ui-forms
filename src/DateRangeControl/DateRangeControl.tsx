/**
 * `DateRangeControl` — an inclusive from/to pair (aml cases `from`/`to`, kefi audit `from`/`to`).
 * Each side is a `YYYY-MM-DD` text input; on web the browser's native date UI is offered via
 * `type="date"` (a react-native-web `TextInput` passes unknown props to the DOM input). Editing
 * either side patches ONLY that side, so the other survives the edit.
 *
 * Promoted out of `@dloizides/ui-tables`' private `Filters/fields/DateRangeField`, which is why
 * the fleet grew FIVE independent date fields.
 *
 * Label-free by design — the From/To sub-labels name the two HALVES; wrap in a `Field` for the
 * range's own label.
 */
import React from 'react';

import { TextInput, View, Text, type StyleProp, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { controlStyles as s } from '../controls/controlStyles';
import type { DateRangeValue } from '../controls/controlTypes';

const WEB_DATE_PROPS = typeof document !== 'undefined' ? { type: 'date' } : {};

export interface DateRangeControlProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  /** Called on Enter/submit in either side. */
  onSubmit?: () => void;
  /** PRE-LOCALIZED sub-label for the FROM input (e.g. "From"). Also its accessible name. */
  fromLabel: string;
  /** PRE-LOCALIZED sub-label for the TO input (e.g. "To"). Also its accessible name. */
  toLabel: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  /** PRE-LOCALIZED hint applied to BOTH inputs. */
  accessibilityHint?: string;
  /** Merged LAST onto the row wrapper. */
  style?: StyleProp<ViewStyle>;
  /** Row is `${testID}-range`, inputs `${testID}-from` / `${testID}-to`. */
  testID: string;
}

interface DateInputProps {
  side: 'from' | 'to';
  label: string;
  placeholder?: string;
  value: string;
  color: string;
  border: string;
  surface: string;
  muted: string;
  testID: string;
  hint?: string;
  onChangeText: (v: string) => void;
  onSubmit?: () => void;
}

function DateInput(p: DateInputProps): React.ReactElement {
  return (
    <View style={s.dateCol}>
      <Text style={[s.subLabel, { color: p.muted }]}>{p.label}</Text>
      <TextInput
        accessibilityLabel={p.label}
        accessibilityHint={p.hint}
        placeholder={p.placeholder}
        placeholderTextColor={p.muted}
        value={p.value}
        onChangeText={p.onChangeText}
        onSubmitEditing={p.onSubmit}
        style={[s.input, { borderColor: p.border, backgroundColor: p.surface, color: p.color }]}
        testID={`${p.testID}-${p.side}`}
        {...WEB_DATE_PROPS}
      />
    </View>
  );
}

export function DateRangeControl({
  value,
  onChange,
  onSubmit,
  fromLabel,
  toLabel,
  fromPlaceholder,
  toPlaceholder,
  accessibilityHint,
  style,
  testID,
}: DateRangeControlProps): React.ReactElement {
  const { theme } = useUi();
  const { colors } = theme;

  return (
    <View style={[s.dateRow, style]} testID={`${testID}-range`}>
      <DateInput
        side="from"
        label={fromLabel}
        placeholder={fromPlaceholder}
        value={value.from}
        color={colors.text}
        border={colors.border}
        surface={colors.surface}
        muted={colors.textSecondary}
        hint={accessibilityHint}
        testID={testID}
        onChangeText={(from) => onChange({ from, to: value.to })}
        onSubmit={onSubmit}
      />
      <DateInput
        side="to"
        label={toLabel}
        placeholder={toPlaceholder}
        value={value.to}
        color={colors.text}
        border={colors.border}
        surface={colors.surface}
        muted={colors.textSecondary}
        hint={accessibilityHint}
        testID={testID}
        onChangeText={(to) => onChange({ from: value.from, to })}
        onSubmit={onSubmit}
      />
    </View>
  );
}

export default DateRangeControl;
