import { useEffect, useState } from 'react';

import { useDatePickerConfig } from './useDatePickerConfig';
import { formatTyped, parseTyped } from '../utils/formatDate';
import { isWithinBounds } from '../utils/isoDate';

import type { DateBounds } from '../types';

export interface TypedDateArgs {
  value: string;
  onChange: (value: string) => void;
  bounds: DateBounds;
  format: (iso: string, locale?: string) => string;
  onError?: (message: string | undefined) => void;
  /** Replaces the out-of-bounds error, e.g. a range end order message. */
  rangeMessage?: string;
  /** Keeps the locale display on focus until the user edits (`onEdit` or typing). */
  editOnType?: boolean;
}

export interface TypedDate {
  display: string;
  onText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  /** Starts editing: the text becomes `replacement` when given, else the typed numeric form; true when it applied `replacement`. */
  onEdit: (replacement?: string) => boolean;
  /** True when the typed text is empty or a valid in-bounds date; reports the error otherwise. */
  isReady: () => boolean;
}

/** A typeable date: shows the locale display at rest, the numeric form while editing, emits only valid in-bounds dates. */
export function useTypedDate({ value, onChange, bounds, format, onError, rangeMessage, editOnType = false }: TypedDateArgs): TypedDate {
  const { labels, locale } = useDatePickerConfig();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    setText((current) => {
      const parsed = current.trim() === '' ? '' : parseTyped(current, locale);
      if (parsed === null || parsed === value) return current;
      return value === '' ? '' : formatTyped(value, locale);
    });
  }, [value, locale]);

  const verdict = (typed: string): string | undefined => {
    if (typed.trim() === '') return undefined;
    const parsed = parseTyped(typed, locale);
    if (parsed === null) return labels.invalidDate;
    return isWithinBounds(parsed, bounds.min, bounds.max) ? undefined : rangeMessage ?? labels.outOfRange;
  };

  const startEdit = (): void => {
    setEditing(true);
    setText(value === '' ? '' : formatTyped(value, locale));
  };

  const onText = (next: string): void => {
    setEditing(true);
    setText(next);
    if (next.trim() === '') {
      onError?.(undefined);
      onChange('');
      return;
    }
    const parsed = parseTyped(next, locale);
    if (parsed === null) return;
    const message = verdict(next);
    onError?.(message);
    if (message === undefined) onChange(parsed);
  };

  const isReady = (): boolean => {
    if (!editing) return true;
    const message = verdict(text);
    onError?.(message);
    return message === undefined;
  };

  return {
    display: editing ? text : value === '' ? '' : format(value, locale),
    onText,
    onFocus: () => {
      if (!editOnType) startEdit();
    },
    onBlur: () => {
      setEditing(false);
      if (editing && verdict(text) !== undefined) onError?.(verdict(text));
    },
    onEdit: (replacement) => {
      if (editing) return false;
      if (replacement !== undefined) onText(replacement);
      else startEdit();
      return replacement !== undefined;
    },
    isReady,
  };
}
