import React from 'react';

import { TemporalInput } from './components/TemporalInput';

import type { DateInputProps } from './types';

/** A calendar date control with no label row, for a `Field` render-prop child whose caller owns the label. */
export function DateInput({ fieldProps, context }: DateInputProps): React.ReactElement {
  return <TemporalInput context={context} fieldProps={fieldProps} webInputType="date" />;
}
