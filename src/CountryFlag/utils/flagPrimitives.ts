import { FlagShapeKind } from '../FlagShapeKind';

export const FLAG_WIDTH = 20;
export const FLAG_HEIGHT = 14;

export interface FlagShape {
  readonly kind: FlagShapeKind;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly fill: string;
  readonly points?: string;
}

const HALF = 2;
const STAR_TIPS = 5;
const STAR_INNER = 0.4;
const DEGREES_HALF_TURN = 180;
const STAR_START = -90;
const DECIMALS = 100;
const JACK_DIAGONAL = 0.12;
const JACK_RED_DIAGONAL = 0.05;
const JACK_WHITE_CROSS = 3;
const JACK_RED_CROSS = 5;

export function rect(x: number, y: number, size: readonly [number, number], fill: string): FlagShape {
  return { kind: FlagShapeKind.Rect, x, y, width: size[0], height: size[1], fill };
}

export function field(fill: string): FlagShape {
  return rect(0, 0, [FLAG_WIDTH, FLAG_HEIGHT], fill);
}

export function circle(cx: number, cy: number, radius: number, fill: string): FlagShape {
  return { kind: FlagShapeKind.Circle, x: cx, y: cy, width: radius * HALF, height: radius * HALF, fill };
}

export function polygon(coords: readonly number[], fill: string): FlagShape {
  const pairs: string[] = [];
  for (let i = 0; i + 1 < coords.length; i += HALF) pairs.push(`${coords[i]},${coords[i + 1]}`);
  return { kind: FlagShapeKind.Polygon, x: 0, y: 0, width: 0, height: 0, fill, points: pairs.join(' ') };
}

export function stripes(fills: readonly string[], vertical: boolean): FlagShape[] {
  const step = (vertical ? FLAG_WIDTH : FLAG_HEIGHT) / fills.length;
  return fills.map((fill, i) => (vertical ? rect(i * step, 0, [step, FLAG_HEIGHT], fill) : rect(0, i * step, [FLAG_WIDTH, step], fill)));
}

function round(value: number): number {
  return Math.round(value * DECIMALS) / DECIMALS;
}

export function star(cx: number, cy: number, radius: number, fill: string): FlagShape {
  const coords: number[] = [];
  for (let i = 0; i < STAR_TIPS * HALF; i++) {
    const r = i % HALF === 0 ? radius : radius * STAR_INNER;
    const angle = ((STAR_START + (i * DEGREES_HALF_TURN) / STAR_TIPS) * Math.PI) / DEGREES_HALF_TURN;
    coords.push(round(cx + r * Math.cos(angle)), round(cy + r * Math.sin(angle)));
  }
  return polygon(coords, fill);
}

function diagonals(box: readonly [number, number, number, number], share: number, fill: string): FlagShape[] {
  const [x, y, w, h] = box;
  const dx = w * share;
  const dy = h * share;
  const right = x + w;
  const bottom = y + h;
  return [
    polygon([x, y, x + dx, y, right, bottom - dy, right, bottom, right - dx, bottom, x, y + dy], fill),
    polygon([right, y, right - dx, y, x, bottom - dy, x, bottom, x + dx, bottom, right, y + dy], fill),
  ];
}

function cross(box: readonly [number, number, number, number], bar: number, fill: string): FlagShape[] {
  const [x, y, w, h] = box;
  return [rect(x + (w - bar) / HALF, y, [bar, h], fill), rect(x, y + (h - bar) / HALF, [w, bar], fill)];
}

/** The Union Jack drawn inside a box (x, y, width, height). */
export function unionJack(box: readonly [number, number, number, number], colors: readonly [string, string, string]): FlagShape[] {
  const [navy, white, red] = colors;
  const [x, y, w, h] = box;
  return [
    rect(x, y, [w, h], navy),
    ...diagonals(box, JACK_DIAGONAL, white),
    ...diagonals(box, JACK_RED_DIAGONAL, red),
    ...cross(box, h / JACK_WHITE_CROSS, white),
    ...cross(box, h / JACK_RED_CROSS, red),
  ];
}
