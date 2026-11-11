import { act, fireEvent, render, screen } from '@testing-library/react';
import { Text, useWindowDimensions } from 'react-native';

import { SearchSelect } from './SearchSelect';
import type { SearchSelectTrigger } from './types';

jest.mock('react-native', () => ({
  ...jest.requireActual<Record<string, unknown>>('react-native'),
  useWindowDimensions: jest.fn(),
  AccessibilityInfo: { isReduceMotionEnabled: () => Promise.resolve(false), addEventListener: () => ({ remove: jest.fn() }) },
}));

const PHONE_WIDTH = 360;
const VIEWPORT_HEIGHT = 800;
const PAST_MOTION_MS = 400;
const TID = 'move';
const OPTIONS = [
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' },
];
const LABELS = {
  placeholder: 'Move',
  search: 'Search',
  searchHint: 'Type to filter',
  recent: 'Recent',
  all: 'All',
  empty: 'No match',
  optionHint: 'Moves the deal',
  close: 'Close',
  closeHint: 'Closes the list',
};

function renderWithTrigger(renderTrigger: (trigger: SearchSelectTrigger) => React.ReactNode, onChange = jest.fn()): HTMLElement {
  jest.mocked(useWindowDimensions).mockReturnValue({ width: PHONE_WIDTH, height: VIEWPORT_HEIGHT, scale: 1, fontScale: 1 });
  render(<SearchSelect accessibilityHint="Opens the stages" accessibilityLabel="Move deal" labels={LABELS} options={OPTIONS} renderTrigger={renderTrigger} testID={TID} value="" onChange={onChange} />);
  return screen.getByTestId(TID);
}

describe('SearchSelect renderTrigger', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it('with the list opened from the custom trigger, passes open true to the trigger', () => {
    const renderTrigger = jest.fn((trigger: SearchSelectTrigger) => <Text>{trigger.open ? 'open' : 'shut'}</Text>);
    const trigger = renderWithTrigger(renderTrigger);

    fireEvent.click(trigger);

    expect(renderTrigger).toHaveBeenLastCalledWith(expect.objectContaining({ open: true, selected: null }));
  });

  it('with an option picked from the custom trigger, calls onChange and returns focus to the trigger', () => {
    const onChange = jest.fn();
    const trigger = renderWithTrigger(() => <Text>Move</Text>, onChange);
    trigger.focus();
    fireEvent.click(trigger);
    const search = screen.getByTestId(`${TID}-search`);
    fireEvent.keyDown(search, { key: 'ArrowDown' });

    act(() => {
      fireEvent.keyDown(search, { key: 'Enter' });
      jest.advanceTimersByTime(PAST_MOTION_MS);
    });

    expect(onChange).toHaveBeenCalledWith('won');
    expect(document.activeElement).toBe(trigger);
  });

  it('with a custom trigger, keeps the accessibility label on the pressable', () => {
    const trigger = renderWithTrigger(() => <Text>Move</Text>);

    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-label')).toBe('Move deal');
  });
});
