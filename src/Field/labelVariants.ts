/**
 * The TWO legitimate label voices, per the shared forms contract
 * (`PROOViD/AMLService/AMLService/wwwroot/shared/FORMS.md` → "The TWO legitimate label voices").
 *
 *  - `field`   — 13 / 600 / sentence case. A label that is READ: prose addressed to the person
 *                filling the form. This is `Field`'s historical, unchanged default, so every
 *                existing consumer renders byte-identically.
 *  - `control` — 11 / 700 / UPPERCASE + letter-spacing. A label that is SCANNED: a key over a value
 *                in a dense row (filter bars, compact toolbars, pager controls). These are exactly
 *                the metrics `@dloizides/ui-tables` forked into its private `FieldShell` because
 *                `Field` hard-coded the `field` voice and offered no way out.
 *
 * A THIRD voice is drift, not a variant. Pick the voice from the SURFACE, not the component: every
 * label on one surface uses one voice, and voices are never mixed within a single row.
 *
 * Why a plain string union and not a `const enum`: this type crosses the package boundary into
 * consumers' `.d.ts`, and a cross-boundary `const enum` breaks `isolatedModules` / Babel-only
 * builds. `@dloizides/ui-buttons` sets the same precedent for `ButtonVariant` for the same reason.
 */
import { StyleSheet, type TextStyle } from 'react-native';

/** Which of the two contract voices a field label speaks. */
export type FieldLabelVariant = 'field' | 'control';

/** The historical `Field` label metrics. Changing these moves pixels in every consumer. */
const FIELD_FONT_SIZE = 13;
const FIELD_FONT_WEIGHT = '600';

/** The dense-control metrics, taken verbatim from `ui-tables`' `FieldShell` fork so it can retire. */
const CONTROL_FONT_SIZE = 11;
const CONTROL_FONT_WEIGHT = '700';
const CONTROL_LETTER_SPACING = 0.4;

export const labelVariantStyles = StyleSheet.create({
  field: {
    fontSize: FIELD_FONT_SIZE,
    fontWeight: FIELD_FONT_WEIGHT,
  },
  control: {
    fontSize: CONTROL_FONT_SIZE,
    fontWeight: CONTROL_FONT_WEIGHT,
    letterSpacing: CONTROL_LETTER_SPACING,
    textTransform: 'uppercase',
  },
});

/**
 * Resolve a variant name to its style. An unknown/absent variant falls back to `field` — the
 * historical default — so a bad value degrades to "unchanged" rather than to "unstyled".
 */
export function resolveLabelVariantStyle(variant?: FieldLabelVariant): TextStyle {
  return variant === 'control' ? labelVariantStyles.control : labelVariantStyles.field;
}
