/** Chip size. `default` = 44 px pill; `compact` = 28 px pill in a 44 px hit box; `dense` = `compact` with no row gap; `fit` = 28 px pill that is its own box (wide screens); `tap` = 44 px pill with a 13 px label. */
export type ChipSize = 'default' | 'compact' | 'dense' | 'fit' | 'tap';

/** True when the size draws the 28 px pill inside a 44 px hit box. */
export function isCompactSize(size: ChipSize): boolean {
  return size === 'compact' || size === 'dense';
}

/** True when the pressable box is the visible pill, so its fill sits on the box itself. */
export function isFitSize(size: ChipSize): boolean {
  return size === 'fit' || size === 'tap';
}
