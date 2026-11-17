import React from 'react';

import { StyleSheet, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { controlStyles as s } from '../controls/controlStyles';

import type { SelectControlProps } from './SelectControl';

const NATIVE_SELECT_BOX: React.CSSProperties = {
  borderStyle: 'solid',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  width: '100%',
};

function nativeSelectStyle(borderColor: string, backgroundColor: string, color: string): React.CSSProperties {
  const { paddingHorizontal, paddingVertical, flexDirection: _row, alignItems: _align, justifyContent: _justify, gap: _gap, ...box } = StyleSheet.flatten(s.selectTrigger);
  const text = StyleSheet.flatten(s.selectTriggerText);
  return {
    ...box,
    ...NATIVE_SELECT_BOX,
    fontSize: text.fontSize,
    paddingBlock: paddingVertical,
    paddingInline: paddingHorizontal,
    borderColor,
    backgroundColor,
    color,
  } as React.CSSProperties;
}

/** The web `SelectControl` as a real DOM `<select>`, so browsers and test drivers can pick an option natively. */
export function NativeSelect({
  options,
  value,
  onChange,
  placeholder = '',
  accessibilityLabel,
  accessibilityHint,
  labelledById,
  style,
  testID,
}: SelectControlProps): React.ReactElement {
  const { theme } = useUi();
  const { colors } = theme;
  const hasMatch = options.some((o) => o.value === value);
  const textColor = hasMatch ? colors.text : colors.textSecondary;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => onChange(event.target.value);

  return (
    <View style={[s.anchor, style]}>
      <select
        aria-label={accessibilityLabel}
        aria-labelledby={labelledById}
        data-testid={`${testID}-trigger`}
        style={nativeSelectStyle(colors.border, colors.surfaceElevated, textColor)}
        title={accessibilityHint}
        value={value}
        onChange={handleChange}
      >
        {hasMatch ? null : <option disabled value={value}>{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </View>
  );
}
