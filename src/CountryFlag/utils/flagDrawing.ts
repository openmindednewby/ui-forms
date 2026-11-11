import { FLAG_FALLBACK_FILL, FLAG_PALETTE } from '../data/flagPalette';
import { circle, polygon, rect, star, stripes, unionJack, type FlagShape } from './flagPrimitives';

const OP_HORIZONTAL = 'H';
const OP_VERTICAL = 'V';
const OP_RECT = 'r';
const OP_CIRCLE = 'c';
const OP_POLYGON = 'p';
const OP_STAR = 's';
const OP_JACK = 'j';

function fillOf(letter: string | undefined): string {
  return FLAG_PALETTE[letter ?? ''] ?? FLAG_FALLBACK_FILL;
}

function numbers(values: readonly string[]): number[] {
  return values.map(Number);
}

function drawOp(op: string): FlagShape[] {
  const kind = op.charAt(0);
  const body = op.slice(1);
  if (kind === OP_HORIZONTAL || kind === OP_VERTICAL) return stripes(Array.from(body, fillOf), kind === OP_VERTICAL);
  const args = body.split(',');
  const [a = 0, b = 0, c = 0, d = 0] = numbers(args);
  if (kind === OP_JACK) return unionJack([a, b, c, d], [fillOf('N'), fillOf('W'), fillOf('R')]);
  const fill = fillOf(args[args.length - 1]);
  if (kind === OP_RECT) return [rect(a, b, [c, d], fill)];
  if (kind === OP_CIRCLE) return [circle(a, b, c, fill)];
  if (kind === OP_STAR) return [star(a, b, c, fill)];
  if (kind === OP_POLYGON) return [polygon(numbers(args.slice(0, -1)), fill)];
  return [];
}

/** The shapes of a drawing of space-separated ops: H/V stripes, r rect, c disc, s star, p polygon, j Union Jack. */
export function drawFlag(drawing: string): FlagShape[] {
  return drawing.split(' ').filter((op) => op !== '').flatMap(drawOp);
}
