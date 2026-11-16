export interface RadioOption<T> {
  value: T;
  label: string;
  hint: string;
  description?: string;
}

export interface RadioListProps<T> {
  options: ReadonlyArray<RadioOption<T>>;
  value: T | undefined;
  onChange: (value: T) => void;
  optionTestIDPrefix: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  testID?: string;
}
