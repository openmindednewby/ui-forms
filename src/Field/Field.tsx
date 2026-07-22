/**
 * Field — the generic "label over a control, hint + error under it" wrapper.
 *
 * `FormField` is hard-wired to a text input, so any NON-text control (a dropdown, a date picker,
 * a chip selector) had no shared way to get a label — and ended up visually misaligned next to
 * its `FormField` siblings: its box started a label-row higher, and it missed the container's
 * bottom margin so wrapped rows lost their vertical rhythm.
 *
 * `Field` is that label row + spacing, control-agnostic. Its metrics are the single source of
 * truth: `FormField` composes `Field` internally, so the two can never drift apart.
 *
 * Children may be a plain node (the common case — just wrap your control) or a render function
 * receiving `{ describedById, hasError }`, so a custom control can wire the hint AND error lines
 * into its own `aria-describedby` / invalid state exactly the way `FormField` does.
 *
 * The anatomy (label → control → hint → error), the two label voices, the mutually-exclusive
 * required/optional markers and the collapsing error slot all implement the shared cross-stack
 * contract in `PROOViD/AMLService/AMLService/wwwroot/shared/FORMS.md`.
 */
import React from 'react';

import { StyleSheet, View, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { attachControlId } from './attachControlId';
import { FieldLabel } from './FieldLabel';
import { DEFAULT_OPTIONAL_LABEL, resolveFieldMarker } from './fieldMarkers';
import { fieldSpacingStyleSet, resolveFieldSpacing, type FieldSpacing } from './fieldSpacing';
import { resolveLabelVariantStyle, type FieldLabelVariant } from './labelVariants';
import { useIsGapOwned } from '../FormGrid/formGridContext';

const ERROR_FONT_SIZE = 12;
const HINT_FONT_SIZE = 12;
/** The optional marker drops to normal weight so it reads as an aside inside a 600 label. */
const OPTIONAL_MARK_FONT_WEIGHT = '400';

/**
 * The metrics that do NOT depend on the spacing model. Everything positional — the container's
 * bottom margin, the label's bottom margin, the hint/error top margins — moved to `fieldSpacing`,
 * because those are exactly the values the two models disagree about.
 */
const styles = StyleSheet.create({
  hintText: {
    fontSize: HINT_FONT_SIZE,
  },
  errorText: {
    fontSize: ERROR_FONT_SIZE,
  },
  optionalMark: {
    fontWeight: OPTIONAL_MARK_FONT_WEIGHT,
  },
});

interface ThemeStyles {
  label: TextStyle;
  requiredMark: TextStyle;
  optionalMark: TextStyle;
  hintText: TextStyle;
  errorText: TextStyle;
}

/** What a render-function child receives, so it can mirror `FormField`'s error wiring. */
export interface FieldChildContext {
  /**
   * Space-separated ids of the lines describing this control — the hint, the error, or both, in
   * reading order. `undefined` when there is neither. Assign straight to `aria-describedby`.
   */
  describedById?: string;
  hasError: boolean;
  /**
   * `id` this field's `<label for>` points at. Assign it to the control (RN `id` → DOM `id`) and
   * clicking the label text focuses the control — a free doubling of the hit area that every
   * field was throwing away.
   *
   * A plain-node child gets this injected automatically (see below); a render-function child has
   * to place it, because only the caller knows which element inside is the actual control.
   */
  controlId: string;
  /**
   * `id` OF the label element. For a control that `<label for>` cannot address — anything that is
   * not a native form element, e.g. the `<div role="button">` a `SelectControl` trigger renders —
   * point `aria-labelledby` here instead.
   */
  labelId: string;
}

export type FieldChildren = React.ReactNode | ((context: FieldChildContext) => React.ReactNode);

export interface FieldProps {
  /**
   * Label shown above the control. Optional so a control whose label is supplied elsewhere (or
   * which genuinely has none) can still use the shared shell for its error line + spacing: an
   * absent or empty label renders NO label row at all, rather than an empty one that would add a
   * phantom gap and misalign the control against its labelled siblings.
   */
  label?: string;
  children: FieldChildren;
  required?: boolean;
  /**
   * Marks the field explicitly optional. MUTUALLY EXCLUSIVE with `required` — if both are set,
   * `required` wins (the safe direction: an under-marked required field causes a failed submit).
   * Use it to mark the MINORITY: on a mostly-required form, marking the two optional fields is far
   * less noise than asterisking the other eleven.
   */
  optional?: boolean;
  /**
   * Pre-localized text for the optional marker. Defaults to the English `DEFAULT_OPTIONAL_LABEL`
   * so a single-locale app can adopt `optional` in one line; a localized app MUST pass this.
   */
  optionalLabel?: string;
  /**
   * Help line rendered UNDER the control and ABOVE the error — the sentence that stops the user
   * guessing. It coexists with `error` (the hint states the rule, the error says which rule was
   * broken) and both are reachable from the control via `aria-describedby`.
   *
   * Rendering a hint INSIDE the field is the point: as an outside sibling it lands past the
   * container's 16px bottom margin and detaches from the control it explains.
   */
  hint?: string;
  error?: string;
  /**
   * Which of the two contract label voices to speak: `field` (13/600 sentence case — the default,
   * unchanged) or `control` (11/700 uppercase — dense filter bars and toolbars).
   */
  labelVariant?: FieldLabelVariant;
  /**
   * Escape hatch applied AFTER `labelVariant`, for the genuine one-off a variant does not cover.
   * Prefer `labelVariant`: it is the reviewable, named choice, and a bare `labelStyle` is the thing
   * to grep for when auditing label drift.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * `StyleProp` (not a bare `ViewStyle`) so a caller can compose an array — e.g. a base field style
   * plus a `grow` modifier — instead of having to restate a COMPLETE style per variant.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Which of the two spacing models this field speaks — see `fieldSpacing.ts`.
   *
   * Leave it unset. Inside a `FormGrid` or `FormSection` it resolves to `gap` (the FORMS.md
   * contract: no bottom margin, the parent's `gap` owns the rhythm); anywhere else it resolves to
   * `stack` (the historical 16px margin, byte-identical to 1.8.0). Set it explicitly only to
   * override that — e.g. a cell inside a grid that genuinely stacks two fields wants `stack`.
   */
  spacing?: FieldSpacing;
  testID?: string;
}

let fieldSeq = 0;
/**
 * Stable-per-instance ids so the label, hint and error lines can be linked to the control via
 * `htmlFor` / `aria-labelledby` / `aria-describedby`. One counter bump per field keeps every id
 * of a field in lockstep.
 */
export function useFieldIds(): { hintId: string; errorId: string; controlId: string; labelId: string } {
  const [ids] = React.useState(() => {
    fieldSeq += 1;
    const seq = String(fieldSeq);
    return {
      hintId: `field-hint-${seq}`,
      errorId: `field-error-${seq}`,
      controlId: `field-control-${seq}`,
      labelId: `field-label-${seq}`,
    };
  });
  return ids;
}

/** Stable-per-instance id so the error line can be linked to the control via aria-describedby. */
export function useFieldErrorId(): string {
  return useFieldIds().errorId;
}

/** True only for a present, non-empty string. */
function isPresent(value?: string): boolean {
  return typeof value === 'string' && value !== '';
}

/** True only for a present, non-empty error string. */
export function hasFieldError(error?: string): boolean {
  return isPresent(error);
}

/**
 * Join the ids of the lines describing the control, in reading order (hint then error), skipping
 * any that is not rendered. `undefined` — not `''` — when there is nothing, so the attribute is
 * omitted entirely rather than emitted empty.
 */
export function joinDescribedBy(hintId?: string, errorId?: string): string | undefined {
  const ids = [hintId, errorId].filter((id): id is string => isPresent(id));
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export const Field = ({
  label,
  children,
  required = false,
  optional = false,
  optionalLabel = DEFAULT_OPTIONAL_LABEL,
  hint,
  error,
  labelVariant,
  labelStyle,
  containerStyle,
  spacing,
  testID,
}: FieldProps): React.ReactElement => {
  const { theme } = useUi();
  const gapOwned = useIsGapOwned();
  const spacingStyles = fieldSpacingStyleSet(resolveFieldSpacing(spacing, gapOwned));
  const { colors, semantic } = theme;
  const errorColor = semantic.error['500'];
  const hasError = hasFieldError(error);
  const hasHint = isPresent(hint);
  const labelText = label ?? '';
  const hasLabel = labelText !== '';
  const marker = resolveFieldMarker(required, optional);
  const { hintId, errorId, controlId, labelId } = useFieldIds();

  const themeStyles = React.useMemo<ThemeStyles>(
    () => ({
      label: { color: colors.textSecondary },
      requiredMark: { color: errorColor },
      // The optional marker is an aside, so it sits a step back from the label's own ink.
      optionalMark: { color: colors.textSecondary },
      hintText: { color: colors.textSecondary },
      errorText: { color: errorColor },
    }),
    [colors.textSecondary, errorColor],
  );

  const describedById = joinDescribedBy(hasHint ? hintId : undefined, hasError ? errorId : undefined);

  // A render-function child places `controlId` itself, so the label always targets it. A plain
  // node has the id injected — and `attachControlId` reports back whether that was possible, so
  // the label never emits an `htmlFor` pointing at an element that does not exist.
  const isRenderChild = typeof children === 'function';
  const attached = isRenderChild
    ? { node: children({ describedById, hasError, controlId, labelId }), controlId }
    : attachControlId(children, controlId, describedById);
  const control = attached.node;

  return (
    <View style={[spacingStyles.container, containerStyle]} testID={testID}>
      {hasLabel ? (
        <FieldLabel
          controlId={attached.controlId}
          label={labelText}
          labelId={labelId}
          marker={marker}
          optionalLabel={optionalLabel}
          optionalMarkStyle={[styles.optionalMark, themeStyles.optionalMark]}
          requiredMarkStyle={themeStyles.requiredMark}
          style={[spacingStyles.label, resolveLabelVariantStyle(labelVariant), themeStyles.label, labelStyle]}
        />
      ) : null}
      {control}
      {hasHint ? (
        <Text nativeID={hintId} style={[styles.hintText, spacingStyles.child, themeStyles.hintText]}>
          {hint}
        </Text>
      ) : null}
      {hasError ? (
        <Text nativeID={errorId} role="alert" style={[styles.errorText, spacingStyles.child, themeStyles.errorText]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default Field;
