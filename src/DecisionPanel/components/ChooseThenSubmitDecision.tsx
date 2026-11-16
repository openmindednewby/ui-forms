import React from 'react';

import { Button } from '@dloizides/ui-buttons';

import { RadioList } from '../../RadioList/RadioList';

import { DecisionNote } from './DecisionNote';
import type { DecisionVariantProps } from './variantProps';

/** Labelled choices with what each does, one note, one Submit: no outcome lands on one tap. */
export function ChooseThenSubmitDecision<T extends string>(props: DecisionVariantProps<T>): React.ReactElement {
  const { state, outcomes, labels, testID, disabled } = props;
  return (
    <>
      <RadioList
        disabled={disabled}
        error={state.error === 'choose' ? labels.chooseError : undefined}
        optionTestIDPrefix={`${testID}-outcome`}
        options={outcomes}
        testID={`${testID}-outcomes`}
        value={state.outcome === '' ? undefined : state.outcome}
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
