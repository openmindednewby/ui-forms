/**
 * `FieldLabel` — the label row of a `Field`: the label text plus at most one marker.
 *
 * Split out of `Field` so the marker rules and the two label voices stay readable, and so `Field`
 * itself remains an orchestrator small enough to review.
 */
import React from 'react';

import { Text, type StyleProp, type TextStyle } from 'react-native';

import type { FieldMarker } from './fieldMarkers';

export interface FieldLabelProps {
  label: string;
  marker: FieldMarker;
  /** Pre-localized text for the optional marker. Ignored unless `marker` is `optional`. */
  optionalLabel: string;
  /** Composed style chain: base → variant → caller's `labelStyle` (applied last). */
  style: StyleProp<TextStyle>;
  requiredMarkStyle: StyleProp<TextStyle>;
  optionalMarkStyle: StyleProp<TextStyle>;
}

export function FieldLabel({
  label,
  marker,
  optionalLabel,
  style,
  requiredMarkStyle,
  optionalMarkStyle,
}: FieldLabelProps): React.ReactElement {
  return (
    <Text style={style}>
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
