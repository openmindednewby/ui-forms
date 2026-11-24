import React from 'react';

import { StyleSheet, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { controlStyles as s } from '../controls/controlStyles';

import type { SelectControlProps } from './SelectControl';
import { chevronDataUri, useSelectLookMetrics, type SelectLookMetrics } from './selectLook';

const NATIVE_SELECT_BOX: React.CSSProperties = {
  borderStyle: 'solid',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  width: '100%',
};

const FIT_SELECT_BOX: React.CSSProperties = { width: 'auto', maxWidth: 'none' };

const ONE_LINE_BOX: React.CSSProperties = { maxWidth: '100%', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };

const CHEVRON_INSET = 10;

interface NativeSelectColors {
  border: string;
  background: string;
  text: string;
  chevron: string;
}

const fitStyles = StyleSheet.create({
  anchor: { alignSelf: 'flex-start', flexShrink: 0 },
  oneLine: { maxWidth: '100%', minWidth: 0, flexShrink: 1 },
});

/** The `<select>` box: full width, or sized to its longest option when `fit`. */
export function nativeSelectBox(fit: boolean): React.CSSProperties {
  return fit ? { ...NATIVE_SELECT_BOX, ...FIT_SELECT_BOX } : NATIVE_SELECT_BOX;
}

function lookSelectStyle(fit: boolean, m: SelectLookMetrics, colors: NativeSelectColors): React.CSSProperties {
  return {
    ...nativeSelectBox(fit),
    ...ONE_LINE_BOX,
    height: m.height,
    borderWidth: 1,
    borderRadius: m.borderRadius,
    fontSize: m.fontSize,
    paddingBlock: m.paddingVertical,
    paddingInlineStart: m.paddingHorizontal,
    paddingInlineEnd: m.chevronRoom,
    borderColor: m.borderColor ?? colors.border,
    backgroundColor: m.backgroundColor ?? colors.background,
    color: m.textColor ?? colors.text,
    appearance: 'none',
    backgroundImage: chevronDataUri(m.textColor ?? colors.chevron),
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `right ${String(CHEVRON_INSET)}px center`,
    backgroundSize: '16px 16px',
  } as React.CSSProperties;
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
  const metrics = useSelectLookMetrics();
  const selectStyle = metrics === undefined
    ? nativeSelectStyle(fit, colors.border, colors.surfaceElevated, textColor)
    : lookSelectStyle(fit, metrics, { border: colors.border, background: colors.surfaceElevated, text: textColor, chevron: colors.textSecondary });

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => onChange(event.target.value);

  return (
    <View style={[s.anchor, fit ? fitStyles.anchor : undefined, metrics === undefined ? undefined : fitStyles.oneLine, style]}>
      <select
        aria-label={accessibilityLabel}
        aria-labelledby={labelledById}
        data-testid={testID}
        style={selectStyle}
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
