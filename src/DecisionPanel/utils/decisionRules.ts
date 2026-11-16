import type { DecisionOutcome, DecisionPanelVariant, DecisionTone } from '../types';

import { DecisionError } from './DecisionError';

export const DECISION_PANEL_WIDE_MIN_WIDTH = 768;

type OutcomeButtonVariant = 'primary' | 'secondary' | 'danger';

/** The first reason the chosen outcome and note cannot be submitted, or null when they can. */
export const validateDecision = <T extends string>(outcomes: ReadonlyArray<DecisionOutcome<T>>, outcome: string, note: string): DecisionError | null => {
  const chosen = outcomes.find((item) => item.value === outcome);
  if (chosen === undefined) return DecisionError.Choose;
  const noteMissing = chosen.noteRequired === true && note.trim() === '';
  return noteMissing ? DecisionError.Note : null;
};

/** The default variant for a viewport width: choose-then-submit on phones, the sticky bar from 768 px. */
export const defaultDecisionVariant = (width: number): DecisionPanelVariant =>
  width < DECISION_PANEL_WIDE_MIN_WIDTH ? 'choose-then-submit' : 'sticky-bar';

/** The outcomes with the lead one first; the rest keep their order. */
export const leadFirst = <T extends string>(outcomes: ReadonlyArray<DecisionOutcome<T>>, lead: T | undefined): Array<DecisionOutcome<T>> => [
  ...outcomes.filter((item) => item.value === lead),
  ...outcomes.filter((item) => item.value !== lead),
];

/** The button variant an outcome tone renders as. */
export const toneVariant = (tone: DecisionTone | undefined): OutcomeButtonVariant => {
  if (tone === 'primary') return 'primary';
  return tone === 'danger' ? 'danger' : 'secondary';
};
