import React from 'react';

import { View, type StyleProp, type ViewStyle } from 'react-native';

import { controlStyles as s } from '../../controls/controlStyles';
import { DateField } from '../../DateField/DateField';

import type { DateRangeValue } from '../../controls/controlTypes';

export interface NativeDateRangeProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  onSubmit?: () => void;
  fromLabel: string;
  toLabel: string;
  hint: string;
  style?: StyleProp<ViewStyle>;
  testID: string;
}

/** Native: two shared `DateField`s side by side; each edit patches only its own side. */
export function NativeDateRange({ value, onChange, onSubmit, fromLabel, toLabel, hint, style, testID }: NativeDateRangeProps): React.ReactElement {
  return (
    <View style={[s.dateRow, style]} testID={`${testID}-range`}>
      <View style={s.dateCol}>
        <DateField accessibilityHint={hint} label={fromLabel} testID={`${testID}-from`} value={value.from} onChange={(from) => onChange({ from, to: value.to })} onSubmit={onSubmit} />
      </View>
      <View style={s.dateCol}>
        <DateField accessibilityHint={hint} label={toLabel} testID={`${testID}-to`} value={value.to} onChange={(to) => onChange({ from: value.from, to })} onSubmit={onSubmit} />
      </View>
    </View>
  );
}
