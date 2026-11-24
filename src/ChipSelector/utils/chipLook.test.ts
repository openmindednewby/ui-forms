import { chipSizeStyles } from '../components/chipSizeStyles';
import { isCompactSize } from '../ChipSize';

import { chipRowGap, chipSizeLook } from './chipLook';

describe('chipRowGap', () => {
  it('with a dense size, sets the row gap to zero', () => {
    const size = 'dense';

    const style = chipRowGap(size);

    expect(style).toEqual({ rowGap: 0 });
  });

  it('with the default or compact size, adds no row override', () => {
    const sizes = ['default', 'compact'] as const;

    const styles = sizes.map(chipRowGap);

    expect(styles).toEqual([undefined, undefined]);
  });
});

describe('chipSizeLook', () => {
  it('with a dense size, draws the compact pill inside the 44 px hit box', () => {
    const size = 'dense';

    const look = chipSizeLook(size);

    expect(look).toEqual({ hitBox: chipSizeStyles.compactHitBox, visual: chipSizeStyles.compactVisual, text: chipSizeStyles.compactText });
  });
});

describe('isCompactSize', () => {
  it('with each size, is true for compact and dense only', () => {
    const sizes = ['default', 'compact', 'dense'] as const;

    const flags = sizes.map(isCompactSize);

    expect(flags).toEqual([false, true, true]);
  });
});
