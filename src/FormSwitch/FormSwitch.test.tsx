/**
 * Web a11y semantics for FormSwitch (A11Y-ARIA-CHECKED-1).
 *
 * react-native-web 0.21 renders Switch as a wrapper <div> (which receives `testID`) around a
 * native <input type="checkbox" role="switch">. The input's own `checked` / `disabled` are the
 * state assistive tech reads. These tests pin that exactly ONE element exposes the switch, that
 * its state follows the props, and that the wrapper is never a (second) tab stop.
 * `useUi()` falls back to the default theme with no provider, so a plain `render` is enough.
 */
import { render, screen } from '@testing-library/react';

import { FormSwitch } from './FormSwitch';

const noop = (): void => undefined;

const theSwitch = (): HTMLInputElement => {
  const switches = screen.getAllByRole('switch');
  expect(switches).toHaveLength(1);
  return switches[0] as HTMLInputElement;
};

describe('FormSwitch web semantics', () => {
  it('exposes exactly one switch, the native input, labelled by the label', () => {
    render(<FormSwitch value label="Recommendations" testID="sw" onValueChange={noop} />);
    const input = theSwitch();
    expect(input.tagName).toBe('INPUT');
    expect(input.getAttribute('aria-label')).toBe('Recommendations');
  });

  it('does not put a second role="switch" (or aria-checked) on the testID wrapper', () => {
    render(<FormSwitch value label="Recommendations" testID="sw" onValueChange={noop} />);
    const wrapper = screen.getByTestId('sw');
    expect(wrapper.getAttribute('role')).toBeNull();
    expect(wrapper.getAttribute('aria-checked')).toBeNull();
  });

  it('carries a checked state that follows value', () => {
    const { rerender } = render(<FormSwitch value label="Recommendations" testID="sw" onValueChange={noop} />);
    expect(theSwitch().checked).toBe(true);

    rerender(<FormSwitch label="Recommendations" testID="sw" value={false} onValueChange={noop} />);
    expect(theSwitch().checked).toBe(false);
  });

  it('marks the switch disabled when disabled, and not otherwise', () => {
    const { rerender } = render(<FormSwitch disabled value label="Required" testID="sw" onValueChange={noop} />);
    expect(theSwitch().disabled).toBe(true);

    rerender(<FormSwitch value label="Required" testID="sw" onValueChange={noop} />);
    expect(theSwitch().disabled).toBe(false);
  });

  it('never makes the wrapper focusable when disabled', () => {
    render(<FormSwitch disabled value label="Required" testID="sw" onValueChange={noop} />);
    expect(screen.getByTestId('sw').getAttribute('tabindex')).toBeNull();
  });

  it('leaves the input as the only tab stop when enabled', () => {
    render(<FormSwitch value label="Optional" testID="sw" onValueChange={noop} />);
    expect(screen.getByTestId('sw').getAttribute('tabindex')).toBeNull();
  });
});
