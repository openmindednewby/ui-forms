import { DropdownPlacement } from '../DropdownPlacement';

const MIN_PANEL_WIDTH = 240;
const EDGE = 8;

export interface AnchorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DropdownFrame {
  placement: DropdownPlacement;
  left: number;
  width: number;
  top?: number;
  bottom?: number;
}

/** Opens below when the list fits there, else on whichever side has more room. */
export function placeDropdown(anchor: AnchorRect, panelHeight: number, viewportHeight: number): DropdownPlacement {
  const roomBelow = viewportHeight - (anchor.y + anchor.height);
  if (roomBelow >= panelHeight) return DropdownPlacement.Below;
  return anchor.y > roomBelow ? DropdownPlacement.Above : DropdownPlacement.Below;
}

/** The window frame for the list next to `anchor`, on the side `placeDropdown` picks. */
export function dropdownFrame(anchor: AnchorRect, panelHeight: number, viewportHeight: number): DropdownFrame {
  const placement = placeDropdown(anchor, panelHeight, viewportHeight);
  const base = { placement, left: anchor.x, width: anchor.width };
  if (placement === DropdownPlacement.Above) return { ...base, bottom: viewportHeight - anchor.y };
  return { ...base, top: anchor.y + anchor.height };
}

/** Widens a narrow anchor's list to a readable width and keeps it inside the viewport. */
export function fitDropdownWidth(frame: DropdownFrame, viewportWidth: number): DropdownFrame {
  const width = Math.max(frame.width, Math.min(MIN_PANEL_WIDTH, viewportWidth - EDGE - EDGE));
  const left = Math.max(EDGE, Math.min(frame.left, viewportWidth - width - EDGE));
  return { ...frame, width, left: frame.width >= width ? frame.left : left };
}
