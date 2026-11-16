import type { ChipOption } from '../../ChipSelector/types';
import type { DecisionPanelState } from '../hooks/useDecisionPanel';
import type { DecisionOutcome, DecisionPanelLabels } from '../types';

export interface DecisionVariantProps<T extends string> {
  state: DecisionPanelState<T>;
  outcomes: ReadonlyArray<DecisionOutcome<T>>;
  labels: DecisionPanelLabels;
  testID: string;
  disabled: boolean;
  reasons?: Array<ChipOption<string>>;
  leadOutcome?: T;
}
