/**
 * The two contexts the layout primitives publish.
 *
 * They are SEPARATE on purpose, because they answer different questions and have different scopes:
 *
 *  - `FormGridContext` carries a row's CELL METRICS, so `FormCell` can be written `<FormCell>` at
 *    the overwhelmingly common call site and still get the row's `minWidth` / `flexBasis` — the four
 *    constants (200 / 220 / 240 / 260) that the fleet re-declares by hand.
 *  - `GapOwnedContext` says only "the vertical rhythm here is owned by a parent's `gap`". A `Field`
 *    that sees it drops its own 16px bottom margin, which is the whole point of F3.
 *
 * Merging them would force `FormSection` — which also spaces with `gap`, and would otherwise
 * recreate the identical double-spacing bug one level up — to publish cell metrics it has no
 * business having. A section is not a row: a `Field` directly inside a section should be full width,
 * not 260px wide.
 *
 * Nothing about gap-ownership is inferable at runtime — RN's `StyleSheet` gives a child no way to
 * ask "does my parent space me with gap?" — so it has to be declared. Making the declaration a side
 * effect of using the shared primitives means the correct thing happens without a second opt-in.
 */
import React from 'react';

/** Cell metrics a `FormGrid` hands down to its `FormCell` children. */
export interface FormGridMetrics {
  /** Below this the cell stops shrinking and the row wraps. */
  minWidth: number;
  /** The cell's ideal width before grow/shrink — its `flexBasis`. */
  basis: number;
}

/** `null` outside a grid, so `FormCell` can fall back to the package defaults rather than throw. */
const FormGridContext = React.createContext<FormGridMetrics | null>(null);

/**
 * `false` — the historical model — unless a primitive above says otherwise. The default is what
 * every un-migrated `Field` in the fleet reads, so it must be the answer that changes nothing.
 */
const GapOwnedContext = React.createContext(false);

export const FormGridProvider = FormGridContext.Provider;
export const GapOwnedProvider = GapOwnedContext.Provider;

/** The enclosing grid's cell metrics, or `null` outside a `FormGrid`. */
export function useFormGridMetrics(): FormGridMetrics | null {
  return React.useContext(FormGridContext);
}

/** True when a parent primitive owns this subtree's vertical rhythm with `gap`. */
export function useIsGapOwned(): boolean {
  return React.useContext(GapOwnedContext);
}
