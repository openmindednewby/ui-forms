import React from 'react';

import { FormField } from '../../FormField/FormField';
import type { DecisionVariantProps } from './variantProps';

const NOTE_LINES = 3;

/** The decision note: multi-line (Enter adds a line), showing the note-required refusal. */
export function DecisionNote<T extends string>({ state, labels, testID, disabled }: DecisionVariantProps<T>): React.ReactElement {
  const error = state.error === 'note' ? labels.noteRequiredError : undefined;
  return (
    <FormField
      multiline
      editable={!disabled}
      error={error}
      label={labels.note}
      numberOfLines={NOTE_LINES}
      placeholder={labels.notePlaceholder}
      testID={`${testID}-note`}
      value={state.note}
      onChangeText={state.setNote}
    />
  );
}
