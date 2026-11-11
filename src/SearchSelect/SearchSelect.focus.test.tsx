import { act, fireEvent, render, screen } from '@testing-library/react';
import { useWindowDimensions } from 'react-native';

import { SearchSelect } from './SearchSelect';

jest.mock('react-native', () => ({
  ...jest.requireActual<Record<string, unknown>>('react-native'),
  useWindowDimensions: jest.fn(),
  AccessibilityInfo: { isReduceMotionEnabled: () => Promise.resolve(false), addEventListener: () => ({ remove: jest.fn() }) },
}));

const PHONE_WIDTH = 360;
const VIEWPORT_HEIGHT = 800;
const PAST_SHEET_MOTION_MS = 400;
const TID = 'country';
const OPTIONS = [
  { label: 'Cyprus', value: 'CY' },
  { label: 'Greece', value: 'GR' },
];
const LABELS = {
  placeholder: 'Pick a country',
  search: 'Search',
  searchHint: 'Type to filter',
  recent: 'Recent',
  all: 'All',
  empty: 'No match',
  optionHint: 'Picks this country',
  close: 'Close',
  closeHint: 'Closes the list',
};

function openAt(width: number): HTMLElement {
  jest.mocked(useWindowDimensions).mockReturnValue({ width, height: VIEWPORT_HEIGHT, scale: 1, fontScale: 1 });
  render(<SearchSelect accessibilityHint="Opens the list" accessibilityLabel="Country" labels={LABELS} options={OPTIONS} testID={TID} value="" onChange={jest.fn()} />);
  const trigger = screen.getByTestId(TID);
  trigger.focus();
  fireEvent.click(trigger);
  return trigger;
}

describe('SearchSelect on the phone sheet', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it.each([
    ['phone sheet, Escape', PHONE_WIDTH, 'Escape'],
    ['phone sheet, Enter pick', PHONE_WIDTH, 'Enter'],
  ])('with the %s and the close rendering after pending timers, closes and returns focus to the trigger', (_case, width, key) => {
    const trigger = openAt(width);
    const search = screen.getByTestId(`${TID}-search`);
    fireEvent.keyDown(search, { key: 'ArrowDown' });

    act(() => {
      fireEvent.keyDown(search, { key });
      jest.advanceTimersByTime(PAST_SHEET_MOTION_MS);
    });

    expect(screen.queryByTestId(`${TID}-panel`)).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
