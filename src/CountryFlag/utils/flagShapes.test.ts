import { COUNTRIES } from '../../countries/countriesData';
import { FLAG_FALLBACK_FILL, FLAG_PALETTE } from '../data/flagPalette';
import { FLAG_DRAWINGS } from '../data/flagDrawings';
import { FLAG_SPECS } from '../data/flagSpecs';
import { FlagShapeKind } from '../FlagShapeKind';
import { FLAG_HEIGHT, FLAG_WIDTH, flagShapes, isFallbackFlag } from './flagShapes';

const THREE_BANDS = 3;
const NORDIC_WITH_INNER = 5;
const SHARED_REAL_FLAGS = new Set([
  'AU,HM',
  'BL,FR,GF,GP,MF,MQ,NC,PF,PM,RE,TF,WF,YT',
  'BV,NO,SJ',
  'ID,MC',
  'UM,US',
]);

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

  it('with an unknown code, draws the generic flag', () => {
    const shapes = flagShapes('XX');

    expect(shapes.map((shape) => shape.fill)).toEqual([FLAG_FALLBACK_FILL]);
    expect(isFallbackFlag('XX')).toBe(true);
  });

  it('with every code in countriesData, has a drawn flag', () => {
    const generic = COUNTRIES.filter((country) => isFallbackFlag(country.code)).map((country) => country.code);

    expect(generic).toEqual([]);
  });

  it('with GB, starts with the navy field of the Union Jack', () => {
    const shapes = flagShapes('GB');

    expect(shapes[0]).toMatchObject({ kind: FlagShapeKind.Rect, fill: FLAG_PALETTE.N, width: FLAG_WIDTH, height: FLAG_HEIGHT });
  });

  it('with every drawing, uses a shipped code that has no simple spec too', () => {
    const codes = new Set(COUNTRIES.map((country) => country.code));

    const bad = Object.keys(FLAG_DRAWINGS).filter((code) => !codes.has(code) || FLAG_SPECS[code] !== undefined);

    expect(bad).toEqual([]);
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

  it('with every shipped country, no two codes draw the same flag unless they share it in real life', () => {
    const byDrawing = new Map<string, string[]>();
    COUNTRIES.forEach((country) => {
      const key = JSON.stringify(flagShapes(country.code));
      byDrawing.set(key, [...(byDrawing.get(key) ?? []), country.code]);
    });

    const twins = [...byDrawing.values()].filter((codes) => codes.length > 1).map((codes) => [...codes].sort().join(','));

    expect(twins.filter((group) => !SHARED_REAL_FLAGS.has(group))).toEqual([]);
  });
});
