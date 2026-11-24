/** Chip size. `default` = 44 px pill; `compact` = 28 px pill in a 44 px hit box; `dense` = `compact` with no row gap (44 px row pitch). */
export type ChipSize = 'default' | 'compact' | 'dense';

/** True when the size draws the 28 px pill inside a 44 px hit box. */
export function isCompactSize(size: ChipSize): boolean {
  return size === 'compact' || size === 'dense';
}
