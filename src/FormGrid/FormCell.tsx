/**
 * `FormCell` — one cell of a `FormGrid`.
 *
 * Replaces the `<View style={styles.field}>` wrapper every real call site already puts around each
 * control. It inherits `minWidth` / `flexBasis` from the enclosing grid so the common case is a bare
 * `<FormCell>`, and takes per-cell overrides for the genuine one-offs (aml-v2's `fieldNarrow`:
 * `minWidth: 140, flexBasis: 160, flexGrow: 0`).
 *
 * Used OUTSIDE a `FormGrid` it still renders a sensible cell from the package defaults rather than
 * throwing — a cell is a layout hint, and a form that renders slightly wide is a better failure than
 * a form that does not render. The grid-owned SPACING behaviour, by contrast, is deliberately NOT
 * available this way: that one has to come from a real grid, because a `Field` dropping its margin
 * with nothing to replace it would collapse the form.
 */
import React from 'react';

import { View, type StyleProp, type ViewStyle } from 'react-native';

import {
  FORM_GRID_DEFAULT_BASIS,
  FORM_GRID_DEFAULT_MIN_WIDTH,
} from './FormGrid';
import { useFormGridMetrics } from './formGridContext';

/** A cell that grows to fill the row's slack. The default — most fields want the space. */
const GROW = 1;
/** A cell pinned to its basis. For the narrow one-offs (a 2-digit threshold next to a name field). */
const NO_GROW = 0;

export interface FormCellProps {
  children: React.ReactNode;
  /** Overrides the grid's `minWidth` for this cell only. */
  minWidth?: number;
  /** Overrides the grid's `basis` for this cell only. */
  basis?: number;
  /** `false` pins the cell to its basis instead of letting it absorb the row's slack. */
  grow?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const FormCell = ({
  children,
  minWidth,
  basis,
  grow = true,
  style,
  testID,
}: FormCellProps): React.ReactElement => {
  const metrics = useFormGridMetrics();
  const resolvedMinWidth = minWidth ?? metrics?.minWidth ?? FORM_GRID_DEFAULT_MIN_WIDTH;
  const resolvedBasis = basis ?? metrics?.basis ?? FORM_GRID_DEFAULT_BASIS;

  const cellStyle: ViewStyle = {
    minWidth: resolvedMinWidth,
    flexBasis: resolvedBasis,
    flexGrow: grow ? GROW : NO_GROW,
  };

  return (
    <View style={[cellStyle, style]} testID={testID}>
      {children}
    </View>
  );
};

export default FormCell;
