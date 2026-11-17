import React, { type CSSProperties, type KeyboardEvent } from 'react';

import { dayDomId } from '../hooks/useGridFocus';
import { usePickerColors } from '../hooks/usePickerColors';

export interface DayCellState {
  inRange: boolean;
  isEnd: boolean;
  isToday: boolean;
  enabled: boolean;
  focusable: boolean;
}

export interface DayCellProps {
  iso: string;
  state: DayCellState;
  testID: string;
  label: string;
  hint: string;
  onPick: (iso: string) => void;
  onKey: (event: KeyboardEvent<HTMLButtonElement>, iso: string) => void;
}

export const DAY_CELL_PX = 44;
const DAY_START = 8;
const RING = 2;
const FONT = 14;
const BOLD = 700;
const REGULAR = 400;

/** One 44 px day button inside its grid cell. */
export function DayCell({ iso, state, testID, label, hint, onPick, onKey }: DayCellProps): React.ReactElement {
  const colors = usePickerColors();
  const { inRange, isEnd, isToday, enabled, focusable } = state;
  const cellStyle: CSSProperties = { width: DAY_CELL_PX, height: DAY_CELL_PX, flexShrink: 0, background: inRange && !isEnd ? colors.tint : 'transparent' };
  const textColor = isEnd ? colors.onBrand : enabled ? colors.text : colors.textSecondary;
  const buttonStyle: CSSProperties = {
    width: DAY_CELL_PX,
    height: DAY_CELL_PX,
    padding: 0,
    boxSizing: 'border-box',
    borderRadius: DAY_CELL_PX / 2,
    border: `${RING}px solid ${isToday ? colors.brand : 'transparent'}`,
    background: isEnd ? colors.brand : 'transparent',
    color: textColor,
    textDecoration: enabled ? 'none' : 'line-through',
    fontFamily: 'inherit',
    fontSize: FONT,
    fontWeight: isEnd || isToday ? BOLD : REGULAR,
    cursor: enabled ? 'pointer' : 'default',
  };
  return (
    <div aria-selected={isEnd} role="gridcell" style={cellStyle}>
      <button
        aria-current={isToday ? 'date' : undefined}
        aria-label={label}
        data-testid={dayDomId(testID, iso)}
        disabled={!enabled}
        id={dayDomId(testID, iso)}
        style={buttonStyle}
        tabIndex={focusable ? 0 : -1}
        title={hint}
        type="button"
        onClick={() => onPick(iso)}
        onKeyDown={(event) => onKey(event, iso)}
      >
        {Number(iso.slice(DAY_START))}
      </button>
    </div>
  );
}
