/**
 * Web a11y semantics for FormSwitch (A11Y-ARIA-CHECKED-1).
 *
 * react-native-web 0.21 emits NOTHING from `accessibilityState` on web, so the `checked` /
 * `disabled` state that native reads from `accessibilityState` never reached the DOM as ARIA.
 * These tests pin the literal ARIA props that carry the state on web. `useUi()` falls back to
 * the default theme with no provider, so a plain `render` is enough (as in ChipSelector's tests).
 */
import { render, screen } from '@testing-library/react';

import { FormSwitch } from './FormSwitch';

const noop = (): void => undefined;

describe('FormSwitch web semantics', () => {
  it('emits aria-checked that follows value', () => {
    const { rerender } = render(<FormSwitch value label="Recommendations" testID="sw" onValueChange={noop} />);
    expect(screen.getByTestId('sw').getAttribute('aria-checked')).toBe('true');

    rerender(<FormSwitch label="Recommendations" testID="sw" value={false} onValueChange={noop} />);
    expect(screen.getByTestId('sw').getAttribute('aria-checked')).toBe('false');
  });

  it('marks a disabled switch aria-disabled', () => {
    render(<FormSwitch disabled value label="Required" testID="sw" onValueChange={noop} />);
    expect(screen.getByTestId('sw').getAttribute('aria-disabled')).toBe('true');
  });

  it('emits no aria-disabled on an enabled switch', () => {
    render(<FormSwitch value label="Optional" testID="sw" onValueChange={noop} />);
    expect(screen.getByTestId('sw').getAttribute('aria-disabled')).toBeNull();
  });
});
