/**
 * `FormGrid` — the wrapping form row, extracted from ~177 hand-rolled copies.
 *
 * Verbatim in every portal, differing only in one constant:
 *
 * ```ts
 * grid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
 * field: { minWidth: 220, flexGrow: 1, flexBasis: 260 },   // or 200/240/260
 * ```
 *
 * Extracting it is worth more than the deleted lines: because the grid declares itself through
 * `FormGridContext`, a `Field` inside it knows its vertical rhythm is owned by the grid's `gap` and
 * drops its own bottom margin. That kills the fleet's 16 `marginBottom: 0` cancel hacks at the same
 * time — the grid and the cancel were always two halves of one bug.
 *
 * The cell metrics live on the GRID, not on each cell, because that is how the real call sites are
 * written: one `styles.field` reused by every cell in the row, with the occasional narrow one-off.
 * `<FormCell>` with no props is therefore the common case, and `<FormCell basis={160} grow={false}>`
 * the exception — which is exactly the ratio in aml-v2's `ScreeningForm`.
 */
import React from 'react';

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { FormGridProvider, GapOwnedProvider, type FormGridMetrics } from './formGridContext';

/** The gap 24 of aml-v2's 41 wrapping rows already use. The de-facto fleet default. */
export const FORM_GRID_DEFAULT_GAP = 12;
/** The most common `minWidth` across the fleet's copies (the others are 200 / 240 / 260). */
export const FORM_GRID_DEFAULT_MIN_WIDTH = 220;
/** The most common `flexBasis` across the fleet's copies. */
export const FORM_GRID_DEFAULT_BASIS = 260;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export interface FormGridProps {
  children: React.ReactNode;
  /**
   * Space between cells, horizontally AND between wrapped rows. This is the value that makes the
   * grid own the vertical rhythm, so it is also what a descendant `Field` is dropping its own
   * margin in favour of.
   */
  gap?: number;
  /** Default `minWidth` for every `FormCell` in this grid. */
  minWidth?: number;
  /** Default `flexBasis` for every `FormCell` in this grid. */
  basis?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const FormGrid = ({
  children,
  gap = FORM_GRID_DEFAULT_GAP,
  minWidth = FORM_GRID_DEFAULT_MIN_WIDTH,
  basis = FORM_GRID_DEFAULT_BASIS,
  style,
  testID,
}: FormGridProps): React.ReactElement => {
  // Memoised on the two primitives, not the object literal: a fresh identity every render would
  // re-render every `Field` in the row on every keystroke in any one of them.
  const metrics = React.useMemo<FormGridMetrics>(() => ({ minWidth, basis }), [minWidth, basis]);

  return (
    <FormGridProvider value={metrics}>
      <GapOwnedProvider value>
        <View style={[styles.grid, { gap }, style]} testID={testID}>
          {children}
        </View>
      </GapOwnedProvider>
    </FormGridProvider>
  );
};

export default FormGrid;
