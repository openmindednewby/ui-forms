/**
 * Integration of `useRadioKeyboard` through the rendered ChipSelector (RNW 0.21 + jsdom): the
 * pure key logic is pinned in `utils/radioKeyboard.test.ts`; these prove the group-level
 * `onKeyDown`, focus moves and roving tabindex actually reach the DOM for both variants, and that
 * button / multi-select groups are untouched.
 */
import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { ChipSelector } from '../ChipSelector';
import type { ChipVariant } from '../types';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

const chip = (value: string): HTMLElement => screen.getByTestId(`chip-selector-chip-${value}`);

interface HarnessProps {
  initial: string;
  onChange: (value: string) => void;
  variant?: ChipVariant;
  disabled?: boolean;
}

/** Controlled wrapper, so a selection made from the keyboard re-renders the roving tab stop. */
function Harness({ initial, onChange, variant, disabled }: HarnessProps): React.ReactElement {
  const [value, setValue] = React.useState(initial);
  const handleChange = (next: string): void => {
    onChange(next);
    setValue(next);
  };
  return (
    <ChipSelector
      disabled={disabled}
      options={OPTIONS}
      singleSelectRole="radio"
      value={value}
      variant={variant}
      onChange={handleChange}
    />
  );
}

describe.each<ChipVariant>(['solid', 'outline'])('ChipSelector radio keyboard (%s variant)', (variant) => {
  it('activates the focused radio chip with Space', () => {
    const onChange = jest.fn();
    render(<Harness initial="a" variant={variant} onChange={onChange} />);
    fireEvent.keyDown(chip('b'), { key: ' ' });
    expect(onChange).toHaveBeenCalledWith('b');
    expect(chip('b').getAttribute('aria-checked')).toBe('true');
  });

  it('moves focus AND selection to the next chip on ArrowRight / ArrowDown', () => {
    const onChange = jest.fn();
    render(<Harness initial="a" variant={variant} onChange={onChange} />);
    act(() => chip('a').focus());
    fireEvent.keyDown(chip('a'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('b');
    expect(document.activeElement).toBe(chip('b'));
    fireEvent.keyDown(chip('b'), { key: 'ArrowDown' });
    expect(onChange).toHaveBeenLastCalledWith('c');
    expect(document.activeElement).toBe(chip('c'));
  });

  it('wraps: ArrowRight on the last chip selects the first, ArrowLeft / ArrowUp on the first the last', () => {
    const onChange = jest.fn();
    render(<Harness initial="c" variant={variant} onChange={onChange} />);
    fireEvent.keyDown(chip('c'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('a');
    expect(document.activeElement).toBe(chip('a'));
    fireEvent.keyDown(chip('a'), { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('c');
    fireEvent.keyDown(chip('c'), { key: 'ArrowUp' });
    expect(onChange).toHaveBeenLastCalledWith('b');
  });

  it('keeps exactly one tab stop, following the selection', () => {
    render(<Harness initial="b" variant={variant} onChange={jest.fn()} />);
    expect(['a', 'b', 'c'].map((v) => chip(v).getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
    fireEvent.keyDown(chip('b'), { key: 'ArrowRight' });
    expect(['a', 'b', 'c'].map((v) => chip(v).getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);
  });

  it('makes the first chip the tab stop when nothing is selected', () => {
    render(<Harness initial="" variant={variant} onChange={jest.fn()} />);
    expect(['a', 'b', 'c'].map((v) => chip(v).getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('ignores the keyboard pattern when the group is disabled', () => {
    const onChange = jest.fn();
    render(<Harness disabled initial="a" variant={variant} onChange={onChange} />);
    fireEvent.keyDown(chip('a'), { key: 'ArrowRight' });
    fireEvent.keyDown(chip('a'), { key: ' ' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not double-fire Enter (left to the RNW press responder)', () => {
    const onChange = jest.fn();
    render(<Harness initial="a" variant={variant} onChange={onChange} />);
    fireEvent.keyDown(chip('b'), { key: 'Enter' });
    fireEvent.keyUp(chip('b'), { key: 'Enter' });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('ChipSelector keyboard outside radio mode is unchanged', () => {
  it('does not handle arrow keys or rove tabindex for a default (button) single-select group', () => {
    const onChange = jest.fn();
    render(<ChipSelector options={OPTIONS} value="a" onChange={onChange} />);
    fireEvent.keyDown(chip('a'), { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
    expect(['a', 'b', 'c'].map((v) => chip(v).getAttribute('tabindex'))).not.toContain('-1');
  });

  it('does not handle arrow keys or rove tabindex for a multi-select group', () => {
    const onChange = jest.fn();
    render(<ChipSelector multiple options={OPTIONS} singleSelectRole="radio" value={['a']} onChange={onChange} />);
    fireEvent.keyDown(chip('a'), { key: 'ArrowDown' });
    expect(onChange).not.toHaveBeenCalled();
    expect(['a', 'b', 'c'].map((v) => chip(v).getAttribute('tabindex'))).not.toContain('-1');
  });
});
