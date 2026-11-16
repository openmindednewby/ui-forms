import React from 'react';

import { ActionBar } from '../../FixBar/ActionBar';

import { DecisionNote } from './DecisionNote';
import { OutcomeButtons } from './OutcomeButtons';
import type { DecisionVariantProps } from './variantProps';

/** Note in the page, every outcome a button in a bar pinned under the thumb. */
export function StickyBarDecision<T extends string>(props: DecisionVariantProps<T>): React.ReactElement {
  const { state, outcomes, labels, testID, disabled } = props;
  return (
    <>
      <DecisionNote {...props} />
      <ActionBar sticky message={labels.message} testID={`${testID}-bar`}>
        <OutcomeButtons disabled={disabled} outcomes={outcomes} pending={state.pending} testID={testID} onPress={state.submit} />
      </ActionBar>
    </>
  );
}
