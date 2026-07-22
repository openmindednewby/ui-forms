/**
 * `FieldLabel` — the label row of a `Field`: the label text plus at most one marker.
 *
 * Split out of `Field` so the marker rules and the two label voices stay readable, and so `Field`
 * itself remains an orchestrator small enough to review.
 *
 * ## Why this is a real `<label>` on web
 *
 * It used to render a plain `<Text>`, i.e. a `<div>`. Controls still ANNOUNCED correctly, because
 * every one of them carries an `accessibilityLabel` → `aria-label`, so an audit of screen-reader
 * naming came back clean and the gap looked like it did not exist. What was missing was the other
 * half of a label: **clicking the words did not focus the field**. A page measured live had 0
 * `<label>` elements, 0 `label[for]` and 0 controls with an `id` — every field silently throwing
 * away a free doubling of its own hit area, on top of already being under the target-size floor.
 *
 * `role="label"` is react-native-web's documented escape to a real `<label>` element (it is
 * special-cased ahead of the ARIA role map, since `label` is not an ARIA role). The `for`
 * attribute is set on the node itself — see `useHtmlFor` for why the obvious `htmlFor` prop is
 * silently discarded. On native both are inert: RN has no `<label>`, and the association there
 * is already carried by `accessibilityLabel`.
 *
 * The control keeps its `aria-label`, which still WINS for the accessible name — so this adds
 * click-to-focus without changing a single screen-reader announcement.
 */
import React from 'react';

import { Platform, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { useHtmlFor } from './useHtmlFor';

import type { FieldMarker } from './fieldMarkers';

const IS_WEB = Platform.OS === 'web';

/**
 * `label` is not an ARIA role, so RN's `role` union does not admit it; react-native-web
 * special-cases it into a real `<label>` element. Cast at the spread site through the host's own
 * props rather than through `any`.
 */
interface WebLabelProps {
  role?: 'label';
}

export interface FieldLabelProps {
  label: string;
  marker: FieldMarker;
  /** Pre-localized text for the optional marker. Ignored unless `marker` is `optional`. */
  optionalLabel: string;
  /**
   * `id` of the control this label names. Emits `<label for>` on web so clicking the label text
   * focuses the field. Omitted when the field wraps a control that cannot be labelled that way
   * (a `<div role="button">` select trigger), which uses `aria-labelledby` instead.
   */
  controlId?: string;
  /** `id` given to the label element itself, so a non-labelable control can point back at it. */
  labelId?: string;
  /** Composed style chain: base → variant → caller's `labelStyle` (applied last). */
  style: StyleProp<TextStyle>;
  requiredMarkStyle: StyleProp<TextStyle>;
  optionalMarkStyle: StyleProp<TextStyle>;
}

export function FieldLabel({
  label,
  marker,
  optionalLabel,
  controlId,
  labelId,
  style,
  requiredMarkStyle,
  optionalMarkStyle,
}: FieldLabelProps): React.ReactElement {
  const webProps = (IS_WEB ? { role: 'label' } : {}) as WebLabelProps as TextProps;
  const labelRef = useHtmlFor(controlId);

  return (
    <Text id={labelId} ref={labelRef as React.Ref<Text>} style={style} {...webProps}>
      {label}{' '}
      {marker === 'required' ? (
        // The asterisk is decorative — the control's `aria-required` conveys "required" to
        // assistive tech, so a screen reader says "required" instead of "star".
        <Text aria-hidden accessibilityElementsHidden importantForAccessibility="no" style={requiredMarkStyle}>
          *
        </Text>
      ) : null}
      {marker === 'optional' && optionalLabel !== '' ? (
        // Also decorative: "optional" is the ABSENCE of `aria-required`, which assistive tech
        // already conveys. Rendering it to a screen reader would double-announce the same fact.
        <Text aria-hidden accessibilityElementsHidden importantForAccessibility="no" style={optionalMarkStyle}>
          {optionalLabel}
        </Text>
      ) : null}
    </Text>
  );
}

export default FieldLabel;
