import type { ControlOption } from '../controls/controlTypes';

export interface FieldControlWiring {
  id?: string;
  describedById?: string;
}

export interface TypeaheadSearch {
  load: (query: string, signal: AbortSignal) => Promise<readonly ControlOption[]>;
  onPick: (option: ControlOption | null) => void;
  loadingText: string;
  emptyText: string;
  errorText: string;
  debounceMs?: number;
  maxResults?: number;
  scrollMarginTop?: number;
  inputTestID?: string;
}
