import { act, fireEvent, render, screen } from '@testing-library/react';

import { DateRangeControl } from '../../DateRangeControl/DateRangeControl';
import { DatePickerProvider } from '../hooks/useDatePickerConfig';

import type { DateRangeValue } from '../../controls/controlTypes';
import type { DatePickerLabels } from '../types';

const TID = 'dr';
const PICKER = `${TID}-picker`;
const DESKTOP = 1280;
const PHONE = 360;
const LABELS: Partial<DatePickerLabels> = { presets: 'Shortcuts', dayCount: '{{p1}} d', rangeSeparator: ' to ', rangeOrder: 'Start after end' };

function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: width });
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

function renderRange(value: DateRangeValue = { from: '', to: '' }): jest.Mock {
  const onChange = jest.fn();
  render(
    <DatePickerProvider labels={LABELS} locale="en-GB" today="2026-11-16">
      <DateRangeControl fromLabel="From" testID={TID} toLabel="To" value={value} onChange={onChange} />
    </DatePickerProvider>,
  );
  return onChange;
}

async function openRange(value?: DateRangeValue): Promise<jest.Mock> {
  const onChange = renderRange(value);
  fireEvent.click(screen.getByTestId(`${TID}-calendar`));
  await screen.findByTestId(PICKER);
  return onChange;
}

describe('DateRangeControl calendar', () => {
  beforeEach(() => setViewportWidth(DESKTOP));

  it('with the Last 7 days chip and Apply, emits that range', async () => {
    const onChange = await openRange();
    fireEvent.click(screen.getByTestId(`${PICKER}-preset-last7Days`));

    fireEvent.click(screen.getByTestId(`${PICKER}-apply`));

    expect(onChange).toHaveBeenCalledWith({ from: '2026-11-10', to: '2026-11-16' });
  });

  it('with a later day picked first, Apply emits the ends in order', async () => {
    const onChange = await openRange();
    fireEvent.click(screen.getByTestId(`${PICKER}-day-2026-11-20`));
    fireEvent.click(screen.getByTestId(`${PICKER}-day-2026-11-12`));

    fireEvent.click(screen.getByTestId(`${PICKER}-apply`));

    expect(onChange).toHaveBeenCalledWith({ from: '2026-11-12', to: '2026-11-20' });
  });

  it('with a range picked, the footer shows it with the separator and day count labels', async () => {
    await openRange();

    fireEvent.click(screen.getByTestId(`${PICKER}-preset-last7Days`));

    expect(screen.getByTestId(`${PICKER}-summary`).textContent).toBe('10 Nov to 16 Nov 2026 · 7 d');
  });

  it('with Cancel, closes and emits nothing', async () => {
    const onChange = await openRange();
    fireEvent.click(screen.getByTestId(`${PICKER}-preset-today`));

    fireEvent.click(screen.getByTestId(`${PICKER}-cancel`));

    expect([screen.queryByTestId(PICKER), onChange.mock.calls.length]).toEqual([null, 0]);
  });

  it('at desktop width, shows preset chips above two months', async () => {
    await openRange();

    expect([screen.getAllByRole('grid').length, screen.getByRole('group').getAttribute('aria-label')]).toEqual([2, 'Shortcuts']);
  });

  it('at phone width, offers presets as a menu and months in one scroll list', async () => {
    setViewportWidth(PHONE);

    await openRange();

    expect([screen.getByTestId(`${PICKER}-presets`).tagName, screen.getAllByRole('grid').length]).toEqual(['SELECT', 6]);
  });

  it('at phone width, a preset picked from the menu fills the range', async () => {
    setViewportWidth(PHONE);
    const onChange = await openRange();
    fireEvent.change(screen.getByTestId(`${PICKER}-presets`), { target: { value: 'thisMonth' } });

    fireEvent.click(screen.getByTestId(`${PICKER}-apply`));

    expect(onChange).toHaveBeenCalledWith({ from: '2026-11-01', to: '2026-11-16' });
  });
});

describe('DateRangeControl typed ends', () => {
  it('with the field label, joins from and to with the separator label', () => {
    renderRange();

    expect(screen.getByText('From to To')).toBeTruthy();
  });

  it('with a typed start after the end, shows the order error and emits nothing', () => {
    const onChange = renderRange({ from: '', to: '2026-11-10' });
    const from = screen.getByTestId(`${TID}-from`);
    fireEvent.focus(from);

    fireEvent.change(from, { target: { value: '2026-11-20' } });

    expect([screen.getByRole('alert').textContent, onChange.mock.calls.length]).toEqual(['Start after end', 0]);
  });

  it('with a start error and a valid end typed, keeps the start error', () => {
    const onChange = renderRange({ from: '', to: '2026-11-10' });
    const from = screen.getByTestId(`${TID}-from`);
    fireEvent.focus(from);
    fireEvent.change(from, { target: { value: '2026-11-20' } });

    fireEvent.change(screen.getByTestId(`${TID}-to`), { target: { value: '2026-11-12' } });

    expect([screen.getByRole('alert').textContent, onChange.mock.calls.length]).toEqual(['Start after end', 1]);
  });
});
