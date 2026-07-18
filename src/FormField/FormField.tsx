/**
 * Reusable form field — labelled text input with optional required mark + error.
 *
 * The label row, the required mark, the error line and the container spacing all come from the
 * generic `Field` wrapper, so a `FormField` and a `Field`-wrapped dropdown sitting next to each
 * other line up exactly and can never drift apart. FormField only adds the control itself.
 *
 * The input is the shared `ThemedTextInput` primitive, so every FormField gets the readable +
 * lively treatment (dark text, subtle off-white rest background, brand focus animation with a
 * soft ring) for free, driven by the active theme.
 */
import React from 'react';

import { StyleSheet, type TextInputProps, type ViewStyle } from 'react-native';

import { Field } from '../Field/Field';
import { ThemedTextInput } from '../ThemedTextInput/ThemedTextInput';

const INPUT_PADDING_V = 10;
const INPUT_PADDING_H = 12;
const INPUT_BORDER_RADIUS = 8;
const INPUT_BORDER_WIDTH = 1;

const styles = StyleSheet.create({
  input: {
    paddingVertical: INPUT_PADDING_V,
    paddingHorizontal: INPUT_PADDING_H,
    borderRadius: INPUT_BORDER_RADIUS,
    borderWidth: INPUT_BORDER_WIDTH,
  },
});

export interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  required?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
}

export const FormField = ({
  label,
  required = false,
  error,
  containerStyle,
  ...textInputProps
}: FormFieldProps): React.ReactElement => (
  <Field containerStyle={containerStyle} error={error} label={label} required={required}>
    {({ describedById, hasError }) => (
      <ThemedTextInput
        accessibilityHint={`Enter ${label}`}
        accessibilityLabel={label}
        describedById={describedById}
        hasError={hasError}
        requiredField={required}
        style={styles.input}
        testID="form-field-input"
        {...textInputProps}
      />
    )}
  </Field>
);

export default FormField;
