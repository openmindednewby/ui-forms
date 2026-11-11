import { useCallback, useMemo, useState } from 'react';

import type { ControlOption } from '../../controls/controlTypes';
import type { RecentValues } from '../../useRecentValues/useRecentValues';
import { buildSearchSelectSections, highlightAfterQuery, moveHighlight, type SearchSelectSections } from '../utils/searchSelectModel';

const KEY_DOWN = 'ArrowDown';
const KEY_UP = 'ArrowUp';
const KEY_ESCAPE = 'Escape';

/** Open state, query, highlight and the actions of one SearchSelect. */
export interface SearchSelectState {
  open: boolean;
  query: string;
  highlight: number;
  active: ControlOption | undefined;
  sections: SearchSelectSections;
  openList: () => void;
  close: () => void;
  setQuery: (query: string) => void;
  pick: (option: ControlOption) => void;
  submit: (via?: (option: ControlOption) => void) => void;
  onKey: (key: string) => void;
}

/** Only `pick` calls `onChange`, so the value is always an option, never typed text; Enter picks only through `submit`. */
export function useSearchSelectState(options: readonly ControlOption[], recents: RecentValues, onChange: (value: string) => void, onClosed: () => void): SearchSelectState {
  const [open, setOpen] = useState(false);
  const [query, setQueryState] = useState('');
  const [rawHighlight, setHighlight] = useState(-1);
  const sections = useMemo(() => buildSearchSelectSections(options, query, recents.recents), [options, query, recents.recents]);
  const highlight = rawHighlight < sections.flat.length ? rawHighlight : -1;
  const active = sections.flat[highlight];
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

  const submit = useCallback((via: (option: ControlOption) => void = pick) => {
    if (active !== undefined) via(active);
  }, [active, pick]);

  const setQuery = useCallback((next: string) => {
    setQueryState(next);
    setHighlight(highlightAfterQuery(next));
  }, []);

  const onKey = useCallback((key: string) => {
    const count = sections.flat.length;
    if (key === KEY_DOWN) setHighlight(moveHighlight(highlight, count, 1));
    if (key === KEY_UP) setHighlight(moveHighlight(highlight, count, -1));
    if (key === KEY_ESCAPE) close();
  }, [sections.flat.length, highlight, close]);

  const openList = useCallback(() => setOpen(true), []);
  return { open, query, highlight, active, sections, openList, close, setQuery, pick, submit, onKey };
}
