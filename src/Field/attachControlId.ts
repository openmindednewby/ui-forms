/**
 * Give a `Field`'s plain-node child the `id` its `<label for>` points at.
 *
 * ## Why cloning rather than asking the caller
 *
 * `Field`'s documented, overwhelmingly common shape is a plain child:
 *
 * ```tsx
 * <Field label={FM('guides.titleLabel')}>
 *   <ThemedTextInput … />
 * </Field>
 * ```
 *
 * There is no seam in that shape to hand an id through — which is exactly why label association
 * was never wired and why a live audit found 0 controls with an `id` across an entire CMS page.
 * The alternatives were worse: making every call site switch to the render-function form is a
 * fleet-wide migration that fails open (any missed call site silently keeps the old behaviour),
 * and wrapping the control inside the `<label>` element for implicit association breaks down on
 * the controls that are not native form elements — a `SelectControl` trigger is a
 * `<div role="button">`, and nesting it in a `<label>` invites a double-fire on click.
 *
 * So the id is injected here, one level deep, and only when it is safe to do so.
 *
 * ## What "safe" means
 *
 * - Only a single valid element is touched. Arrays, strings and `null` are returned untouched,
 *   because there is no unambiguous "the control" to point a label at. A **fragment** is excluded
 *   explicitly: `React.isValidElement` says yes to one, but a fragment accepts no props beyond
 *   `key`, so cloning an `id` onto it both warns in development and attaches nothing.
 * - A child that already carries an `id` keeps it. The caller was explicit; a label that silently
 *   retargets someone else's id is worse than no label.
 * - The returned `controlId` is what the label should actually use: `undefined` when nothing was
 *   attached, so `FieldLabel` emits no dangling `htmlFor` pointing at an element that does not
 *   exist. A `<label for>` aimed at nothing is not a smaller bug than no label — it is a lie that
 *   passes a "has a label" check.
 */
import React from 'react';

/** Props any RN component may carry that we read or write here. `id` is RN ≥0.71 → DOM `id`. */
interface IdentifiableProps {
  id?: string;
  nativeID?: string;
  /** The kit's own contract for `aria-describedby`, honoured by `ThemedTextInput`/`ChipSelector`. */
  describedById?: string;
}

export interface AttachedControl {
  /** The child, cloned with the field wiring when it could be attached; otherwise the original. */
  node: React.ReactNode;
  /** The id the label should target, or `undefined` when nothing could safely receive one. */
  controlId?: string;
}

/**
 * Returns the child wired to its `Field`, plus the id the label should point at.
 *
 * `candidateId` is only USED when it can be attached — the caller must not assume it was.
 *
 * `describedById` is injected too, under the kit's own `describedById` prop name, so the hint and
 * error lines are announced by a plain child exactly as they are by a render-function child. That
 * they were NOT was a real gap: a YouTube field made read-only with an on-screen sentence saying
 * why gave a screen-reader user the read-only state and none of the explanation.
 *
 * A child that is not a kit control simply ignores the prop; if it needs different wiring, use
 * the render-function form, which hands over the ids and lets the caller place them.
 */
export function attachControlId(
  child: React.ReactNode,
  candidateId: string,
  describedById?: string,
): AttachedControl {
  if (!React.isValidElement(child) || child.type === React.Fragment) {
    return { node: child };
  }

  const props = child.props as IdentifiableProps;
  const existing = props.id ?? props.nativeID;
  const element = child as React.ReactElement<IdentifiableProps>;

  // An explicit id from the caller is never overwritten — but the description wiring still goes
  // on, because that is the field's to give and the caller expressed no opinion about it.
  const controlId = existing !== undefined && existing !== '' ? existing : candidateId;
  const injected: IdentifiableProps = { id: controlId };

  if (describedById !== undefined && props.describedById === undefined) {
    injected.describedById = describedById;
  }

  return { node: React.cloneElement(element, injected), controlId };
}
