/**
 * Validation ARIA for a form control — web only, no-op on native.
 *
 * ## Why this is here and NOT in `@dloizides/a11y`
 *
 * This looks exactly like adapter work, and moving it into the shared accessibility package
 * is the obvious next step. It would be a mistake, and the reason is worth spelling out
 * because the next person to read this will have the same instinct.
 *
 * `@dloizides/a11y` states its own invariant in `types.ts`: `A11yState` models
 * "only the members with a faithful expression on BOTH platforms ... so a contract can never
 * promise something one platform silently drops (the exact bug class this package exists to
 * close)". `invalid` and `required` have NO faithful React Native expression — RN's
 * `AccessibilityState` has no `invalid`, and `accessibilityRequired` does not exist. Adding
 * them to `A11yState` would make the adapter accept a contract it can only honour on web and
 * must silently discard on native. That is precisely the failure the package was built to
 * prevent, reintroduced through its own front door.
 *
 * So the seam stays here, in the package that owns form semantics, where "web-only" is an
 * honest local statement rather than a promise broken at a platform boundary. Consequently
 * `@dloizides/a11y` needs no version bump for this change.
 *
 * ## Why it exists at all
 *
 * The identical branch was written twice — `ThemedTextInput` and `ChipSelector` — the second
 * even documenting itself as "the same escape-hatch-free pattern `ThemedTextInput` uses". Two
 * copies of one rule is two places for it to drift.
 */
import { Platform } from 'react-native';

/**
 * Web-only ARIA attributes react-native-web forwards to the underlying DOM element but that
 * RN's prop types do not enumerate. Callers cast through their own host props at the spread
 * site (never `any`), so these semantics reach a screen reader without a type escape hatch.
 */
export interface WebFieldA11y {
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
}

export interface WebFieldA11yInput {
  /** id of the element describing this control — typically `Field`'s error/hint line. */
  describedById?: string;
  /** Announce the control as failing validation. */
  hasError?: boolean;
  /**
   * Mark the control mandatory. Omit for controls that have no required affordance; an
   * omitted value emits nothing rather than `aria-required="false"`, which would tell a
   * screen reader something different from saying nothing at all.
   */
  required?: boolean;
}

const IS_WEB = Platform.OS === 'web';

/**
 * Build the validation ARIA for a form control.
 *
 * Returns an EMPTY object on native — deliberately, and not as an oversight: there is no
 * native equivalent to emit, and inventing one would mean claiming a guarantee the platform
 * cannot keep. Every attribute is `undefined` unless genuinely true, so nothing is emitted
 * that a screen reader would have to interpret as an explicit negative.
 */
export function webFieldA11y({ describedById, hasError = false, required = false }: WebFieldA11yInput): WebFieldA11y {
  if (!IS_WEB) {
    return {};
  }
  return {
    'aria-invalid': hasError ? true : undefined,
    'aria-describedby': describedById,
    'aria-required': required ? true : undefined,
  };
}
