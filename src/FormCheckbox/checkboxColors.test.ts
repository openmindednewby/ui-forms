import { checkboxBoxColors } from './checkboxColors';

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
