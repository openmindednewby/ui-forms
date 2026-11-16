import type { StyleProp, ViewStyle } from 'react-native';

import type { ChipOption } from '../ChipSelector/types';
import type { ChecklistItem } from '../GatedChecklist/isChecklistComplete';

export type DecisionPanelVariant = 'sticky-bar' | 'choose-then-submit' | 'checks-drive';

export type DecisionTone = 'primary' | 'neutral' | 'danger';

export type DecisionError = 'choose' | 'note' | 'submit';

export interface DecisionOutcome<T extends string> {
  value: T;
  label: string;
  hint: string;
  description?: string;
  tone?: DecisionTone;
  noteRequired?: boolean;
}

export interface DecisionSubmission<T extends string> {
  outcome: T;
  note: string;
  reasons: string[];
}

export interface DecisionPanelLabels {
  title: string;
  note: string;
  noteRequiredError: string;
  chooseError: string;
  submit: string;
  submitHint: string;
  submitError: string;
  notePlaceholder?: string;
  reasons?: string;
  message?: string;
}

export interface DecisionChecklist {
  title: string;
  items: readonly ChecklistItem[];
}

export interface DecisionPanelProps<T extends string> {
  variant: DecisionPanelVariant;
  outcomes: ReadonlyArray<DecisionOutcome<T>>;
  onSubmit: (submission: DecisionSubmission<T>) => void | Promise<unknown>;
  labels: DecisionPanelLabels;
  testID: string;
  reasons?: Array<ChipOption<string>>;
  leadOutcome?: T;
  checklist?: DecisionChecklist;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
