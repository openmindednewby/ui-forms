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

const FIT_SELECT_BOX: React.CSSProperties = { width: 'auto', maxWidth: 'none' };

const fitStyles = StyleSheet.create({
  anchor: { alignSelf: 'flex-start', flexShrink: 0 },
});

/** The `<select>` box: full width, or sized to its longest option when `fit`. */
export function nativeSelectBox(fit: boolean): React.CSSProperties {
  return fit ? { ...NATIVE_SELECT_BOX, ...FIT_SELECT_BOX } : NATIVE_SELECT_BOX;
}

function nativeSelectStyle(fit: boolean, borderColor: string, backgroundColor: string, color: string): React.CSSProperties {
  const trigger = StyleSheet.flatten(s.selectTrigger);
  const text = StyleSheet.flatten(s.selectTriggerText);
  return {
    ...nativeSelectBox(fit),
    minHeight: trigger.minHeight,
    borderWidth: trigger.borderWidth,
    borderRadius: trigger.borderRadius,
    fontSize: text.fontSize,
    paddingBlock: trigger.paddingVertical,
    paddingInline: trigger.paddingHorizontal,
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
  native,
}: SelectControlProps): React.ReactElement {
  const { theme } = useUi();
  const { colors } = theme;
  const hasMatch = options.some((o) => o.value === value);
  const textColor = hasMatch ? colors.text : colors.textSecondary;
  const fit = native === 'fit';

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => onChange(event.target.value);

  return (
    <View style={[s.anchor, fit ? fitStyles.anchor : undefined, style]}>
      <select
        aria-label={accessibilityLabel}
        aria-labelledby={labelledById}
        data-testid={testID}
        style={nativeSelectStyle(fit, colors.border, colors.surfaceElevated, textColor)}
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
