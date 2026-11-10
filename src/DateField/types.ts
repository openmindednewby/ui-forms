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
  placeholder?: string;
}

export type DateTimeFieldProps = DateFieldProps;
