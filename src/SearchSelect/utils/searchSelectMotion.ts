import { SelectSurface } from '../SelectSurface';

/** Below this window width the list opens as a sheet from the bottom. */
export const PHONE_MAX_WIDTH = 600;
const SHEET_TRAVEL_PX = 320;
const DROPDOWN_TRAVEL_PX = -8;
const SHEET_MS = 240;
const DROPDOWN_MS = 160;

/** Where the list slides from and how long it takes. */
export interface SelectMotion {
  readonly surface: SelectSurface;
  readonly fromY: number;
  readonly durationMs: number;
}

/** Sheet on a phone, unfolding list on a computer; reduced motion keeps the surface and drops the slide. */
export function resolveSelectMotion(width: number, reducedMotion: boolean): SelectMotion {
  const isPhone = width < PHONE_MAX_WIDTH;
  const surface = isPhone ? SelectSurface.Sheet : SelectSurface.Dropdown;
  if (reducedMotion) return { surface, fromY: 0, durationMs: 0 };
  return isPhone ? { surface, fromY: SHEET_TRAVEL_PX, durationMs: SHEET_MS } : { surface, fromY: DROPDOWN_TRAVEL_PX, durationMs: DROPDOWN_MS };
}
