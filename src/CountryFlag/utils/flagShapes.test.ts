import { COUNTRIES } from '../../countries/countriesData';
import { FLAG_FALLBACK_FILL, FLAG_PALETTE } from '../data/flagPalette';
import { FLAG_SPECS } from '../data/flagSpecs';
import { FlagShapeKind } from '../FlagShapeKind';
import { FLAG_HEIGHT, flagShapes, isFallbackFlag } from './flagShapes';

const THREE_BANDS = 3;
const NORDIC_WITH_INNER = 5;

describe('flagShapes', () => {
  it('with DE, draws black, red and gold bands of equal height', () => {
    const shapes = flagShapes('de');

    expect(shapes.map((shape) => shape.fill)).toEqual([FLAG_PALETTE.K, FLAG_PALETTE.R, FLAG_PALETTE.Y]);
    expect(shapes.every((shape) => shape.height === FLAG_HEIGHT / THREE_BANDS)).toBe(true);
  });

  it('with JP, draws a red disc on white', () => {
    const shapes = flagShapes('JP');

    expect(shapes.map((shape) => [shape.kind, shape.fill])).toEqual([[FlagShapeKind.Rect, FLAG_PALETTE.W], [FlagShapeKind.Circle, FLAG_PALETTE.R]]);
  });

  it('with IS, draws the field, the cross and the inner cross', () => {
    const shapes = flagShapes('IS');

    expect(shapes).toHaveLength(NORDIC_WITH_INNER);
  });

  it('with a country that has no drawn flag, draws the generic flag', () => {
    const shapes = flagShapes('GB');

    expect(shapes.map((shape) => shape.fill)).toEqual([FLAG_FALLBACK_FILL]);
    expect(isFallbackFlag('GB')).toBe(true);
  });

  it('with every shipped country, draws at least one shape', () => {
    const empty = COUNTRIES.filter((country) => flagShapes(country.code).length === 0);

    expect(empty).toEqual([]);
  });

  it('with every drawn spec, uses only shipped codes and known palette letters', () => {
    const codes = new Set(COUNTRIES.map((country) => country.code));

    const bad = Object.entries(FLAG_SPECS).filter(([code, spec]) => !codes.has(code) || Array.from(String(spec).split(' ')[1]).some((letter) => FLAG_PALETTE[letter] === undefined));

    expect(bad).toEqual([]);
  });
});
