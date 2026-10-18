import { act, fireEvent, render, screen } from '@testing-library/react';

import { FormField } from './FormField';

const RECENT_KEY = 'test.recent.blur';
const SETTLE_MS = 500;

describe('RecentInputField', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('when blurred with a first-ever value, never opens the recents menu over the next control', () => {
    render(<FormField label="Name" recentKey={RECENT_KEY} testID="fld" />);
    const input = screen.getByLabelText('Name');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Vladimir Putin' } });

    fireEvent.blur(input);

    expect(screen.queryByTestId('fld-recent-menu')).toBeNull();
  });

  it('when blurred with content, remembers the value for the next focus', () => {
    render(<FormField label="Name" recentKey={RECENT_KEY} testID="fld" />);
    const input = screen.getByLabelText('Name');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Vladimir Putin' } });

    fireEvent.blur(input);

    act(() => {
      jest.advanceTimersByTime(SETTLE_MS);
    });
    fireEvent.focus(input);
    expect(screen.getByTestId('fld-recent-menu')).toBeTruthy();
  });
});
