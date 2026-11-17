import { act, fireEvent, render, screen } from '@testing-library/react';

import { DateField } from '../../DateField/DateField';
import { DatePickerProvider } from '../hooks/useDatePickerConfig';

import type { DateFieldProps } from '../../DateField/types';

const TID = 'close';
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

async function openPicker(overrides: Partial<DateFieldProps> = {}): Promise<jest.Mock> {
  const onChange = jest.fn();
  render(
    <DatePickerProvider locale="en-GB" today="2026-11-16">
      <DateField accessibilityHint="Pick the close" label="Expected close" testID={TID} value="2026-11-20" onChange={onChange} {...overrides} />
    </DatePickerProvider>,
  );
  fireEvent.click(screen.getByTestId(`${TID}-calendar`));
  await screen.findByTestId(PICKER);
  return onChange;
}

function day(iso: string): HTMLElement {
  return screen.getByTestId(`${PICKER}-day-${iso}`);
}

describe('DateField calendar', () => {
  beforeEach(() => setViewportWidth(DESKTOP));

  it('at desktop width, opens as a popover dialog', async () => {
    await openPicker();

    expect(screen.getByTestId(PICKER).getAttribute('data-variant')).toBe('popover');
  });

  it('at phone width, opens as a bottom sheet', async () => {
    setViewportWidth(PHONE);

    await openPicker();

    expect(screen.getByTestId(PICKER).getAttribute('data-variant')).toBe('sheet');
  });

  it('on open, focuses the selected day', async () => {
    await openPicker();

    expect(document.activeElement).toBe(day('2026-11-20'));
  });

  it('with no value, focuses today', async () => {
    await openPicker({ value: '' });

    expect(document.activeElement).toBe(day('2026-11-16'));
  });

  it('with ArrowRight on a day, moves focus to the next day', async () => {
    await openPicker();

    fireEvent.keyDown(day('2026-11-20'), { key: 'ArrowRight' });

    expect(document.activeElement).toBe(day('2026-11-21'));
  });

  it('with PageDown, moves focus to the same day next month', async () => {
    await openPicker();

    fireEvent.keyDown(day('2026-11-20'), { key: 'PageDown' });

    expect(document.activeElement).toBe(day('2026-12-20'));
  });

  it('with Tab on the last control, wraps focus to the first', async () => {
    await openPicker();
    const setDate = screen.getByTestId(`${PICKER}-set`);
    setDate.focus();

    fireEvent.keyDown(setDate, { key: 'Tab' });

    expect(document.activeElement).toBe(screen.getByTestId(`${PICKER}-previous`));
  });

  it('with Shift+Tab on the first control, wraps focus to the last', async () => {
    await openPicker();
    const previous = screen.getByTestId(`${PICKER}-previous`);
    previous.focus();

    fireEvent.keyDown(previous, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(screen.getByTestId(`${PICKER}-set`));
  });

  it('with Escape, closes and returns focus to the field', async () => {
    await openPicker();

    fireEvent.keyDown(day('2026-11-20'), { key: 'Escape' });

    expect([screen.queryByTestId(PICKER), document.activeElement]).toEqual([null, screen.getByTestId(TID)]);
  });

  it('after picking a day and Set date, emits it in the wire format', async () => {
    const onChange = await openPicker();
    fireEvent.click(day('2026-11-25'));

    fireEvent.click(screen.getByTestId(`${PICKER}-set`));

    expect(onChange).toHaveBeenCalledWith('2026-11-25');
  });

  it('with Enter on a day and Set date, emits that day', async () => {
    const onChange = await openPicker();
    fireEvent.keyDown(day('2026-11-20'), { key: 'ArrowLeft' });
    fireEvent.keyDown(day('2026-11-19'), { key: 'Enter' });

    fireEvent.click(screen.getByTestId(`${PICKER}-set`));

    expect(onChange).toHaveBeenCalledWith('2026-11-19');
  });

  it('with Clear, emits an empty string', async () => {
    const onChange = await openPicker();

    fireEvent.click(screen.getByTestId(`${PICKER}-clear`));

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('with a max, disables the days after it', async () => {
    await openPicker({ max: '2026-11-25' });

    const actual = [day('2026-11-25'), day('2026-11-26')].map((el) => (el as HTMLButtonElement).disabled);

    expect(actual).toEqual([false, true]);
  });

  it('with a month picked from the month menu, shows that month', async () => {
    await openPicker();

    fireEvent.change(screen.getByTestId(`${PICKER}-month`), { target: { value: '3' } });

    expect(screen.getByTestId(`${PICKER}-grid-2026-03`)).toBeTruthy();
  });

  it('on a phone, every day button is at least 44 px square', async () => {
    setViewportWidth(PHONE);
    await openPicker();

    const { width, height } = day('2026-11-20').style;

    expect(Math.min(parseInt(width, 10), parseInt(height, 10))).toBeGreaterThanOrEqual(44);
  });
});
