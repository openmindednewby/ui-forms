/**
 * Group selection — the pure tri-state logic behind a "select all" / "select this category"
 * control, kept out of any component so it is testable as LOGIC rather than through the DOM.
 *
 * ## Why it lives here and not in @dloizides/ui-tables
 *
 * `ui-tables` already had this arithmetic inside `DataTable/selection.ts`, but deliberately
 * unexported: its tri-state is a `const enum`, which in a published `.d.ts` is an ambient const
 * enum that every `isolatedModules` consumer rejects. It is also page-scoped and wired to the
 * table's select-all banner. So the second consumer (a 12-tile console picker with no table in
 * sight, and no reason to pull a table package into its bundle budget) could not reach it.
 *
 * This module is the extraction: domain-neutral (keys in, keys out — nothing here knows what a
 * key *is*), component-free, and crossing the package boundary as a plain interface rather than
 * an enum. `ui-tables` can adopt it and delete its private copy.
 */

/** Nothing selected / an empty group — the empty count. */
const NONE = 0;

/**
 * A group's tri-state, as two booleans rather than an enum.
 *
 * `all` and `some` are mutually exclusive: a fully selected group is `{ all: true, some: false }`,
 * so a caller can branch on `all` then `some` without re-deriving "partial" itself. Both false
 * means nothing in the group is selected — which is also what an EMPTY group reports, because an
 * empty group is neither fully nor partially selected.
 */
export interface GroupSelection {
  /** Every key in the group is selected (never true for an empty group). */
  readonly all: boolean;
  /** At least one, but not every, key in the group is selected — the mixed/indeterminate state. */
  readonly some: boolean;
}

/** How many of the group's keys are currently selected. */
function countSelected<T>(selected: readonly T[], groupKeys: readonly T[]): number {
  return groupKeys.filter((key) => selected.includes(key)).length;
}

/**
 * Resolve a group's tri-state from the selection ∩ the group.
 *
 * Scoped to the GROUP, not to the whole selection: selected keys OUTSIDE the group must never
 * make this group look partially selected.
 */
export function resolveGroupSelection<T>(selected: readonly T[], groupKeys: readonly T[]): GroupSelection {
  const count = countSelected(selected, groupKeys);
  if (count === NONE) return { all: false, some: false };
  return count === groupKeys.length ? { all: true, some: false } : { all: false, some: true };
}

/**
 * The value an `aria-checked` / `accessibilityState` consumer needs for a tri-state control.
 *
 * A partially selected group is `'mixed'`, which is what makes a screen reader announce the
 * control honestly instead of claiming the whole category is on.
 */
export function groupAriaChecked(state: GroupSelection): boolean | 'mixed' {
  if (state.all) return true;
  return state.some ? 'mixed' : false;
}

/**
 * Toggle a whole group, returning the NEXT selection array. Pure — never mutates the input.
 *
 * All-on → off. Partial or off → on: the conventional behaviour, and the one a mixed checkbox
 * looks like it will do. Keys OUTSIDE the group always survive untouched, so a category control
 * can never silently clear a selection it does not own.
 *
 * `order`, when given, is the canonical key order the result is sorted into (catalogue order, say)
 * so the selection does not carry click order around. Without it, newly added keys are appended.
 */
export function toggleGroupSelection<T>(
  selected: readonly T[],
  groupKeys: readonly T[],
  order?: readonly T[],
): T[] {
  const { all } = resolveGroupSelection(selected, groupKeys);
  if (all) return selected.filter((key) => !groupKeys.includes(key));
  const merged = [...selected];
  groupKeys.forEach((key) => {
    if (!merged.includes(key)) merged.push(key);
  });
  return order === undefined ? merged : order.filter((key) => merged.includes(key));
}
