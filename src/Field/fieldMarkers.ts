/**
 * Required / optional markers, per the shared forms contract
 * (`…/wwwroot/shared/FORMS.md` → "Required and optional markers").
 *
 * The contract says the two markers are MUTUALLY EXCLUSIVE — a field is required or optional, never
 * annotated as both — and that you mark the MINORITY: on a mostly-required form mark the optional
 * fields, on a mostly-optional form mark the required ones. Asterisking twelve of thirteen fields
 * is noise that trains the eye to ignore the marker.
 *
 * Exclusivity is enforced here rather than in the type system so that a caller spreading a props
 * object (`<Field {...fieldProps} />`, where both flags may be computed) still gets a defined,
 * single-marker result instead of a compile error it cannot act on.
 *
 * Precedence when a caller asks for BOTH: `required` wins. That is the safe failure direction —
 * showing "optional" on a field the server will reject sends the user into a failed submit, while
 * showing "required" on a genuinely optional field costs, at worst, an unnecessary keystroke.
 */

/** Which marker a field label carries. Exactly one, never both. */
export type FieldMarker = 'none' | 'required' | 'optional';

/**
 * The English fallback for the optional marker's text.
 *
 * `@dloizides/ui-forms` contains NO i18n runtime by design — aml-v2 uses `@dloizides/i18n` with
 * positional `{0}` params while the other six apps use i18next `{{p1}}`, and nothing bridges them,
 * so all user-visible copy arrives as pre-localized props. This constant exists ONLY so a
 * single-locale app can adopt `optional` in one line. It is exported precisely so it is greppable:
 * **a localized app MUST pass `optionalLabel`.** The required marker needs no such escape — `*` is
 * a glyph, not copy.
 */
export const DEFAULT_OPTIONAL_LABEL = '(optional)';

/**
 * Resolve the two boolean flags to the single marker actually rendered.
 * `required` beats `optional`; neither flag yields `none`.
 */
export function resolveFieldMarker(required: boolean, optional: boolean): FieldMarker {
  if (required) return 'required';
  if (optional) return 'optional';
  return 'none';
}
