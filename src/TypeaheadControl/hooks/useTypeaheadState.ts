import { useCallback, useEffect, useMemo, useState } from 'react';

import type { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

import type { ControlOption } from '../../controls/controlTypes';
import { suggestOptions } from '../../controls/suggestOptions';
import type { TypeaheadSearch } from '../types';
import { DEFAULT_TYPEAHEAD_DEBOUNCE_MS, useTypeaheadSearch, type TypeaheadSearchState } from './useTypeaheadSearch';

const NO_HIGHLIGHT = -1;
const FORWARD = 1;
const BACKWARD = -1;
const NO_ROWS: readonly ControlOption[] = [];

export interface TypeaheadStateInput {
  options: readonly ControlOption[] | undefined;
  search: TypeaheadSearch | undefined;
  value: string;
  minChars: number;
  maxSuggestions: number;
  onChange: (value: string) => void;
  onSubmit: (() => void) | undefined;
}

export interface TypeaheadState {
  rows: readonly ControlOption[];
  statusText: string | undefined;
  isOpen: boolean;
  picked: ControlOption | null;
  highlighted: ControlOption | undefined;
  open: () => void;
  close: () => void;
  selectValue: (value: string) => void;
  handleChange: (next: string) => void;
  handleKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  handleSubmit: () => void;
}

/** The row index an arrow key moves to: wraps at both ends, -1 when there are no rows. */
export function nextHighlight(current: number, count: number, delta: number): number {
  if (count === 0) return NO_HIGHLIGHT;
  if (current === NO_HIGHLIGHT) return delta > 0 ? 0 : count - 1;
  return (current + delta + count) % count;
}

function searchStatusText(found: TypeaheadSearchState, search: TypeaheadSearch): string | undefined {
  if (found.hasFailed) return search.errorText;
  if (found.results.length > 0) return undefined;
  if (found.isLoading) return search.loadingText;
  return found.hasSettled ? search.emptyText : undefined;
}

function useTypeaheadRows(
  input: TypeaheadStateInput,
  isOpen: boolean,
  isPicked: boolean,
): { rows: readonly ControlOption[]; statusText: string | undefined } {
  const { options, search, value, minChars, maxSuggestions } = input;
  const query = value.trim();
  const isSearching = search !== undefined && isOpen && !isPicked && query.length >= minChars;
  const found = useTypeaheadSearch(search?.load, query, isSearching, search?.debounceMs ?? DEFAULT_TYPEAHEAD_DEBOUNCE_MS);
  const staticRows = useMemo(() => {
    if (options === undefined || options.some((o) => o.label === value)) return NO_ROWS;
    return suggestOptions(options, value, minChars, maxSuggestions);
  }, [options, value, minChars, maxSuggestions]);
  const foundRows = useMemo(() => found.results.slice(0, maxSuggestions), [found.results, maxSuggestions]);
  if (search === undefined) return { rows: staticRows, statusText: undefined };
  return { rows: foundRows, statusText: searchStatusText(found, search) };
}

/** Everything `TypeaheadControl` decides: rows, open state, highlight, pick and key handling. */
export function useTypeaheadState(input: TypeaheadStateInput): TypeaheadState {
  const { search, value, onChange, onSubmit } = input;
  const [isOpen, setIsOpen] = useState(false);
  const [picked, setPicked] = useState<ControlOption | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(NO_HIGHLIGHT);
  const { rows, statusText } = useTypeaheadRows(input, isOpen, picked !== null && picked.label === value);
  const rowKey = rows.map((row) => row.value).join('\n');
  const highlighted: ControlOption | undefined = isOpen ? rows[highlightIndex] : undefined;

  useEffect(() => setHighlightIndex(NO_HIGHLIGHT), [rowKey]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightIndex(NO_HIGHLIGHT);
  }, []);
  const pick = useCallback(
    (option: ControlOption) => {
      setPicked(option);
      onChange(option.label);
      search?.onPick(option);
      close();
    },
    [onChange, search, close],
  );
  const selectValue = useCallback(
    (optionValue: string) => {
      const option = rows.find((row) => row.value === optionValue);
      if (option !== undefined) pick(option);
    },
    [rows, pick],
  );
  const handleChange = useCallback(
    (next: string) => {
      if (picked !== null) {
        setPicked(null);
        search?.onPick(null);
      }
      onChange(next);
      setIsOpen(true);
    },
    [picked, search, onChange],
  );
  const handleKeyPress = useTypeaheadKeys({ rowCount: rows.length, isOpen, highlighted, setIsOpen, setHighlightIndex, close, pick });
  const handleSubmit = useCallback(() => {
    if (highlighted !== undefined) {
      pick(highlighted);
      return;
    }
    close();
    onSubmit?.();
  }, [highlighted, pick, close, onSubmit]);

  return { rows, statusText, isOpen, picked, highlighted, open, close, selectValue, handleChange, handleKeyPress, handleSubmit };
}

interface TypeaheadKeysInput {
  rowCount: number;
  isOpen: boolean;
  highlighted: ControlOption | undefined;
  setIsOpen: (isOpen: boolean) => void;
  setHighlightIndex: (update: (current: number) => number) => void;
  close: () => void;
  pick: (option: ControlOption) => void;
}

function useTypeaheadKeys(input: TypeaheadKeysInput): TypeaheadState['handleKeyPress'] {
  const { rowCount, isOpen, highlighted, setIsOpen, setHighlightIndex, close, pick } = input;
  return useCallback(
    (event) => {
      const { key } = event.nativeEvent;
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault();
        setIsOpen(true);
        setHighlightIndex((current) => nextHighlight(current, rowCount, key === 'ArrowDown' ? FORWARD : BACKWARD));
      } else if (key === 'Escape' && isOpen) {
        event.preventDefault();
        close();
      } else if (key === 'Enter' && highlighted !== undefined) {
        event.preventDefault();
        pick(highlighted);
      }
    },
    [rowCount, isOpen, highlighted, setIsOpen, setHighlightIndex, close, pick],
  );
}
