import React from 'react';

import { StyleSheet, type TextStyle } from 'react-native';

import { controlStyles } from '../../controls/controlStyles';
import { useThemedInput } from '../../useThemedInput/useThemedInput';
import { webFieldA11y } from '../../webFieldA11y/webFieldA11y';

import type { FieldChildContext } from '../../Field/Field';
import type { DateFieldProps } from '../types';

const NATIVE_INPUT_BOX: React.CSSProperties = {
  borderStyle: 'solid',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  width: '100%',
};

interface WebDateInputProps {
  fieldProps: DateFieldProps;
  context: FieldChildContext;
  webInputType: string;
}

function buildNativeInputStyle(themed: TextStyle): React.CSSProperties {
  const { paddingHorizontal, paddingVertical, ...box } = StyleSheet.flatten(controlStyles.input);
  return {
    ...box,
    ...themed,
    ...NATIVE_INPUT_BOX,
    paddingBlock: paddingVertical,
    paddingInline: paddingHorizontal,
  } as React.CSSProperties;
}

/** A real DOM input: react-native-web's `TextInput` discards a `type` prop, so it cannot open a calendar. */
export function WebDateInput({ fieldProps, context, webInputType }: WebDateInputProps): React.ReactElement {
  const { label, value, onChange, onSubmit, accessibilityHint, testID, required, disabled = false, min, max } = fieldProps;
  const { style, focusBind, hoverBind } = useThemedInput({ hasError: context.hasError, editable: !disabled });
  const webA11y = webFieldA11y({
    describedById: context.describedById,
    hasError: context.hasError,
    required,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => onChange(event.target.value);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'Enter' || onSubmit === undefined) return;
    event.preventDefault();
    onSubmit();
  };

  return (
    <input
      {...(webA11y as React.InputHTMLAttributes<HTMLInputElement>)}
      {...(hoverBind as React.InputHTMLAttributes<HTMLInputElement>)}
      {...(focusBind as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
      aria-label={label}
      data-testid={testID}
      disabled={disabled}
      id={context.controlId}
      max={max}
      min={min}
      style={buildNativeInputStyle(style)}
      title={accessibilityHint}
      type={webInputType}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
