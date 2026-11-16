import React from 'react';

import { ChipSelector } from '../../ChipSelector/ChipSelector';
import { ActionBar } from '../../FixBar/ActionBar';
import { leadFirst } from '../utils/decisionRules';
import type { DecisionOutcome } from '../types';

import { DecisionNote } from './DecisionNote';
import { OutcomeButtons } from './OutcomeButtons';
import type { DecisionVariantProps } from './variantProps';

const retone = <T extends string>(item: DecisionOutcome<T>, lead: T | undefined): DecisionOutcome<T> => {
  if (item.value === lead) return { ...item, tone: 'primary' };
  return item.tone === 'primary' ? { ...item, tone: 'neutral' } : item;
};

/** The failed checks become reason chips for the note, and the lead outcome comes first. */
export function ChecksDriveDecision<T extends string>(props: DecisionVariantProps<T>): React.ReactElement {
  const { state, outcomes, labels, testID, disabled, reasons = [], leadOutcome } = props;
  const ordered = leadFirst(outcomes, leadOutcome).map((item) => retone(item, leadOutcome));
  return (
    <>
      {reasons.length > 0 ? (
        <ChipSelector
          multiple
          chipTestIDPrefix={`${testID}-reason`}
          disabled={disabled}
          label={labels.reasons}
          options={reasons}
          testID={`${testID}-reasons`}
          value={state.reasons}
          variant="outline"
          onChange={state.toggleReason}
        />
      ) : null}
      <DecisionNote {...props} />
      <ActionBar message={labels.message} testID={`${testID}-bar`}>
        <OutcomeButtons disabled={disabled} outcomes={ordered} pending={state.pending} testID={testID} onPress={state.submit} />
      </ActionBar>
    </>
  );
}
