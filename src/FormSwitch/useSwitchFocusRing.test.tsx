import { act, render, screen } from '@testing-library/react';

import { FormSwitch } from './FormSwitch';
import { switchRingStyle } from './useSwitchFocusRing';

const RING_COLOR = '#123456';
const noop = (): void => undefined;

const focusSwitch = (): HTMLElement => {
  const input = screen.getByRole('switch');
  act(() => input.focus());
  return input;
};

describe('switchRingStyle', () => {
  it('with keyboard focus on web, returns the 2px token outline in the given colour', () => {
    const visible = true;

    const style = switchRingStyle(visible, RING_COLOR, true);

    expect(style).toMatchObject({ outlineColor: RING_COLOR, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' });
  });

  it('without focus on web, returns a zero-width outline', () => {
    const visible = false;

    const style = switchRingStyle(visible, RING_COLOR, true);

    expect(style).toEqual({ outlineWidth: 0 });
  });

  it('on native, returns no outline keys', () => {
    const visible = true;

    const style = switchRingStyle(visible, RING_COLOR, false);

    expect(style).toEqual({});
  });
});

describe('useSwitchFocusRing', () => {
  it('with the input focused, draws the ring on the switch slot', () => {
    render(<FormSwitch value label="One full-name field" testID="sw" onValueChange={noop} />);

    focusSwitch();

    expect(getComputedStyle(screen.getByTestId('sw-hitbox')).outlineWidth).toBe('2px');
  });

  it('with the input blurred after focus, removes the ring', () => {
    render(<FormSwitch value label="One full-name field" testID="sw" onValueChange={noop} />);
    const input = focusSwitch();

    act(() => input.blur());

    expect(getComputedStyle(screen.getByTestId('sw-hitbox')).outlineWidth).toBe('0px');
  });

  it('with the row and box variants focused, draws the same ring colour on both', () => {
    const { unmount } = render(<FormSwitch value label="Row" testID="sw" onValueChange={noop} />);
    focusSwitch();
    const rowColor = getComputedStyle(screen.getByTestId('sw-hitbox')).outlineColor;
    unmount();
    render(<FormSwitch value label="Box" stateLabel="On" testID="sw" variant="box" onValueChange={noop} />);

    focusSwitch();

    expect(getComputedStyle(screen.getByTestId('sw-hitbox')).outlineColor).toBe(rowColor);
    expect(rowColor).not.toBe('');
  });
});
