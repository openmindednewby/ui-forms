import { act, fireEvent, render, screen } from '@testing-library/react';

import { DateField } from '../../DateField/DateField';
import { DatePickerProvider } from '../hooks/useDatePickerConfig';

const TID = 'layout';
const PICKER = `${TID}-picker`;
const PHONE = 360;
const DESKTOP = 1280;

function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: width });
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

function renderField(value: string): void {
  render(
    <DatePickerProvider locale="en-GB" today="2026-11-16">
      <DateField accessibilityHint="Pick the day" label="Day" testID={TID} value={value} onChange={jest.fn()} />
    </DatePickerProvider>,
  );
}

async function openPicker(): Promise<void> {
  renderField('2026-11-20');
  fireEvent.click(screen.getByTestId(`${TID}-calendar`));
  await screen.findByTestId(PICKER);
}

describe('DateField picker layout at phone width', () => {
  beforeEach(() => setViewportWidth(PHONE));

  it('day cells never shrink below their 44 px box', async () => {
    await openPicker();

    const cell = screen.getByTestId(`${PICKER}-day-2026-11-20`).parentElement as HTMLElement;

    expect([cell.style.flexShrink, cell.style.width]).toEqual(['0', '44px']);
  });

  it('the sheet spans the full width and does not scale', async () => {
    await openPicker();

    const sheet = getComputedStyle(screen.getByTestId(`${PICKER}-sheet`));

    expect([sheet.width, sheet.transform.includes('scale')]).toEqual(['100%', false]);
  });
});

describe('DateField closed field width', () => {
  beforeEach(() => setViewportWidth(DESKTOP));

  it('with Fri 25 Dec 2026 at 14 px, is wide enough for the text plus the calendar button', () => {
    const text = 'Fri 25 Dec 2026';
    const fontPx = 14;
    const glyphEm = 0.6;
    const iconRoom = 48;
    renderField('2026-12-25');

    const minWidth = parseFloat(getComputedStyle(screen.getByTestId(`${TID}-anchor`)).minWidth);

    expect(minWidth).toBeGreaterThanOrEqual(text.length * fontPx * glyphEm + iconRoom);
  });
});
