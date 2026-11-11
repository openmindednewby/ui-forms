import { FLAG_FALLBACK_FILL, FLAG_PALETTE } from '../data/flagPalette';
import { FLAG_DRAWINGS } from '../data/flagDrawings';
import { FlagShapeKind } from '../FlagShapeKind';
import { drawFlag } from './flagDrawing';
import { FLAG_HEIGHT, FLAG_WIDTH } from './flagPrimitives';

const STAR_POINTS = 10;
const THREE_BANDS = 3;
const KNOWN_OPS = 'HVrcpsj';

describe('drawFlag', () => {
  it('with H and three letters, draws three horizontal bands', () => {
    const shapes = drawFlag('HKRY');

    expect(shapes.map((shape) => [shape.y, shape.fill])).toEqual([[0, FLAG_PALETTE.K], [FLAG_HEIGHT / THREE_BANDS, FLAG_PALETTE.R], [(FLAG_HEIGHT / THREE_BANDS) * 2, FLAG_PALETTE.Y]]);
  });

  it('with a polygon op, joins the coordinates into point pairs', () => {
    const shapes = drawFlag('p0,0,10,7,0,14,B');

    expect(shapes).toEqual([expect.objectContaining({ kind: FlagShapeKind.Polygon, points: '0,0 10,7 0,14', fill: FLAG_PALETTE.B })]);
  });

  it('with a star op, draws a ten-point polygon', () => {
    const [shape] = drawFlag('s10,7,3,W');

    expect(shape?.points?.split(' ')).toHaveLength(STAR_POINTS);
  });

  it('with a disc op, draws a circle of twice the radius', () => {
    const shapes = drawFlag('c5,4,2,R');

    expect(shapes).toEqual([expect.objectContaining({ kind: FlagShapeKind.Circle, x: 5, y: 4, width: 4, fill: FLAG_PALETTE.R })]);
  });

  it('with a Union Jack op over the whole flag, starts with a full navy field', () => {
    const [field] = drawFlag(`j0,0,${FLAG_WIDTH},${FLAG_HEIGHT}`);

    expect(field).toMatchObject({ width: FLAG_WIDTH, height: FLAG_HEIGHT, fill: FLAG_PALETTE.N });
  });

  it('with an unknown colour letter, fills with the generic grey', () => {
    const shapes = drawFlag('r0,0,5,5,Z');

    expect(shapes[0]?.fill).toBe(FLAG_FALLBACK_FILL);
  });

  it('with every shipped drawing, uses only known ops and palette letters', () => {
    const isBad = (drawing: string): boolean => drawing.split(' ').some((op) => !KNOWN_OPS.includes(op.charAt(0)))
      || drawFlag(drawing).some((shape) => shape.fill === FLAG_FALLBACK_FILL || Number.isNaN(shape.x) || String(shape.points).includes('NaN'));

    const bad = Object.entries(FLAG_DRAWINGS).filter(([, drawing]) => isBad(String(drawing)));

    expect(bad).toEqual([]);
  });
});
