import { chipStyles } from './chipStyles';

const MIN_TARGET_PX = 44;

describe('chipStyles', () => {
  it('with a solid chip, has a 44x44 minimum box', () => {
    const style = chipStyles.chip;

    const box = { minWidth: style.minWidth, minHeight: style.minHeight };

    expect(box).toEqual({ minWidth: MIN_TARGET_PX, minHeight: MIN_TARGET_PX });
  });

  it('with an outline chip, has a 44x44 minimum box', () => {
    const style = chipStyles.chipOutline;

    const box = { minWidth: style.minWidth, minHeight: style.minHeight };

    expect(box).toEqual({ minWidth: MIN_TARGET_PX, minHeight: MIN_TARGET_PX });
  });
});
