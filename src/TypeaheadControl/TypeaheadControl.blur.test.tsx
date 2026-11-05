import React, { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { TypeaheadControl } from './TypeaheadControl';

const TID = 'ta';
const INPUT = `${TID}-input`;
const MENU = `${TID}-menu`;
const BLUR_CLOSE_WAIT_MS = 1000;
const OPTIONS = [{ label: 'Cyprus', value: 'CY' }];

function Harness(): React.ReactElement {
  const [value, setValue] = useState('');
  return <TypeaheadControl accessibilityLabel="Country" options={OPTIONS} testID={TID} value={value} onChange={setValue} />;
}

function openList(): HTMLElement {
  const input = screen.getByTestId(INPUT);
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'c' } });
  return input;
}

describe('TypeaheadControl blur', () => {
  beforeEach(() => jest.useFakeTimers());

  afterEach(() => jest.useRealTimers());

  it('with a refocus before the close delay ends, keeps the list open', () => {
    render(<Harness />);
    const input = openList();
    fireEvent.blur(input);
    fireEvent.focus(input);

    act(() => jest.advanceTimersByTime(BLUR_CLOSE_WAIT_MS));

    expect(screen.queryByTestId(MENU)).not.toBeNull();
  });

  it('with no refocus, closes the list after the delay', () => {
    render(<Harness />);
    const input = openList();
    fireEvent.blur(input);

    act(() => jest.advanceTimersByTime(BLUR_CLOSE_WAIT_MS));

    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('with an unmount during the close delay, leaves no timer pending', () => {
    const { unmount } = render(<Harness />);
    const input = screen.getByTestId(INPUT);
    fireEvent.focus(input);
    fireEvent.blur(input);

    unmount();

    expect(jest.getTimerCount()).toBe(0);
  });
});
