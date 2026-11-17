import type { AnchorRect } from '../../AnchoredMenu/menuPortal';

const GAP = 4;
const MARGIN = 8;

export interface PopoverBox {
  top: number;
  left: number;
  width: number;
}

/** Places a popover under its field, left-aligned and kept inside the viewport. */
export function popoverPlacement(rect: AnchorRect, width: number, viewportWidth: number): PopoverBox {
  const boxWidth = Math.min(width, viewportWidth - 2 * MARGIN);
  const left = Math.max(MARGIN, Math.min(rect.left, viewportWidth - MARGIN - boxWidth));
  return { top: rect.bottom + GAP, left, width: boxWidth };
}
