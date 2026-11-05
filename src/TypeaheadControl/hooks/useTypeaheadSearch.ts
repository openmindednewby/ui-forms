import { useEffect, useRef, useState } from 'react';

import type { ControlOption } from '../../controls/controlTypes';
import type { TypeaheadSearch } from '../types';

export const DEFAULT_TYPEAHEAD_DEBOUNCE_MS = 250;

export interface TypeaheadSearchState {
  readonly results: readonly ControlOption[];
  readonly isLoading: boolean;
  readonly hasFailed: boolean;
  readonly hasSettled: boolean;
}

const IDLE: TypeaheadSearchState = { results: [], isLoading: false, hasFailed: false, hasSettled: false };

/** Debounced search: each new query aborts the last one, so an older response can never land. */
export function useTypeaheadSearch(
  load: TypeaheadSearch['load'] | undefined,
  query: string,
  enabled: boolean,
  debounceMs: number,
): TypeaheadSearchState {
  const [state, setState] = useState(IDLE);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    if (!enabled) {
      setState(IDLE);
      return undefined;
    }
    setState((current) => ({ ...current, isLoading: true, hasFailed: false }));
    const controller = new AbortController();
    const settle = (next: TypeaheadSearchState): void => {
      if (!controller.signal.aborted) setState(next);
    };
    const timer = setTimeout(() => {
      Promise.resolve()
        .then(() => loadRef.current?.(query, controller.signal) ?? [])
        .then(
          (results) => settle({ results, isLoading: false, hasFailed: false, hasSettled: true }),
          () => settle({ results: [], isLoading: false, hasFailed: true, hasSettled: true }),
        );
    }, debounceMs);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, enabled, debounceMs]);

  return state;
}
