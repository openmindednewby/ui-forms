import type { RadioOption } from '../types';

export interface RadioRowIdentity {
  testID: string;
  accessibilityLabel: string;
  accessibilityState: { checked: boolean; selected: boolean; disabled: boolean };
}

/** The testID, accessible name (label, then description) and native radio state of one row. */
export const radioRowIdentity = <T>(option: RadioOption<T>, selected: boolean, disabled: boolean, prefix: string): RadioRowIdentity => {
  const hasDescription = option.description !== undefined && option.description !== '';
  return {
    testID: `${prefix}-${String(option.value)}`,
    accessibilityLabel: hasDescription ? `${option.label}, ${String(option.description)}` : option.label,
    accessibilityState: { checked: selected, selected, disabled },
  };
};
