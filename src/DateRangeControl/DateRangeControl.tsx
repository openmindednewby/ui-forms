import React, { useState } from 'react';

import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

import { NativeDateRange } from './components/NativeDateRange';
import { WebDateRange } from './components/WebDateRange';
import { useDatePickerConfig } from '../DatePicker/hooks/useDatePickerConfig';
import { Field } from '../Field/Field';
import { GapOwnedProvider } from '../FormGrid/formGridContext';

import type { DateRangeValue } from '../controls/controlTypes';

const IS_WEB = Platform.OS === 'web';

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
  /** Draw the web `<from> – <to>` label; false when the caller already labels the field (default true). */
  showLabel?: boolean;
  /** PRE-LOCALIZED hint applied to BOTH inputs; defaults to `<fromLabel> – <toLabel>`. */
  accessibilityHint?: string;
  /** Merged LAST onto the row wrapper. */
  style?: StyleProp<ViewStyle>;
  /** Row is `${testID}-range`, inputs `${testID}-from` / `${testID}-to`. */
  testID: string;
}

/** An inclusive from/to date range: one field with a range calendar on web, two `DateField`s on native. */
export function DateRangeControl({
  value,
  onChange,
  onSubmit,
  fromLabel,
  toLabel,
  accessibilityHint,
  showLabel = true,
  style,
  testID,
}: DateRangeControlProps): React.ReactElement {
  const hint = accessibilityHint ?? `${fromLabel} – ${toLabel}`;
  const { labels } = useDatePickerConfig();
  const [typedError, setTypedError] = useState<string | undefined>(undefined);

  if (!IS_WEB) {
    return (
      <GapOwnedProvider value>
        <NativeDateRange fromLabel={fromLabel} hint={hint} style={style} testID={testID} toLabel={toLabel} value={value} onChange={onChange} onSubmit={onSubmit} />
      </GapOwnedProvider>
    );
  }
  return (
    <GapOwnedProvider value>
      <View style={style} testID={`${testID}-range`}>
        <Field error={typedError} label={showLabel ? `${fromLabel}${labels.rangeSeparator}${toLabel}` : undefined}>
          {(context) => (
            <WebDateRange context={context} fromLabel={fromLabel} hint={hint} testID={testID} toLabel={toLabel} value={value} onChange={onChange} onSubmit={onSubmit} onTypedError={setTypedError} />
          )}
        </Field>
      </View>
    </GapOwnedProvider>
  );
}

export default DateRangeControl;
