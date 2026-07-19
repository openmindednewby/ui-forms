import { StyleSheet, type TextStyle } from 'react-native';

import { resolveLabelVariantStyle } from './labelVariants';

/** Flatten to the concrete metrics, since StyleSheet.create returns opaque registered styles. */
function metrics(style: TextStyle): TextStyle {
  return StyleSheet.flatten(style);
}

describe('resolveLabelVariantStyle', () => {
  it('defaults to the FIELD voice — 13/600, the historical metrics', () => {
    // Load-bearing: this is what every existing consumer renders today. Changing it moves pixels
    // in seven apps.
    const style = metrics(resolveLabelVariantStyle());
    expect(style.fontSize).toBe(13);
    expect(style.fontWeight).toBe('600');
    expect(style.textTransform).toBeUndefined();
  });

  it('resolves an explicit field variant to the same metrics as the default', () => {
    expect(metrics(resolveLabelVariantStyle('field'))).toEqual(metrics(resolveLabelVariantStyle()));
  });

  it('resolves the CONTROL voice to 11/700 uppercase — the metrics ui-tables forked', () => {
    const style = metrics(resolveLabelVariantStyle('control'));
    expect(style.fontSize).toBe(11);
    expect(style.fontWeight).toBe('700');
    expect(style.textTransform).toBe('uppercase');
    expect(style.letterSpacing).toBe(0.4);
  });

  it('keeps the two voices genuinely distinct', () => {
    // A "variant" that resolved to the same style would be decorative API.
    expect(metrics(resolveLabelVariantStyle('control'))).not.toEqual(metrics(resolveLabelVariantStyle('field')));
  });
});
