import { act, fireEvent, render, screen } from '@testing-library/react';

import { DateRangeControl } from '../../DateRangeControl/DateRangeControl';
import { DatePickerProvider } from '../hooks/useDatePickerConfig';

const TID = 'dr';
const PICKER = `${TID}-picker`;
const DESKTOP = 1280;
const PHONE = 360;

function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: width });
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

function openRange(value = { from: '', to: '' }): jest.Mock {
  const onChange = jest.fn();
  render(
    <DatePickerProvider locale="en-GB" today="2026-11-16">
      <DateRangeControl fromLabel="From" testID={TID} toLabel="To" value={value} onChange={onChange} />
    </DatePickerProvider>,
  );
  fireEvent.click(screen.getByTestId(`${TID}-calendar`));
  return onChange;
}

describe('DateRangeControl calendar', () => {
  beforeEach(() => setViewportWidth(DESKTOP));

  it('with the Last 7 days chip and Apply, emits that range', () => {
    const onChange = openRange();
    fireEvent.click(screen.getByTestId(`${PICKER}-preset-last7Days`));

    fireEvent.click(screen.getByTestId(`${PICKER}-apply`));

    expect(onChange).toHaveBeenCalledWith({ from: '2026-11-10', to: '2026-11-16' });
  });

  it('with a later day picked first, Apply emits the ends in order', () => {
    const onChange = openRange();
    fireEvent.click(screen.getByTestId(`${PICKER}-day-2026-11-20`));
    fireEvent.click(screen.getByTestId(`${PICKER}-day-2026-11-12`));

    fireEvent.click(screen.getByTestId(`${PICKER}-apply`));

    expect(onChange).toHaveBeenCalledWith({ from: '2026-11-12', to: '2026-11-20' });
  });

  it('with a range picked, the footer shows it and its day count', () => {
    openRange();

    fireEvent.click(screen.getByTestId(`${PICKER}-preset-last7Days`));

    expect(screen.getByTestId(`${PICKER}-summary`).textContent).toBe('10 Nov – 16 Nov 2026 · 7 days');
  });

  it('with Cancel, closes and emits nothing', () => {
    const onChange = openRange();
    fireEvent.click(screen.getByTestId(`${PICKER}-preset-today`));

    fireEvent.click(screen.getByTestId(`${PICKER}-cancel`));

    expect([screen.queryByRole('dialog'), onChange.mock.calls.length]).toEqual([null, 0]);
  });

  it('at desktop width, shows preset chips above two months', () => {
    openRange();

    expect([screen.getAllByRole('grid').length, screen.getByRole('group').getAttribute('aria-label')]).toEqual([2, 'Quick ranges']);
  });

  it('at phone width, offers presets as a menu and months in one scroll list', () => {
    setViewportWidth(PHONE);

    openRange();

    expect([screen.getByTestId(`${PICKER}-presets`).tagName, screen.getAllByRole('grid').length]).toEqual(['SELECT', 6]);
  });

  it('at phone width, a preset picked from the menu fills the range', () => {
    setViewportWidth(PHONE);
    const onChange = openRange();
    fireEvent.change(screen.getByTestId(`${PICKER}-presets`), { target: { value: 'thisMonth' } });

    fireEvent.click(screen.getByTestId(`${PICKER}-apply`));

    expect(onChange).toHaveBeenCalledWith({ from: '2026-11-01', to: '2026-11-16' });
  });
});
