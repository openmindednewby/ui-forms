import { chipBoxFill, chipFill, chipRowGap, chipSizeLook, isDarkColor } from './chipLook';

const rest = { backgroundColor: 'transparent', textColor: '#111111' };

describe('chipSizeLook', () => {
  it('with fit, the box drops the 44 px minimum to 24', () => {
    const look = chipSizeLook('fit');

    expect(look.hitBox).toMatchObject({ minHeight: 24, minWidth: 24 });
  });

  it('with tap, the label is 13 px on a 44 px box', () => {
    const look = chipSizeLook('tap');

    expect({ box: look.hitBox, text: look.text }).toMatchObject({ box: { minHeight: 44 }, text: { fontSize: 13 } });
  });
});

describe('chipRowGap', () => {
  it('with fit, uses a 6 px gutter', () => {
    const gap = chipRowGap('fit');

    expect(gap).toEqual({ gap: 6 });
  });
});

describe('chipBoxFill', () => {
  it('with tap, puts the fill on the box; with compact, adds none', () => {
    const fills = [chipBoxFill('tap', '#0e5a7e'), chipBoxFill('compact', '#0e5a7e')];

    expect(fills).toEqual([{ backgroundColor: '#0e5a7e' }, undefined]);
  });
});

describe('chipFill', () => {
  it('with a dark selected fill, uses the on-dark ink for label and check', () => {
    const fill = chipFill({ selected: true, selectedFill: '#0e5a7e', ink: '#111111', onDarkInk: '#ffffff', rest });

    expect(fill).toEqual({ backgroundColor: '#0e5a7e', textColor: '#ffffff', checkColor: '#ffffff' });
  });

  it('with a light selected fill, keeps the strong ink', () => {
    const fill = chipFill({ selected: true, selectedFill: '#e6f0f5', ink: '#111111', onDarkInk: '#ffffff', rest });

    expect(fill.textColor).toBe('#111111');
  });
});

describe('isDarkColor', () => {
  it('with rgb(), hex and an unparsable value, reads dark, light and light', () => {
    const reads = [isDarkColor('rgb(14, 90, 126)'), isDarkColor('#f4f6fa'), isDarkColor('var(--x)')];

    expect(reads).toEqual([true, false, false]);
  });
});
