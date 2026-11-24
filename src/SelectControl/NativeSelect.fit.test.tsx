import { render, screen } from '@testing-library/react';

import { SelectControl } from './SelectControl';

const OPTIONS = [
  { value: 'clear', label: 'Clear' },
  { value: 'review', label: 'Review' },
];

const noop = (): void => undefined;

describe('NativeSelect width', () => {
  it('with native fit, sizes the select to its options', () => {
    render(<SelectControl native="fit" accessibilityLabel="Decision: Review" options={OPTIONS} testID="pick" value="review" onChange={noop} />);

    const select = screen.getByTestId('pick');

    expect(select.style.width).toBe('auto');
  });

  it('with native true, keeps the select at full width', () => {
    render(<SelectControl native accessibilityLabel="Decision: Review" options={OPTIONS} testID="pick" value="review" onChange={noop} />);

    const select = screen.getByTestId('pick');

    expect(select.style.width).toBe('100%');
  });
});
