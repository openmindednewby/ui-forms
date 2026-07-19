/**
 * `Field`'s TWO spacing models — the F3 fix, shipped as an OPT-IN rather than a breaking change.
 *
 * ## The defect
 *
 * `Field` hard-coded a 16px bottom margin on its container and 4px margins on its label / hint /
 * error. That is the pre-flexbox model: the CHILD owns the space after itself. In a `gap`-laid-out
 * parent — which is how every modern form row in this fleet is written — the child's margin STACKS
 * on the parent's gap, so the consumer has to cancel it by hand. aml-v2 alone carries 13
 * `marginBottom: 0` cancels, each with an apologetic comment; the fleet carries 16.
 *
 * AML v1 got this right in CSS: `.ui-field { display: flex; flex-direction: column; gap: 6px; }` —
 * internal gap only, and the parent grid owns the space BETWEEN fields. That contract is written up
 * in `PROOViD/AMLService/AMLService/wwwroot/shared/FORMS.md` ("The gap is owned by the container,
 * never by margins on the children").
 *
 * ## Why opt-in and not a 2.0.0
 *
 * Switching every `Field` to the gap model at once moves pixels on every form in seven portals in a
 * single publish — which is exactly the change you cannot visually QA, because there is no app you
 * can look at that is still on the old behaviour to compare against. The two models are therefore
 * both implemented, selected per field:
 *
 *  - `stack` (DEFAULT) — the historical margins, byte-identical to 1.8.0. Every existing consumer
 *    is untouched, including the 16 that currently cancel the margin.
 *  - `gap` — the FORMS.md contract: no bottom margin at all, uniform 6px internal gap. The parent
 *    owns the rhythm.
 *
 * A `Field` inside a `FormGrid` resolves to `gap` automatically, so adopting the shared grid IS the
 * opt-in — the consumer deletes its hand-rolled `grid`/`field` styles and its margin cancel in the
 * same edit, and the fleet migrates one app at a time behind visual QA.
 */
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

/**
 * Which spacing model a field speaks.
 *
 * A plain string union rather than a `const enum` for the same reason as `FieldLabelVariant`: this
 * type crosses the package boundary into consumers' `.d.ts`, and a cross-boundary `const enum`
 * breaks `isolatedModules` / Babel-only builds.
 */
export type FieldSpacing = 'stack' | 'gap';

/** The historical bottom margin of a whole field block. Load-bearing for every un-migrated form. */
export const FIELD_STACK_MARGIN_BOTTOM = 16;
/** The historical label→control margin. */
export const FIELD_STACK_LABEL_MARGIN_BOTTOM = 4;
/** The historical control→hint and hint→error margin. */
export const FIELD_STACK_CHILD_MARGIN_TOP = 4;
/** FORMS.md: one uniform gap between label, control, hint and error. Not four separate margins. */
export const FIELD_CONTRACT_GAP = 6;

export const fieldSpacingStyles = StyleSheet.create({
  stackContainer: { marginBottom: FIELD_STACK_MARGIN_BOTTOM },
  stackLabel: { marginBottom: FIELD_STACK_LABEL_MARGIN_BOTTOM },
  stackChild: { marginTop: FIELD_STACK_CHILD_MARGIN_TOP },
  /**
   * The gap model sets NO margins — not even zeroed ones. An explicit `marginBottom: 0` here would
   * defeat a caller who legitimately wants to push one field down via `containerStyle`, because
   * `containerStyle` composes AFTER this and a zero is indistinguishable from "unset" to a reader.
   */
  gapContainer: { gap: FIELD_CONTRACT_GAP },
  none: {},
});

/** The style pieces a field applies for one spacing model. */
export interface FieldSpacingStyles {
  container: ViewStyle;
  label: TextStyle;
  /** Applied to the hint AND the error — the two lines that sit under the control. */
  child: TextStyle;
}

/**
 * Resolve the caller's explicit choice against the surrounding grid.
 *
 * Precedence, and why: an EXPLICIT `spacing` prop always wins, so a consumer inside a `FormGrid`
 * that genuinely needs the old margin (a one-off cell that stacks two fields) can say so without
 * leaving the grid. Absent that, a grid means the grid's `gap` owns the rhythm. Absent both, the
 * historical model — the answer that changes nothing.
 */
export function resolveFieldSpacing(explicit: FieldSpacing | undefined, insideGrid: boolean): FieldSpacing {
  if (explicit !== undefined) return explicit;

  return insideGrid ? 'gap' : 'stack';
}

/**
 * The style pieces for a resolved model.
 *
 * Exported and pure so `Field` and `ChipSelector` can be proven to resolve IDENTICALLY. They drifted
 * once already — `ChipSelector` grew a `marginBottom: -8` whose comment blamed `Field`'s 16px — and a
 * shared pure function is what makes "they agree" a testable claim rather than a convention.
 */
export function fieldSpacingStyleSet(spacing: FieldSpacing): FieldSpacingStyles {
  if (spacing === 'gap') {
    return {
      container: fieldSpacingStyles.gapContainer,
      label: fieldSpacingStyles.none,
      child: fieldSpacingStyles.none,
    };
  }

  return {
    container: fieldSpacingStyles.stackContainer,
    label: fieldSpacingStyles.stackLabel,
    child: fieldSpacingStyles.stackChild,
  };
}
