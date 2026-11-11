import { FLAG_FALLBACK_FILL, FLAG_PALETTE } from '../data/flagPalette';
import { FLAG_SPECS } from '../data/flagSpecs';
import { FlagShapeKind } from '../FlagShapeKind';

export const FLAG_WIDTH = 20;
export const FLAG_HEIGHT = 14;
const CROSS_X = 5.5;
const CROSS_Y = 5.5;
const CROSS_BAR = 3;
const INNER_INSET = 1;
const INNER_BAR = 1;
const PLUS_ARM_X = 8.5;
const PLUS_ARM_Y = 3;
const PLUS_SPAN_X = 5;
const PLUS_SPAN = 10;
const PLUS_ARM_LEN = 8;
const DISC_DIAMETER = 8;
const HALF = 2;

export interface FlagShape {
  readonly kind: FlagShapeKind;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly fill: string;
}

function rect(x: number, y: number, size: readonly [number, number], fill: string): FlagShape {
  return { kind: FlagShapeKind.Rect, x, y, width: size[0], height: size[1], fill };
}

function field(fill: string): FlagShape {
  return rect(0, 0, [FLAG_WIDTH, FLAG_HEIGHT], fill);
}

function stripes(fills: readonly string[], vertical: boolean): FlagShape[] {
  const step = (vertical ? FLAG_WIDTH : FLAG_HEIGHT) / fills.length;
  return fills.map((fill, i) => (vertical ? rect(i * step, 0, [step, FLAG_HEIGHT], fill) : rect(0, i * step, [FLAG_WIDTH, step], fill)));
}

function nordic([ground = FLAG_FALLBACK_FILL, cross = FLAG_FALLBACK_FILL, inner]: readonly string[]): FlagShape[] {
  const shapes = [field(ground), rect(CROSS_X, 0, [CROSS_BAR, FLAG_HEIGHT], cross), rect(0, CROSS_Y, [FLAG_WIDTH, CROSS_BAR], cross)];
  if (inner === undefined) return shapes;
  return [...shapes, rect(CROSS_X + INNER_INSET, 0, [INNER_BAR, FLAG_HEIGHT], inner), rect(0, CROSS_Y + INNER_INSET, [FLAG_WIDTH, INNER_BAR], inner)];
}

function centredCross([ground = FLAG_FALLBACK_FILL, cross = FLAG_FALLBACK_FILL]: readonly string[]): FlagShape[] {
  return [field(ground), rect(PLUS_ARM_X, PLUS_ARM_Y, [CROSS_BAR, PLUS_ARM_LEN], cross), rect(PLUS_SPAN_X, CROSS_Y, [PLUS_SPAN, CROSS_BAR], cross)];
}

function disc([ground = FLAG_FALLBACK_FILL, mark = FLAG_FALLBACK_FILL]: readonly string[]): FlagShape[] {
  const circle: FlagShape = { kind: FlagShapeKind.Circle, x: FLAG_WIDTH / HALF, y: FLAG_HEIGHT / HALF, width: DISC_DIAMETER, height: DISC_DIAMETER, fill: mark };
  return [field(ground), circle];
}

/** True when the country has no drawn flag and shows the generic one. */
export function isFallbackFlag(code: string): boolean {
  return FLAG_SPECS[code.toUpperCase()] === undefined;
}

/** The shapes that draw the flag of a 2-letter code; a generic flag for a code with no drawn flag. */
export function flagShapes(code: string): FlagShape[] {
  const spec = FLAG_SPECS[code.toUpperCase()];
  if (spec === undefined) return [field(FLAG_FALLBACK_FILL)];
  const [layout = '', letters = ''] = spec.split(' ');
  const fills = Array.from(letters, (letter) => FLAG_PALETTE[letter] ?? FLAG_FALLBACK_FILL);
  if (layout === 'V') return stripes(fills, true);
  if (layout === 'N') return nordic(fills);
  if (layout === 'P') return centredCross(fills);
  if (layout === 'D') return disc(fills);
  return stripes(fills, false);
}
