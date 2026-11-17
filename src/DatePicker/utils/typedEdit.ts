import type { ClipboardEvent, KeyboardEvent, SyntheticEvent } from 'react';

import type { TypedDate } from '../hooks/useTypedDate';

const DELETE_KEYS = new Set(['Backspace', 'Delete']);

export interface TypedEditBind {
  onEditKey: (event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLInputElement>) => void;
  onCut: (event: ClipboardEvent<HTMLInputElement>) => void;
}

function coversAll(input: HTMLInputElement): boolean {
  const { selectionStart, selectionEnd, value } = input;
  return value !== '' && selectionStart === 0 && selectionEnd === value.length;
}

function isPrintable(event: KeyboardEvent<HTMLInputElement>): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey;
}

/** Edit handlers for a typed date input: a whole selection is replaced by the key or paste, else the typed form starts. */
export function typedEditBind(typed: TypedDate): TypedEditBind {
  const start = (event: SyntheticEvent<HTMLInputElement>, replacement: string): void => {
    if (typed.onEdit(coversAll(event.currentTarget) ? replacement : undefined)) event.preventDefault();
  };
  return {
    onEditKey: (event) => {
      if (isPrintable(event)) start(event, event.key);
      else if (DELETE_KEYS.has(event.key)) start(event, '');
    },
    onPaste: (event) => start(event, event.clipboardData.getData('text')),
    onCut: (event) => {
      if (!coversAll(event.currentTarget)) typed.onEdit();
    },
  };
}
