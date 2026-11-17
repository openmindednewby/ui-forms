import React, { useState } from 'react';

import { TemporalInput } from './TemporalInput';
import { Field } from '../../Field/Field';

import type { DateFieldProps } from '../types';

interface TemporalFieldProps {
  fieldProps: DateFieldProps;
  webInputType: string;
}

/** The `Field` shell shared by `DateField` and `DateTimeField`; a typed date error shows when the caller has none. */
export function TemporalField({ fieldProps, webInputType }: TemporalFieldProps): React.ReactElement {
  const { label, required, hint, error } = fieldProps;
  const [typedError, setTypedError] = useState<string | undefined>(undefined);
  return (
    <Field error={error ?? typedError} hint={hint} label={label} required={required}>
      {(context) => <TemporalInput context={context} fieldProps={fieldProps} webInputType={webInputType} onTypedError={setTypedError} />}
    </Field>
  );
}
