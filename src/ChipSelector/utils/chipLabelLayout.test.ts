import { ChipLabelWrap } from '../ChipLabelWrap';

import { chipLabelLayout } from './chipLabelLayout';

describe('chipLabelLayout', () => {
  it('with no labelWrap, returns no styles so existing chips render unchanged', () => {
    const labelWrap = undefined;

    const layout = chipLabelLayout(labelWrap);

    expect(layout).toEqual({ boxStyle: undefined, textStyle: undefined, numberOfLines: undefined });
  });

  it('with labelWrap none, returns no styles', () => {
    const labelWrap = ChipLabelWrap.None;

    const layout = chipLabelLayout(labelWrap);

    expect(layout).toEqual({ boxStyle: undefined, textStyle: undefined, numberOfLines: undefined });
  });

  it('with labelWrap wrap, caps the chip at its container width and lets the label wrap', () => {
    const labelWrap = ChipLabelWrap.Wrap;

    const layout = chipLabelLayout(labelWrap);

    expect(layout).toEqual({
      boxStyle: { maxWidth: '100%', flexShrink: 1 },
      textStyle: { flexShrink: 1 },
      numberOfLines: undefined,
    });
  });

  it('with labelWrap truncate, caps the chip at its container width and keeps the label on one line', () => {
    const labelWrap = ChipLabelWrap.Truncate;

    const layout = chipLabelLayout(labelWrap);

    expect(layout).toEqual({
      boxStyle: { maxWidth: '100%', flexShrink: 1 },
      textStyle: { flexShrink: 1 },
      numberOfLines: 1,
    });
  });
});
