import React from 'react';

import { TemporalField } from './components/TemporalField';

import type { DateFieldProps } from './types';

/** A labelled calendar date: takes and emits `YYYY-MM-DD`, empty is `''`. */
export function DateField(props: DateFieldProps): React.ReactElement {
  return <TemporalField fieldProps={props} webInputType="date" />;
}
