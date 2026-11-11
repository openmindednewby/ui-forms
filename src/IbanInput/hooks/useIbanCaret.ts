import { useCallback, useState } from 'react';

import type { NativeSyntheticEvent, TextInputSelectionChangeEventData } from 'react-native';

import { caretAfterEdit, rawCaretAfterChange } from '../utils/ibanCaret';

export interface IbanSelection {
  start: number;
  end: number;
}

export interface IbanCaret {
  selection: IbanSelection;
  onSelectionChange: (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  placeAfterEdit: (text: string) => void;
}

/** A controlled caret for the grouped IBAN text that survives the spaces added and removed while typing. */
export function useIbanCaret(display: string): IbanCaret {
  const [selection, setSelection] = useState<IbanSelection>({ start: display.length, end: display.length });

  const onSelectionChange = useCallback((event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    setSelection(event.nativeEvent.selection);
  }, []);

  const placeAfterEdit = useCallback((text: string) => {
    const caret = caretAfterEdit(text, rawCaretAfterChange(display, selection.end, text));
    setSelection({ start: caret, end: caret });
  }, [display, selection.end]);

  const clamped = { start: Math.min(selection.start, display.length), end: Math.min(selection.end, display.length) };
  return { selection: clamped, onSelectionChange, placeAfterEdit };
}
