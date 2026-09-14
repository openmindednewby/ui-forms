/** Shared ChipSelector constants. */

export const TRANSPARENT_COLOR = 'transparent';

/**
 * Chips are visually compact (≈24–26px tall). `hitSlop` expands the pressable's TOUCH area
 * toward the WCAG ≥44px target WITHOUT changing the rendered pill size, so existing layouts are
 * byte-identical while taps/clicks get an easier target.
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
