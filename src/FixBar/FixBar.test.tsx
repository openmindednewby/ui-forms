import { fireEvent, render, screen } from '@testing-library/react';

import { FixBar, isFixBarVisible } from './FixBar';

const renderBar = (count: number, onShow: () => void = jest.fn()): void => {
  render(<FixBar count={count} message="2 fields to fix" showHint="Opens the first field" showLabel="Show" testID="fix" onShow={onShow} />);
};

describe('isFixBarVisible', () => {
  it.each([
    [0, false],
    [-1, false],
    [1, true],
    [3, true],
  ])('with a count of %p, returns %p', (count, expected) => {
    const visible = isFixBarVisible(count);

    expect(visible).toBe(expected);
  });
});

describe('FixBar', () => {
  it('with blocking fields, pressing Show calls onShow', () => {
    const onShow = jest.fn();
    renderBar(2, onShow);

    fireEvent.click(screen.getByTestId('fix-show'));

    expect(onShow).toHaveBeenCalledTimes(1);
  });

  it('with blocking fields, announces the message as an alert', () => {
    renderBar(2);

    const text = screen.getByTestId('fix-count');

    expect(text.getAttribute('role')).toBe('alert');
    expect(text.textContent).toBe('2 fields to fix');
  });

  it('with no blocking fields, renders nothing', () => {
    renderBar(0);

    const bar = screen.queryByTestId('fix');

    expect(bar).toBeNull();
  });
});
