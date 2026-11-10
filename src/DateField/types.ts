import type { FieldChildContext } from '../Field/Field';

export interface DateFieldProps {
  /** PRE-LOCALIZED label; also the accessible name. */
  label: string;
  /** `YYYY-MM-DD` for `DateField`, `YYYY-MM-DDTHH:mm` for `DateTimeField`; empty is `''`. */
  value: string;
  onChange: (value: string) => void;
  /** Runs on Enter. */
  onSubmit?: () => void;
  accessibilityHint: string;
  testID: string;
  required?: boolean;
  hint?: string;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

export type DateTimeFieldProps = DateFieldProps;

export interface DateInputProps {
  /** The same props a `DateField` takes; `label` is the accessible name only. */
  fieldProps: DateFieldProps;
  /** The context `Field` hands its render-prop child. */
  context: FieldChildContext;
}
