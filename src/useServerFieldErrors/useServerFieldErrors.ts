import { useCallback, useState } from 'react';

import { parseFieldErrors } from '@dloizides/api-client-base';

import { assignServerErrors, type CodeFormatter } from './assignServerErrors';
import { useFocusFirstInvalid, type FocusableRefs } from '../useFocusFirstInvalid/useFocusFirstInvalid';

export interface UseServerFieldErrorsOptions<Field extends string> {
  fields: readonly Field[];
  refs?: FocusableRefs<Field>;
  formatCode?: CodeFormatter;
}

export interface ServerFieldErrors<Field extends string> {
  errorFor: (field: Field) => string | undefined;
  apply: (error: unknown) => boolean;
  clear: (field: Field) => void;
  formError: string | null;
  reset: () => void;
}

interface ServerErrorState<Field extends string> {
  byField: Partial<Record<Field, string>>;
  formError: string | null;
}

const EMPTY_STATE = { byField: {}, formError: null };
const NO_REFS = {};

function withoutField<Field extends string>(state: ServerErrorState<Field>, field: Field): ServerErrorState<Field> {
  if (state.byField[field] === undefined) {return state;}
  const byField = { ...state.byField };
  delete byField[field];
  return { ...state, byField };
}

/** Binds a thrown 400 to form fields: the message under each known field, the rest on the form status line. */
export function useServerFieldErrors<Field extends string>(options: UseServerFieldErrorsOptions<Field>): ServerFieldErrors<Field> {
  const { fields, refs, formatCode } = options;
  const [state, setState] = useState<ServerErrorState<Field>>(EMPTY_STATE);
  const focusFirst = useFocusFirstInvalid<Field>(refs ?? (NO_REFS as FocusableRefs<Field>));
  const hasRefs = refs !== undefined;

  const apply = useCallback(
    (error: unknown): boolean => {
      const assigned = assignServerErrors(parseFieldErrors(error), fields, formatCode);
      setState({ byField: assigned.byField, formError: assigned.formError });
      if (hasRefs && assigned.matched.length > 0) {focusFirst(assigned.matched);}
      return assigned.matched.length > 0;
    },
    [fields, formatCode, focusFirst, hasRefs],
  );
  const clear = useCallback((field: Field) => setState((current) => withoutField(current, field)), []);
  const reset = useCallback(() => setState(EMPTY_STATE), []);
  const errorFor = useCallback((field: Field) => state.byField[field], [state.byField]);

  return { errorFor, apply, clear, formError: state.formError, reset };
}
