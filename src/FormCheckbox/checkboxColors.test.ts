import { AA_NON_TEXT_RATIO, contrastRatio } from '@dloizides/design-tokens';

import { checkboxBoxColors, checkboxTickColor } from './checkboxColors';

const colors = { border: '#e8e1d2', textSecondary: '#6b6455' };
const brand = '#c2410c';

describe('checkboxBoxColors', () => {
  it('when unchecked, borders the box with textSecondary, not the low-contrast border token', () => {
    const result = checkboxBoxColors(colors, brand, false);

    expect(result).toEqual({ backgroundColor: 'transparent', borderColor: '#6b6455' });
  });

  it('when checked, fills and borders the box with the brand colour', () => {
    const result = checkboxBoxColors(colors, brand, true);

    expect(result).toEqual({ backgroundColor: '#c2410c', borderColor: '#c2410c' });
  });
});

describe('checkboxTickColor', () => {
  it('on the light sky brand rgb(56,189,248), picks the dark ink at >= 3:1', () => {
    const skyBrand = '#38bdf8';

    const tick = checkboxTickColor(skyBrand);

    expect(tick).toBe('#03121f');
    expect(contrastRatio(tick, skyBrand)).toBeGreaterThanOrEqual(AA_NON_TEXT_RATIO);
  });

  it('on the dark teal brand #0e5a7e, picks the white ink at >= 3:1', () => {
    const tealBrand = '#0e5a7e';

    const tick = checkboxTickColor(tealBrand);

    expect(tick).toBe('#ffffff');
    expect(contrastRatio(tick, tealBrand)).toBeGreaterThanOrEqual(AA_NON_TEXT_RATIO);
  });
});
