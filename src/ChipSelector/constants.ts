/** Shared ChipSelector constants. */

export const TRANSPARENT_COLOR = 'transparent';

/**
 * Extra touch margin around a chip. NATIVE ONLY — this does NOT widen the hit area on RN-web,
 * which is what these portals ship. Measured 2026-09-21 (headless Chromium, 360x640):
 * `elementFromPoint` 5px above a chip's top edge, inside `top: 10`, returns the parent, not the
 * chip. react-native-web 0.21.2 uses `hitSlop` only in the legacy `Touchable` press-retention
 * path and ignores it entirely in `Pressable`. The web target is carried by `minHeight:
 * MIN_TARGET_PX` in `chipStyles`; this constant only helps iOS/Android.
 */
export const CHIP_HIT_SLOP = { top: 10, bottom: 10, left: 4, right: 4 } as const;

/** Gap between adjacent chips, horizontally and between wrapped rows. */
export const CHIP_GUTTER = 8;

/**
 * Default chip testID stem. NOT derived from the `testID` prop, because aml-v2's unit +
 * Playwright specs and erevna/katalogos's `Accessibility.test.tsx` already select on
 * `chip-selector-chip-<value>`. `chipTestIDPrefix` is the opt-in override for consumers
 * (kefi) that need their own stem; the default is frozen.
 */
export const DEFAULT_CHIP_TESTID_PREFIX = 'chip-selector-chip';
