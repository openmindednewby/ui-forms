import React from 'react';

import { Field } from '../Field/Field';
import { SelectControl } from '../SelectControl/SelectControl';

import type { ControlOption } from '../controls/controlTypes';

export interface SelectFieldProps {
  label: string;
  accessibilityHint: string;
  value: string;
  options: readonly ControlOption[];
  onChange: (value: string) => void;
  testID: string;
}

export const SelectField = ({
  label,
  accessibilityHint,
  value,
  options,
  onChange,
  testID,
}: SelectFieldProps): React.ReactElement => {
  const selected = options.find((option) => option.value === value)?.label ?? '';
  return (
    <Field label={label}>
      {({ labelId }) => (
        <SelectControl
          accessibilityHint={accessibilityHint}
          accessibilityLabel={`${label}: ${selected}`}
          labelledById={labelId}
          options={options}
          testID={testID}
          value={value}
          onChange={onChange}
        />
      )}
    </Field>
  );
};
