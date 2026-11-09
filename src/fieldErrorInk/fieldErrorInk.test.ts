import { contrastRatio } from '@dloizides/design-tokens';

import { fieldErrorInk } from './fieldErrorInk';

import type { UiTheme } from '@dloizides/ui-feedback';

const ERROR_SCALE = {
  '100': '#f9d9d5',
  '200': '#f0a99f',
  '300': '#e16a5e',
  '400': '#c9392b',
  '500': '#ae2012',
  '600': '#8f1a0f',
  '700': '#66150d',
};
const DARK_SURFACE = '#1c1f26';
const LIGHT_SURFACE = '#ffffff';

const themeOn = (surface: string, error: Record<string, string>, semanticText?: Record<string, string>): UiTheme =>
  ({ colors: { surface }, palette: { primary: { '500': '#2563eb' } }, semantic: { error }, semanticText }) as unknown as UiTheme;

describe('fieldErrorInk', () => {
  it('keeps error 500 on a light surface, where it already clears 4.5:1', () => {
    expect(fieldErrorInk(themeOn(LIGHT_SURFACE, ERROR_SCALE))).toBe('#ae2012');
  });

  it('lifts the error ink to a step that clears 4.5:1 on a dark surface', () => {
    const ink = fieldErrorInk(themeOn(DARK_SURFACE, ERROR_SCALE));
    expect(ink).toBe('#e16a5e');
    expect(contrastRatio(ink, DARK_SURFACE)).toBeGreaterThanOrEqual(4.5);
  });

  it('falls back to error 500 when the theme defines no other step', () => {
    expect(fieldErrorInk(themeOn(DARK_SURFACE, { '500': '#ae2012' }))).toBe('#ae2012');
  });
});

describe('fieldErrorInk with semanticText', () => {
  const readableOnDark = '#e16a5e';
  const textOnDark = '#ff9c8f';

  it('with semanticText.error present, returns it instead of the scale step', () => {
    const theme = themeOn(DARK_SURFACE, ERROR_SCALE, { error: textOnDark });

    const ink = fieldErrorInk(theme);

    expect(ink).toBe(textOnDark);
  });

  it('with semanticText lacking error, returns the readable scale step', () => {
    const theme = themeOn(DARK_SURFACE, ERROR_SCALE, { success: textOnDark });

    const ink = fieldErrorInk(theme);

    expect(ink).toBe(readableOnDark);
  });

  it('with semanticText.error present, leaves the semantic.error fill scale unchanged', () => {
    const fill = { ...ERROR_SCALE };
    const theme = themeOn(DARK_SURFACE, fill, { error: textOnDark });

    fieldErrorInk(theme);

    expect(theme.semantic.error).toEqual(ERROR_SCALE);
  });
});
