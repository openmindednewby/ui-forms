import { controlBorderOf } from './controlBorder';

const PRIMARY = { '100': '#111111', '500': '#111111', '700': '#111111' };

describe('controlBorderOf', () => {
  it('with a controlBorder palette slot, returns its main step', () => {
    const theme = { colors: { border: '#7d8799' }, palette: { primary: PRIMARY, controlBorder: { '100': '#e1e5ec', '500': '#e1e5ec', '700': '#e1e5ec' } } };

    const border = controlBorderOf(theme as never);

    expect(border).toBe('#e1e5ec');
  });

  it('without a controlBorder palette slot, falls back to the theme border', () => {
    const theme = { colors: { border: '#7d8799' }, palette: { primary: PRIMARY } };

    const border = controlBorderOf(theme as never);

    expect(border).toBe('#7d8799');
  });
});
