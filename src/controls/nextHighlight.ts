export const NO_HIGHLIGHT = -1;

/** The row index an arrow key moves to: wraps at both ends, -1 when there are no rows. */
export function nextHighlight(current: number, count: number, delta: number): number {
  if (count === 0) return NO_HIGHLIGHT;
  if (current === NO_HIGHLIGHT) return delta > 0 ? 0 : count - 1;
  return (current + delta + count) % count;
}
