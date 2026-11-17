import type { ClipboardEvent, KeyboardEvent, SyntheticEvent } from 'react';

import type { TypedDate } from '../hooks/useTypedDate';

const DELETE_KEYS = new Set(['Backspace', 'Delete']);

export interface TypedEditBind {
  onEditKey: (event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLInputElement>) => void;
  onCut: (event: ClipboardEvent<HTMLInputElement>) => void;
}

interface EditedText {
  text: string;
  caret: number;
}

function isPrintable(event: KeyboardEvent<HTMLInputElement>): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey;
}

function selection(input: HTMLInputElement): [number, number] {
  const end = input.selectionEnd ?? input.value.length;
  return [input.selectionStart ?? end, end];
}

function editedText(input: HTMLInputElement, insert: string): EditedText {
  const [start, end] = selection(input);
  return { text: input.value.slice(0, start) + insert + input.value.slice(end), caret: start + insert.length };
}

function placeCaret(input: HTMLInputElement, caret: number): void {
  requestAnimationFrame(() => input.setSelectionRange(caret, caret));
}

/** Edit handlers for a typed date input: a key, paste or cut over a selection edits the shown text there and keeps the caret, else the typed form starts. */
export function typedEditBind(typed: TypedDate): TypedEditBind {
  const start = (event: SyntheticEvent<HTMLInputElement>, insert: string): void => {
    const input = event.currentTarget;
    const [from, to] = selection(input);
    if (from === to) {
      typed.onEdit();
      return;
    }
    const edit = editedText(input, insert);
    if (!typed.onEdit(edit.text)) return;
    event.preventDefault();
    placeCaret(input, edit.caret);
  };
  return {
    onEditKey: (event) => {
      if (isPrintable(event)) start(event, event.key);
      else if (DELETE_KEYS.has(event.key)) start(event, '');
    },
    onPaste: (event) => start(event, event.clipboardData.getData('text')),
    onCut: (event) => {
      const input = event.currentTarget;
      const [from, to] = selection(input);
      if (from === to) return;
      event.clipboardData.setData('text/plain', input.value.slice(from, to));
      start(event, '');
    },
  };
}
