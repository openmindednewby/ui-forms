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
import { RecentInputField } from './RecentInputField';
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
  /**
   * Hide the VISIBLE label row while keeping the accessible name.
   *
   * For a field whose placeholder already names it (a toolbar search box, an inline
   * filter) the stacked visible label both wastes a row and misaligns the input
   * against a bare button beside it. Setting this drops ONLY the visible `<label>`:
   * the input still carries `accessibilityLabel={label}`, so a screen reader reads
   * the same name and `label` stays REQUIRED — you never lose the accessible name by
   * blanking it, which is the trap this option exists to remove. Default `false`.
   */
  labelHidden?: boolean;
  required?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  /**
   * OPT-IN "recent values" behaviour. When set, the values submitted through this field are
   * remembered (per this key) and offered in a dropdown on focus; picking one fills the input.
   * Values are recorded on submit (Enter) and on blur-with-content. Persisted to `localStorage`
   * under `@dloizides/ui-forms:recent:<recentKey>`; a silent no-op on native / when storage is
   * unavailable.
   *
   * Leave it UNSET (the default) and the field behaves exactly as before — nothing rendered, no
   * storage touched. NEVER set it on a password / secure field: recents must not persist secrets.
   */
  recentKey?: string;
  /** Cap on remembered values when {@link recentKey} is set (most-recent-first). Default 10. */
  recentMax?: number;
}

export const FormField = ({
  label,
  labelHidden = false,
  required = false,
  error,
  containerStyle,
  recentKey,
  recentMax,
  ...textInputProps
}: FormFieldProps): React.ReactElement => (
  <Field
    containerStyle={containerStyle}
    error={error}
    // An undefined label renders NO label row (see Field): that is how the visible
    // label is hidden. The accessible name is kept on the input below, so hiding
    // the label never strips the name.
    label={labelHidden ? undefined : label}
    required={required}
  >
    {({ describedById, hasError, controlId }) => {
      // Shared props for either input path — identical wiring, so a field looks and behaves the
      // same whether or not it opts into recents.
      const inputProps = {
        accessibilityHint: `Enter ${label}`,
        accessibilityLabel: label,
        describedById,
        hasError,
        id: controlId,
        requiredField: required,
        testID: 'form-field-input',
        ...textInputProps,
      };
      // recentKey set → the recents-enabled input; unset → the plain input, unchanged from before
      // (no extra state/refs/effects/storage — the default path pays nothing).
      return recentKey !== undefined && recentKey !== '' ? (
        <RecentInputField label={label} recentKey={recentKey} recentMax={recentMax} {...inputProps} />
      ) : (
        <ThemedTextInput {...inputProps} />
      );
    }}
  </Field>
);

export default FormField;
