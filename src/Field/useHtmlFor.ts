/**
 * Put a real `for` attribute on a `<label>` rendered through react-native-web.
 *
 * ## Why this is imperative, which looks like a smell and is not
 *
 * The obvious implementation — pass `htmlFor` to `<Text role="label">` — does not work, and
 * fails SILENTLY. react-native-web filters props through an allowlist (`forwardedProps`), and
 * `htmlFor` is not on it, so the prop is dropped somewhere between the component and the DOM
 * with no warning. This is the same family as the hint that never arrives: `accessibilityHint`
 * has no ARIA equivalent, so RN-web discards it, which is why this kit renders hints as
 * sr-only nodes instead of trusting the prop.
 *
 * That failure mode is the reason this is worth the imperative escape. A prop-level test
 * (`expect(label.props.htmlFor).toBe(id)`) passes against a build where the attribute never
 * reaches the browser. Setting it on the node and asserting `container.querySelector('label')
 * .getAttribute('for')` is the only version that can tell the difference.
 *
 * The alternatives were each worse:
 * - **Implicit association** (nesting the control inside the `<label>`) needs no attribute, but
 *   changes the DOM structure of every field in seven portals, and a label wrapping a control
 *   that turns out to be activatable is the classic double-fire bug.
 * - **Rendering the label as a raw DOM element** abandons the RN style pipeline, so the label
 *   would need a second, hand-maintained styling path that could drift from every other label.
 *
 * Native is a no-op: there is no `<label>` and no DOM, and the association there is already
 * carried by the control's `accessibilityLabel`.
 */
import { useEffect, useRef } from 'react';

import { Platform } from 'react-native';

const IS_WEB = Platform.OS === 'web';

/** The sliver of the DOM this touches — no `any`, no global DOM lib dependency. */
interface AttributeHost {
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
  ownerDocument?: { getElementById: (id: string) => unknown } | null;
}

function isAttributeHost(node: unknown): node is AttributeHost {
  return (
    typeof node === 'object' &&
    node !== null &&
    typeof (node as AttributeHost).setAttribute === 'function'
  );
}

/**
 * Returns a ref to attach to the label element. The `for` attribute is set only when the target
 * it names is genuinely in the document.
 *
 * ## Why the existence check is not paranoia
 *
 * `Field` cannot know whether a render-function child actually placed the id it was handed. The
 * difficulty dropdown is the case that proved it: `SelectControl` is a `<div role="button">` and
 * associates itself the other way round, via `aria-labelledby`, so nothing ever received
 * `controlId` — and the label emitted `for="field-control-3"` pointing at nothing. Measured on a
 * real page, that produced a label that LOOKED correct in every audit (`<label>`: yes, `for`:
 * yes) and focused nothing when clicked.
 *
 * Trusting the caller here means the guarantee holds only as long as every call site remembers.
 * Checking the document makes it hold by construction, for both the injected and the
 * render-function paths, without either having to declare which one it is.
 *
 * It runs in an effect rather than in the ref callback because the check needs the whole
 * committed tree present — the control is a LATER sibling than its label, so at ref time the
 * answer would depend on commit ordering rather than on the truth.
 */
export function useHtmlFor(controlId?: string): React.RefObject<unknown> {
  const ref = useRef<unknown>(null);

  useEffect(() => {
    const node = ref.current;

    if (!IS_WEB || !isAttributeHost(node)) return;

    const target = controlId !== undefined && controlId !== '' ? node.ownerDocument?.getElementById(controlId) : null;

    // No target, or a target that is not in the document: emit nothing. A `for` pointing at a
    // missing element passes every "does this page have labels?" check while doing nothing.
    if (target === null || target === undefined) {
      node.removeAttribute('for');
      return;
    }

    node.setAttribute('for', controlId as string);
  }, [controlId]);

  return ref;
}
