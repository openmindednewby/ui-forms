/**
 * Pure key logic for the WAI-ARIA radio group pattern used by ChipSelector's opt-in radio mode.
 * Kept free of React and the DOM so every branch is unit-testable without rendering.
 */

const SPACE_KEYS: readonly string[] = [' ', 'Spacebar'];
const NEXT_KEYS: readonly string[] = ['ArrowRight', 'ArrowDown'];
const PREVIOUS_KEYS: readonly string[] = ['ArrowLeft', 'ArrowUp'];
const ROVING_TAB_STOP = 0;
const ROVING_SKIPPED = -1;

/**
 * The option index a radio group should select when `key` is pressed on the chip at `index`,
 * or `null` when the key is not part of the pattern.
 *
 * - Space activates the focused chip (returns `index`).
 * - ArrowRight/ArrowDown → next chip, ArrowLeft/ArrowUp → previous, wrapping at both ends.
 * - Enter is deliberately `null`: RNW's press responder already activates a `<div>` chip on
 *   Enter, so handling it here would fire `onChange` twice.
 * - Arrows in a one-chip group are `null` — there is nowhere to move, so nothing is selected.
 */
export function radioKeyTarget(key: string, index: number, count: number): number | null {
  const isOutOfRange = index < 0 || index >= count;
  if (isOutOfRange)
    return null;

  if (SPACE_KEYS.includes(key))
    return index;

  const isArrow = NEXT_KEYS.includes(key) || PREVIOUS_KEYS.includes(key);
  if (!isArrow || count === 1)
    return null;

  const step = NEXT_KEYS.includes(key) ? 1 : -1;
  return (index + step + count) % count;
}

/**
 * Roving tabindex: only the selected chip — or the first chip when nothing is selected — is a
 * tab stop. A disabled group has no tab stop at all.
 */
export function radioTabIndex(index: number, selectedIndex: number, disabled: boolean): 0 | -1 {
  if (disabled)
    return ROVING_SKIPPED;

  const tabStop = selectedIndex >= 0 ? selectedIndex : 0;
  return index === tabStop ? ROVING_TAB_STOP : ROVING_SKIPPED;
}
