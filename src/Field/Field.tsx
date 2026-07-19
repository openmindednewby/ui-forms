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

import { FieldLabel } from './FieldLabel';
import { DEFAULT_OPTIONAL_LABEL, resolveFieldMarker } from './fieldMarkers';
import { resolveLabelVariantStyle, type FieldLabelVariant } from './labelVariants';

/** Bottom margin of the whole field block — the vertical rhythm every form row shares. */
const CONTAINER_MARGIN_BOTTOM = 16;
const LABEL_MARGIN_BOTTOM = 4;
const ERROR_FONT_SIZE = 12;
const ERROR_MARGIN_TOP = 4;
const HINT_FONT_SIZE = 12;
const HINT_MARGIN_TOP = 4;
/** The optional marker drops to normal weight so it reads as an aside inside a 600 label. */
const OPTIONAL_MARK_FONT_WEIGHT = '400';

const styles = StyleSheet.create({
  container: {
    marginBottom: CONTAINER_MARGIN_BOTTOM,
  },
  label: {
    marginBottom: LABEL_MARGIN_BOTTOM,
  },
  hintText: {
    fontSize: HINT_FONT_SIZE,
    marginTop: HINT_MARGIN_TOP,
  },
  errorText: {
    fontSize: ERROR_FONT_SIZE,
    marginTop: ERROR_MARGIN_TOP,
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
  testID?: string;
}

let fieldSeq = 0;
/**
 * Stable-per-instance id pair so the hint and error lines can be linked to the control via
 * `aria-describedby`. One counter bump per field keeps the two ids of a field in lockstep.
 */
export function useFieldIds(): { hintId: string; errorId: string } {
  const [ids] = React.useState(() => {
    fieldSeq += 1;
    const seq = String(fieldSeq);
    return { hintId: `field-hint-${seq}`, errorId: `field-error-${seq}` };
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
  testID,
}: FieldProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors, semantic } = theme;
  const errorColor = semantic.error['500'];
  const hasError = hasFieldError(error);
  const hasHint = isPresent(hint);
  const labelText = label ?? '';
  const hasLabel = labelText !== '';
  const marker = resolveFieldMarker(required, optional);
  const { hintId, errorId } = useFieldIds();

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

  const control = typeof children === 'function' ? children({ describedById, hasError }) : children;

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {hasLabel ? (
        <FieldLabel
          label={labelText}
          marker={marker}
          optionalLabel={optionalLabel}
          optionalMarkStyle={[styles.optionalMark, themeStyles.optionalMark]}
          requiredMarkStyle={themeStyles.requiredMark}
          style={[styles.label, resolveLabelVariantStyle(labelVariant), themeStyles.label, labelStyle]}
        />
      ) : null}
      {control}
      {hasHint ? (
        <Text nativeID={hintId} style={[styles.hintText, themeStyles.hintText]}>
          {hint}
        </Text>
      ) : null}
      {hasError ? (
        <Text nativeID={errorId} role="alert" style={[styles.errorText, themeStyles.errorText]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default Field;
