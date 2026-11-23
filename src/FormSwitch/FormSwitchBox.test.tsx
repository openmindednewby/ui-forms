import { fireEvent, render, screen } from '@testing-library/react';

import { FormSwitch } from './FormSwitch';

const WCAG_MIN_TARGET_PX = 44;
const noop = (): void => undefined;

describe('FormSwitch box variant', () => {
  it('with a press anywhere on the box, toggles once to the opposite value', () => {
    const onValueChange = jest.fn();
    render(<FormSwitch label="Monitoring on" testID="sw" value={false} variant="box" onValueChange={onValueChange} />);

    fireEvent.click(screen.getByTestId('sw'));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('with disabled set, ignores a press on the box', () => {
    const onValueChange = jest.fn();
    render(<FormSwitch disabled value label="Monitoring on" testID="sw" variant="box" onValueChange={onValueChange} />);

    fireEvent.click(screen.getByTestId('sw'));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('with the box look, keeps a hit box of at least 44 px tall', () => {
    render(<FormSwitch value label="Monitoring on" testID="sw" variant="box" onValueChange={noop} />);

    const box = getComputedStyle(screen.getByTestId('sw'));

    expect(parseFloat(box.minHeight)).toBeGreaterThanOrEqual(WCAG_MIN_TARGET_PX);
  });

  it('with the box look, exposes exactly one switch and keeps the box out of the tab order', () => {
    render(<FormSwitch value label="Monitoring on" stateLabel="On" testID="sw" variant="box" onValueChange={noop} />);

    const switches = screen.getAllByRole('switch');

    expect(switches).toHaveLength(1);
    expect(switches[0]?.getAttribute('aria-label')).toBe('Monitoring on');
    expect(screen.getByTestId('sw').getAttribute('tabindex')).toBe('-1');
  });

  it('with a stateLabel, shows it inside the box beside the switch', () => {
    render(<FormSwitch value label="Monitoring on" stateLabel="On" testID="sw" variant="box" onValueChange={noop} />);

    const box = screen.getByTestId('sw');

    expect(box.textContent).toBe('On');
  });

  it('with no variant, ignores stateLabel and keeps the row look', () => {
    render(<FormSwitch value label="Monitoring on" stateLabel="On" testID="sw" onValueChange={noop} />);

    const row = screen.getByTestId('sw');

    expect(row.textContent).toBe('Monitoring on');
  });
});
