import { useCallback, useMemo, useState } from 'react';

import type { ControlOption } from '../../controls/controlTypes';
import type { RecentValues } from '../../useRecentValues/useRecentValues';
import { buildSearchSelectSections, moveHighlight, type SearchSelectSections } from '../utils/searchSelectModel';

const KEY_DOWN = 'ArrowDown';
const KEY_UP = 'ArrowUp';
const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';

/** Open state, query, highlight and the actions of one SearchSelect. */
export interface SearchSelectState {
  open: boolean;
  query: string;
  highlight: number;
  sections: SearchSelectSections;
  openList: () => void;
  close: () => void;
  setQuery: (query: string) => void;
  pick: (option: ControlOption) => void;
  onKey: (key: string) => void;
}

/** Only `pick` calls `onChange`, so the value is always an option, never typed text. */
export function useSearchSelectState(options: readonly ControlOption[], recents: RecentValues, onChange: (value: string) => void, onClosed: () => void): SearchSelectState {
  const [open, setOpen] = useState(false);
  const [query, setQueryState] = useState('');
  const [highlight, setHighlight] = useState(-1);
  const sections = useMemo(() => buildSearchSelectSections(options, query, recents.recents), [options, query, recents.recents]);
  const { remember } = recents;

  const close = useCallback(() => {
    setOpen(false);
    setQueryState('');
    setHighlight(-1);
    onClosed();
  }, [onClosed]);

  const pick = useCallback((option: ControlOption) => {
    remember(option.value);
    onChange(option.value);
    close();
  }, [remember, onChange, close]);

  const setQuery = useCallback((next: string) => {
    setQueryState(next);
    setHighlight(-1);
  }, []);

  const onKey = useCallback((key: string) => {
    const count = sections.flat.length;
    if (key === KEY_DOWN) setHighlight((index) => moveHighlight(index, count, 1));
    if (key === KEY_UP) setHighlight((index) => moveHighlight(index, count, -1));
    const option = sections.flat[highlight];
    if (key === KEY_ENTER && option !== undefined) pick(option);
    if (key === KEY_ESCAPE) close();
  }, [sections.flat, highlight, pick, close]);

  const openList = useCallback(() => setOpen(true), []);
  return { open, query, highlight, sections, openList, close, setQuery, pick, onKey };
}
