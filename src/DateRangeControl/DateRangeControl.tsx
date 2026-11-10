import React from 'react';

import { View, type StyleProp, type ViewStyle } from 'react-native';

import { controlStyles as s } from '../controls/controlStyles';
import { DateField } from '../DateField/DateField';
import { GapOwnedProvider } from '../FormGrid/formGridContext';

import type { DateRangeValue } from '../controls/controlTypes';

export interface DateRangeControlProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  /** Called on Enter/submit in either side. */
  onSubmit?: () => void;
  /** PRE-LOCALIZED sub-label for the FROM input (e.g. "From"). Also its accessible name. */
  fromLabel: string;
  /** PRE-LOCALIZED sub-label for the TO input (e.g. "To"). Also its accessible name. */
  toLabel: string;
  /** @deprecated Ignored: a date input shows no typed format hint (DATE-INPUT-1). */
  fromPlaceholder?: string;
  /** @deprecated Ignored: a date input shows no typed format hint (DATE-INPUT-1). */
  toPlaceholder?: string;
  /** PRE-LOCALIZED hint applied to BOTH inputs; defaults to `<fromLabel> – <toLabel>`. */
  accessibilityHint?: string;
  /** Merged LAST onto the row wrapper. */
  style?: StyleProp<ViewStyle>;
  /** Row is `${testID}-range`, inputs `${testID}-from` / `${testID}-to`. */
  testID: string;
}

/** An inclusive from/to date pair of two shared `DateField`s; each edit patches only its own side. */
export function DateRangeControl({
  value,
  onChange,
  onSubmit,
  fromLabel,
  toLabel,
  accessibilityHint,
  style,
  testID,
}: DateRangeControlProps): React.ReactElement {
  const hint = accessibilityHint ?? `${fromLabel} – ${toLabel}`;

  return (
    <GapOwnedProvider value>
      <View style={[s.dateRow, style]} testID={`${testID}-range`}>
        <View style={s.dateCol}>
          <DateField
            accessibilityHint={hint}
            label={fromLabel}
            testID={`${testID}-from`}
            value={value.from}
            onChange={(from) => onChange({ from, to: value.to })}
            onSubmit={onSubmit}
          />
        </View>
        <View style={s.dateCol}>
          <DateField
            accessibilityHint={hint}
            label={toLabel}
            testID={`${testID}-to`}
            value={value.to}
            onChange={(to) => onChange({ from: value.from, to })}
            onSubmit={onSubmit}
          />
        </View>
      </View>
    </GapOwnedProvider>
  );
}

export default DateRangeControl;
