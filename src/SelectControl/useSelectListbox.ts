import { useEffect, useState } from 'react';

import type { ControlOption } from '../controls/controlTypes';
import { NO_HIGHLIGHT, nextHighlight } from '../controls/nextHighlight';

const FORWARD = 1;
const BACKWARD = -1;

interface ListboxKeyEvent {
  key: string;
  preventDefault: () => void;
  stopPropagation: () => void;
}

export interface SelectListboxInput {
  options: readonly ControlOption[];
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
  select: (value: string) => void;
}

export interface SelectListbox {
  highlighted: ControlOption | undefined;
  onKeyDown: (event: ListboxKeyEvent) => void;
}

/** Keyboard for a select whose focus stays on its trigger: arrows move the highlight, Enter or Space commits. */
export function useSelectListbox({ options, isOpen, open, toggle, select }: SelectListboxInput): SelectListbox {
  const [row, setRow] = useState(NO_HIGHLIGHT);
  const highlighted: ControlOption | undefined = isOpen ? options[row] : undefined;

  useEffect(() => {
    if (!isOpen) setRow(NO_HIGHLIGHT);
  }, [isOpen]);

  const onKeyDown = (event: ListboxKeyEvent): void => {
    const { key } = event;
    const isArrow = key === 'ArrowDown' || key === 'ArrowUp';
    if (!isArrow && key !== 'Enter' && key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    if (isArrow) {
      open();
      setRow((current) => nextHighlight(current, options.length, key === 'ArrowDown' ? FORWARD : BACKWARD));
    } else if (highlighted !== undefined) select(highlighted.value);
    else toggle();
  };

  return { highlighted, onKeyDown };
}
