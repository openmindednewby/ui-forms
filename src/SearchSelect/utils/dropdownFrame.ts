import { DropdownPlacement } from '../DropdownPlacement';

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
