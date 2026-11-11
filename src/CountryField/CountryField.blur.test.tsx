import { act, fireEvent, render, screen } from '@testing-library/react';
import { useWindowDimensions } from 'react-native';

import { CountryField } from './CountryField';

jest.mock('react-native', () => ({
  ...jest.requireActual<Record<string, unknown>>('react-native'),
  useWindowDimensions: jest.fn(),
  AccessibilityInfo: { isReduceMotionEnabled: () => Promise.resolve(false), addEventListener: () => ({ remove: jest.fn() }) },
}));
jest.mock('../CountryFlag/CountryFlag', () => ({ CountryFlag: (): null => null }));

const DESKTOP_WIDTH = 1280;
const PHONE_WIDTH = 360;
const VIEWPORT_HEIGHT = 800;
const PAST_MOTION_MS = 400;
const TID = 'country';
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

function renderField(onBlur: () => void, onChange: (code: string) => void = jest.fn(), width = DESKTOP_WIDTH): HTMLElement {
  jest.mocked(useWindowDimensions).mockReturnValue({ width, height: VIEWPORT_HEIGHT, scale: 1, fontScale: 1 });
  render(<CountryField accessibilityHint="Opens the list" accessibilityLabel="Country" labels={LABELS} testID={TID} value="" onBlur={onBlur} onChange={onChange} />);
  return screen.getByTestId(TID);
}

function openPhoneSheet(trigger: HTMLElement): HTMLElement {
  act(() => {
    trigger.focus();
    fireEvent.click(trigger);
  });
  const search = screen.getByTestId(`${TID}-search`);
  fireEvent.keyDown(search, { key: 'ArrowDown' });
  return search;
}

function pickHighlighted(search: HTMLElement): void {
  act(() => {
    fireEvent.keyDown(search, { key: 'Enter' });
    jest.advanceTimersByTime(PAST_MOTION_MS);
  });
}

describe('CountryField onBlur', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('with the list closed and the field left, calls onBlur once', () => {
    const onBlur = jest.fn();
    const trigger = renderField(onBlur);

    fireEvent.focus(trigger);
    fireEvent.blur(trigger);

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('with the list open, focus moving into the list does not call onBlur', () => {
    const onBlur = jest.fn();
    const trigger = renderField(onBlur);

    fireEvent.focus(trigger);
    act(() => {
      fireEvent.click(trigger);
    });
    fireEvent.blur(trigger);

    expect(onBlur).not.toHaveBeenCalled();
  });

  it('with a country picked on the phone sheet, does not call onBlur', () => {
    const onBlur = jest.fn();
    const onChange = jest.fn();
    const search = openPhoneSheet(renderField(onBlur, onChange, PHONE_WIDTH));

    pickHighlighted(search);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onBlur).not.toHaveBeenCalled();
  });

  it('after a pick on the phone sheet, leaving the field calls onBlur once', () => {
    const onBlur = jest.fn();
    const trigger = renderField(onBlur, jest.fn(), PHONE_WIDTH);
    pickHighlighted(openPhoneSheet(trigger));

    fireEvent.blur(trigger);

    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
