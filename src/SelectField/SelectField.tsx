import React from 'react';

import { Field } from '../Field/Field';
import { SelectControl } from '../SelectControl/SelectControl';

import type { ControlOption } from '../controls/controlTypes';
import type { FieldLabelVariant } from '../Field/labelVariants';

export interface SelectFieldProps {
  label: string;
  accessibilityHint: string;
  value: string;
  options: readonly ControlOption[];
  onChange: (value: string) => void;
  testID: string;
  labelVariant?: FieldLabelVariant;
}

export const SelectField = ({
  label,
  accessibilityHint,
  value,
  options,
  onChange,
  testID,
  labelVariant,
}: SelectFieldProps): React.ReactElement => {
  const selected = options.find((option) => option.value === value)?.label ?? '';
  return (
    <Field label={label} labelVariant={labelVariant}>
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
