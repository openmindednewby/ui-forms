import React from 'react';

import { TemporalInput } from './TemporalInput';
import { Field } from '../../Field/Field';

import type { DateFieldProps } from '../types';

interface TemporalFieldProps {
  fieldProps: DateFieldProps;
  webInputType: string;
}

/** The `Field` shell shared by `DateField` and `DateTimeField`. */
export function TemporalField({ fieldProps, webInputType }: TemporalFieldProps): React.ReactElement {
  const { label, required, hint, error } = fieldProps;
  return (
    <Field error={error} hint={hint} label={label} required={required}>
      {(context) => <TemporalInput context={context} fieldProps={fieldProps} webInputType={webInputType} />}
    </Field>
  );
}
