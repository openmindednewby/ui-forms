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

import { type TextInputProps, type ViewStyle } from 'react-native';

import { Field } from '../Field/Field';
import { ThemedTextInput } from '../ThemedTextInput/ThemedTextInput';

/**
 * The private `styles.input` that used to live here — padding 10/12, radius 8, border 1 — was a
 * verbatim duplicate of `controlStyles.input`, and `ThemedTextInput` now applies that itself. The
 * duplication is what hid the real defect: because `FormField` supplied metrics, inputs reached
 * through it looked correct, while every DIRECT `ThemedTextInput` caller got an unstyled 19px box
 * and nobody could see the difference from in here.
 */
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
    {({ describedById, hasError, controlId }) => (
      <ThemedTextInput
        accessibilityHint={`Enter ${label}`}
        accessibilityLabel={label}
        describedById={describedById}
        hasError={hasError}
        id={controlId}
        requiredField={required}
        testID="form-field-input"
        {...textInputProps}
      />
    )}
  </Field>
);

export default FormField;
