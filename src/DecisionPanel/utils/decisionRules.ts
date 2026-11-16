import { isWideFormLayout } from '../../ResponsiveFormLayout/isWideFormLayout';
import type { DecisionError, DecisionOutcome, DecisionPanelVariant, DecisionTone } from '../types';

type OutcomeButtonVariant = 'primary' | 'secondary' | 'danger';

/** The first reason the chosen outcome and note cannot be submitted, or null when they can. */
export const validateDecision = <T extends string>(outcomes: ReadonlyArray<DecisionOutcome<T>>, outcome: string, note: string): DecisionError | null => {
  const chosen = outcomes.find((item) => item.value === outcome);
  if (chosen === undefined) return 'choose';
  const noteMissing = chosen.noteRequired === true && note.trim() === '';
  return noteMissing ? 'note' : null;
};

/** The default variant for a viewport width: choose-then-submit on phones, the sticky bar at the shared wide breakpoint. */
export const defaultDecisionVariant = (width: number): DecisionPanelVariant => (isWideFormLayout(width) ? 'sticky-bar' : 'choose-then-submit');

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
