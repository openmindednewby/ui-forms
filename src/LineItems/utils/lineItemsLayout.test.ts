import {
  LINE_ITEMS_WIDE_MIN_WIDTH,
  canRemoveLine,
  isLineItemsWide,
  lineItemColumnFlex,
  lineNumberOf,
} from './lineItemsLayout';

describe('isLineItemsWide', () => {
  it('with a 360px phone, returns false', () => {
    const wide = isLineItemsWide(360);

    expect(wide).toBe(false);
  });

  it('at exactly the default breakpoint, returns true', () => {
    const wide = isLineItemsWide(LINE_ITEMS_WIDE_MIN_WIDTH);

    expect(wide).toBe(true);
  });

  it('one pixel under the default breakpoint, returns false', () => {
    const wide = isLineItemsWide(LINE_ITEMS_WIDE_MIN_WIDTH - 1);

    expect(wide).toBe(false);
  });

  it('with a custom breakpoint of 1024 and a 1100px window, returns true', () => {
    const wide = isLineItemsWide(1100, 1024);

    expect(wide).toBe(true);
  });
});

describe('canRemoveLine', () => {
  it.each([
    [1, undefined, false],
    [2, undefined, true],
    [2, 2, false],
    [3, 2, true],
  ])('with %p lines and minItems %p, returns %p', (count, minItems, expected) => {
    const removable = canRemoveLine(count, minItems);

    expect(removable).toBe(expected);
  });
});

describe('lineNumberOf', () => {
  it('with index 0, returns 1', () => {
    const lineNumber = lineNumberOf(0);

    expect(lineNumber).toBe(1);
  });
});

describe('lineItemColumnFlex', () => {
  it('with no flex, returns 1', () => {
    const flex = lineItemColumnFlex({ key: 'account', label: 'Account' });

    expect(flex).toBe(1);
  });

  it('with flex 2, returns 2', () => {
    const flex = lineItemColumnFlex({ key: 'account', label: 'Account', flex: 2 });

    expect(flex).toBe(2);
  });
});
