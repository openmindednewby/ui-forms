import { FLAG_FALLBACK_FILL, FLAG_PALETTE } from '../data/flagPalette';
import { FLAG_DRAWINGS } from '../data/flagDrawings';
import { FLAG_SPECS } from '../data/flagSpecs';
import { FlagShapeKind } from '../FlagShapeKind';
import { drawFlag } from './flagDrawing';
import { FLAG_HEIGHT, FLAG_WIDTH, field, rect, stripes, type FlagShape } from './flagPrimitives';

export { FLAG_HEIGHT, FLAG_WIDTH } from './flagPrimitives';
export type { FlagShape } from './flagPrimitives';

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
  const upper = code.toUpperCase();
  return FLAG_SPECS[upper] === undefined && FLAG_DRAWINGS[upper] === undefined;
}

/** The shapes that draw the flag of a 2-letter code; a generic flag for a code with no drawn flag. */
export function flagShapes(code: string): FlagShape[] {
  const upper = code.toUpperCase();
  const drawing = FLAG_DRAWINGS[upper];
  if (drawing !== undefined) return drawFlag(drawing);
  const spec = FLAG_SPECS[upper];
  if (spec === undefined) return [field(FLAG_FALLBACK_FILL)];
  const [layout = '', letters = ''] = spec.split(' ');
  const fills = Array.from(letters, (letter) => FLAG_PALETTE[letter] ?? FLAG_FALLBACK_FILL);
  if (layout === 'V') return stripes(fills, true);
  if (layout === 'N') return nordic(fills);
  if (layout === 'P') return centredCross(fills);
  if (layout === 'D') return disc(fills);
  return stripes(fills, false);
}
