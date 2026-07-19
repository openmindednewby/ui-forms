import { fireEvent, render, screen } from '@testing-library/react';

import { DateRangeControl } from './DateRangeControl';

const TID = 'dr';

function renderRange(
  value: { from: string; to: string },
  overrides: Partial<React.ComponentProps<typeof DateRangeControl>> = {},
): jest.Mock {
  const onChange = jest.fn();
  render(
    <DateRangeControl
      fromLabel="From"
      testID={TID}
      toLabel="To"
      value={value}
      onChange={onChange}
      {...overrides}
    />,
  );
  return onChange;
}

describe('DateRangeControl — one-sided patching', () => {
  it('patches only the FROM side, preserving TO', () => {
    // The classic defect this guards: rebuilding the range from one input clobbers the other,
    // so setting a start date silently wipes the end date the user already entered.
    const onChange = renderRange({ from: '', to: '2024-12-31' });
    fireEvent.change(screen.getByTestId(`${TID}-from`), { target: { value: '2024-01-01' } });
    expect(onChange).toHaveBeenCalledWith({ from: '2024-01-01', to: '2024-12-31' });
  });

  it('patches only the TO side, preserving FROM', () => {
    const onChange = renderRange({ from: '2024-01-01', to: '' });
    fireEvent.change(screen.getByTestId(`${TID}-to`), { target: { value: '2024-12-31' } });
    expect(onChange).toHaveBeenCalledWith({ from: '2024-01-01', to: '2024-12-31' });
  });
});

describe('DateRangeControl — labelling', () => {
  it('names each input with its own pre-localized sub-label', () => {
    renderRange({ from: '', to: '' }, { fromLabel: 'Από', toLabel: 'Έως' });
    expect(screen.getByTestId(`${TID}-from`).getAttribute('aria-label')).toBe('Από');
    expect(screen.getByTestId(`${TID}-to`).getAttribute('aria-label')).toBe('Έως');
  });

  it('renders both sides under one range wrapper', () => {
    renderRange({ from: '', to: '' });
    expect(screen.getByTestId(`${TID}-range`)).toBeTruthy();
  });
});

describe('DateRangeControl — submit', () => {
  it('calls onSubmit from either side', () => {
    const onSubmit = jest.fn();
    renderRange({ from: '', to: '' }, { onSubmit });
    fireEvent.keyDown(screen.getByTestId(`${TID}-from`), { key: 'Enter', keyCode: 13, charCode: 13 });
    fireEvent.keyDown(screen.getByTestId(`${TID}-to`), { key: 'Enter', keyCode: 13, charCode: 13 });
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });
});
