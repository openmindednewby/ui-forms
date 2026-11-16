import React from 'react';

import { validateDecision } from '../utils/decisionRules';
import type { DecisionError, DecisionOutcome, DecisionSubmission } from '../types';

export interface DecisionPanelState<T extends string> {
  outcome: T | '';
  note: string;
  reasons: string[];
  checked: string[];
  error: DecisionError | null;
  pending: T | null;
  choose: (outcome: T) => void;
  setNote: (note: string) => void;
  toggleReason: (reason: string) => void;
  toggleCheck: (id: string) => void;
  submit: (override?: T) => Promise<void>;
}

const toggle = (list: string[], id: string): string[] => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);

/** The decision panel's state: chosen outcome, note, reasons, checklist ticks, the refusal and the submit in flight. */
export function useDecisionPanel<T extends string>(
  outcomes: ReadonlyArray<DecisionOutcome<T>>,
  onSubmit: (submission: DecisionSubmission<T>) => void | Promise<unknown>,
): DecisionPanelState<T> {
  const [outcome, setOutcome] = React.useState<T | ''>('');
  const [note, setNote] = React.useState('');
  const [reasons, setReasons] = React.useState<string[]>([]);
  const [checked, setChecked] = React.useState<string[]>([]);
  const [error, setError] = React.useState<DecisionError | null>(null);
  const [pending, setPending] = React.useState<T | null>(null);

  const submit = async (override?: T): Promise<void> => {
    const target = override ?? outcome;
    const problem = validateDecision(outcomes, target, note);
    setError(problem);
    if (problem !== null || target === '') return;
    setPending(target);
    try {
      await onSubmit({ outcome: target, note, reasons });
    } catch {
      setError('submit');
    } finally {
      setPending(null);
    }
  };

  return {
    outcome,
    note,
    reasons,
    checked,
    error,
    pending,
    choose: (next: T): void => {
      setOutcome(next);
      setError(null);
    },
    setNote,
    toggleReason: (reason: string): void => setReasons((list) => toggle(list, reason)),
    toggleCheck: (id: string): void => setChecked((list) => toggle(list, id)),
    submit,
  };
}
