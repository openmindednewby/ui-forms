import type { LineItemColumn } from '../types';

export const LINE_ITEMS_WIDE_MIN_WIDTH = 1280;
export const LINE_ITEMS_DEFAULT_MIN_ITEMS = 1;
export const LINE_ITEMS_CARD_PADDING = 12;
export const LINE_ITEMS_CARD_BORDER = 1;

const DEFAULT_COLUMN_FLEX = 1;

/** True when the window is wide enough for column headers shown once above the lines. */
export function isLineItemsWide(width: number, wideMinWidth: number = LINE_ITEMS_WIDE_MIN_WIDTH): boolean {
  return width >= wideMinWidth;
}

/** True when a line may be removed without going below `minItems`. */
export function canRemoveLine(count: number, minItems: number = LINE_ITEMS_DEFAULT_MIN_ITEMS): boolean {
  return count > minItems;
}

/** The 1-based number a reader sees for the line at `index`. */
export function lineNumberOf(index: number): number {
  return index + 1;
}

/** The share of the row a column takes on the wide layout. */
export function lineItemColumnFlex(column: LineItemColumn): number {
  return column.flex ?? DEFAULT_COLUMN_FLEX;
}
