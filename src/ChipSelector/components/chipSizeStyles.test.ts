import { CHIP_HIT_SLOP } from '../constants';

import { chipSizeStyles } from './chipSizeStyles';

const MIN_TARGET_PX = 44;
const COMPACT_VISUAL_PX = 28;

describe('chipSizeStyles', () => {
  it('with a compact chip, keeps a hit box of at least 44x44', () => {
    const style = chipSizeStyles.compactHitBox;

    const box = { minWidth: Number(style.minWidth), minHeight: Number(style.minHeight) };

    expect(box.minWidth).toBeGreaterThanOrEqual(MIN_TARGET_PX);
    expect(box.minHeight).toBeGreaterThanOrEqual(MIN_TARGET_PX);
  });

  it('with a compact chip, draws a 28 px tall pill from padding, line height and border', () => {
    const box = chipSizeStyles.compactVisual;
    const text = chipSizeStyles.compactText;

    const height = Number(box.paddingVertical) * 2 + Number(text.lineHeight) + Number(box.borderWidth) * 2;

    expect(height).toBe(COMPACT_VISUAL_PX);
  });

  it('with a compact chip, uses padding 4/10 and a 12/600 label', () => {
    const box = chipSizeStyles.compactVisual;
    const text = chipSizeStyles.compactText;

    const metrics = { v: box.paddingVertical, h: box.paddingHorizontal, size: text.fontSize, weight: text.fontWeight };

    expect(metrics).toEqual({ v: 4, h: 10, size: 12, weight: '600' });
  });

  it('with a compact chip on native, the hit slop still reaches 44 px tall', () => {
    const visual = COMPACT_VISUAL_PX;

    const reach = visual + CHIP_HIT_SLOP.top + CHIP_HIT_SLOP.bottom;

    expect(reach).toBeGreaterThanOrEqual(MIN_TARGET_PX);
  });
});
