import React from 'react';

import { TemporalField } from './components/TemporalField';

import type { DateTimeFieldProps } from './types';

/** A labelled local date and time: takes and emits `YYYY-MM-DDTHH:mm`, empty is `''`. */
export function DateTimeField(props: DateTimeFieldProps): React.ReactElement {
  return <TemporalField fieldProps={props} webInputType="datetime-local" />;
}
