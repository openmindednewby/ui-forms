import React from 'react';

import { Button } from '@dloizides/ui-buttons';

import { ChipSelector } from '../../ChipSelector/ChipSelector';
import { DecisionError } from '../utils/DecisionError';

import { DecisionNote } from './DecisionNote';
import type { DecisionVariantProps } from './variantProps';

/** Labelled choices with what each does, one note, one Submit: no outcome lands on one tap. */
export function ChooseThenSubmitDecision<T extends string>(props: DecisionVariantProps<T>): React.ReactElement {
  const { state, outcomes, labels, testID, disabled } = props;
  const options = outcomes.map((item) => ({ value: item.value, label: item.label, description: item.description }));
  return (
    <>
      <ChipSelector
        chipTestIDPrefix={`${testID}-outcome`}
        disabled={disabled}
        error={state.error === DecisionError.Choose ? labels.chooseError : undefined}
        options={options}
        singleSelectRole="radio"
        testID={`${testID}-outcomes`}
        value={state.outcome as T}
        variant="list"
        onChange={state.choose}
      />
      <DecisionNote {...props} />
      <Button
        fullWidth
        accessibilityHint={labels.submitHint}
        accessibilityLabel={labels.submit}
        disabled={disabled}
        label={labels.submit}
        loading={state.pending !== null}
        testID={`${testID}-submit`}
        onPress={() => state.submit()}
      />
    </>
  );
}
