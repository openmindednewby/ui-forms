import { INLINE_FIELD_ROW_MIN_WIDTH, inlineFieldRowLayout } from './inlineFieldRowLayout';

describe('inlineFieldRowLayout', () => {
  it('with a phone width, stacks and drops the field cap', () => {
    const layout = inlineFieldRowLayout(360, 480);

    expect(layout).toEqual({ inline: false, fieldMaxWidth: undefined });
  });

  it('at exactly the default breakpoint, goes inline with the field capped', () => {
    const layout = inlineFieldRowLayout(INLINE_FIELD_ROW_MIN_WIDTH, 480);

    expect(layout).toEqual({ inline: true, fieldMaxWidth: 480 });
  });

  it('one pixel under the default breakpoint, stays stacked', () => {
    const layout = inlineFieldRowLayout(INLINE_FIELD_ROW_MIN_WIDTH - 1, 480);

    expect(layout.inline).toBe(false);
  });

  it('with a custom breakpoint of 768, goes inline on an 800px tablet', () => {
    const layout = inlineFieldRowLayout(800, 320, 768);

    expect(layout).toEqual({ inline: true, fieldMaxWidth: 320 });
  });
});
