import React, { createContext, useContext } from 'react';

import type { ViewStyle } from 'react-native';

/** Checkbox look: `default` = 20 px box; `compact` = 16 px box for dense desktop tables and forms. The row keeps its 44 px hit box. */
export type CheckboxLook = 'default' | 'compact';

/** The label column grows from its text width and may shrink to 0, wrapping an unbroken label (inherited `overflowWrap`) instead of clipping it at the card edge (TEXT-FIT-1). */
export const CHECKBOX_TEXT_COLUMN: ViewStyle = { flexGrow: 1, flexShrink: 1, minWidth: 0, overflowWrap: 'anywhere' } as unknown as ViewStyle;

const COMPACT_BOX: ViewStyle = { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5 };

const CheckboxLookContext = createContext<CheckboxLook>('default');

/** Sets the look of every `FormCheckbox` below it; outside one, checkboxes keep the `default` look. */
export function CheckboxLookProvider({ look, children }: { look: CheckboxLook; children: React.ReactNode }): React.ReactElement {
  return <CheckboxLookContext.Provider value={look}>{children}</CheckboxLookContext.Provider>;
}

/** The box style a look lays over the default box; `undefined` for `default`. */
export function checkboxLookBox(look: CheckboxLook): ViewStyle | undefined {
  return look === 'compact' ? COMPACT_BOX : undefined;
}

/** The box style of the nearest provider's look. */
export function useCheckboxLookBox(): ViewStyle | undefined {
  return checkboxLookBox(useContext(CheckboxLookContext));
}
