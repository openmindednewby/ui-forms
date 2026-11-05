import React, { createRef, useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import type { TextInput } from 'react-native';

import { TypeaheadControl } from './TypeaheadControl';

const TID = 'ta';
const INPUT = `${TID}-input`;
const OPTIONS = [
  { label: 'Canada', value: 'CA' },
  { label: 'Central African Republic', value: 'CF' },
  { label: 'Cyprus', value: 'CY' },
];

function Harness({ onSubmit }: { onSubmit?: () => void }): React.ReactElement {
  const [value, setValue] = useState('');
  return <TypeaheadControl accessibilityLabel="Country" options={OPTIONS} testID={TID} value={value} onChange={setValue} onSubmit={onSubmit} />;
}

function openList(): HTMLElement {
  const input = screen.getByTestId(INPUT);
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'c' } });
  return input;
}

function press(input: HTMLElement, key: string): void {
  fireEvent.keyDown(input, { key });
}

describe('TypeaheadControl keyboard', () => {
  it('with Down pressed twice, highlights the second row', () => {
    render(<Harness />);
    const input = openList();

    press(input, 'ArrowDown');
    press(input, 'ArrowDown');

    expect(input.getAttribute('aria-activedescendant')).toBe(`${TID}-option-CF`);
    expect(screen.getByTestId(`${TID}-option-CF`).getAttribute('aria-selected')).toBe('true');
  });

  it('with Up pressed and nothing highlighted, highlights the last row', () => {
    render(<Harness />);
    const input = openList();

    press(input, 'ArrowUp');

    expect(input.getAttribute('aria-activedescendant')).toBe(`${TID}-option-CY`);
  });

  it('with a row highlighted, Enter picks it and does not submit', () => {
    const onSubmit = jest.fn();
    render(<Harness onSubmit={onSubmit} />);
    const input = openList();
    press(input, 'ArrowDown');

    press(input, 'Enter');

    expect((input as HTMLInputElement).value).toBe('Canada');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('with no row highlighted, Enter submits and closes the list', () => {
    const onSubmit = jest.fn();
    render(<Harness onSubmit={onSubmit} />);
    const input = openList();

    press(input, 'Enter');

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId(`${TID}-menu`)).toBeNull();
  });

  it('with the list open, Esc closes it and keeps the text', () => {
    render(<Harness />);
    const input = openList();

    press(input, 'Escape');

    expect(screen.queryByTestId(`${TID}-menu`)).toBeNull();
    expect((input as HTMLInputElement).value).toBe('c');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('TypeaheadControl combobox roles', () => {
  it('with the list open, the input controls a named listbox of option rows', () => {
    render(<Harness />);

    const input = openList();

    const listbox = screen.getByRole('listbox');
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-controls')).toBe(listbox.id);
    expect(listbox.getAttribute('aria-label')).toBe('Country');
    expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length);
  });

  it('with the list closed, the input names no popup', () => {
    render(<Harness />);

    const input = screen.getByTestId(INPUT);

    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-controls')).toBeNull();
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });
});

describe('TypeaheadControl ref', () => {
  it('with a ref attached, focus() lands on the input', () => {
    const ref = createRef<TextInput>();
    render(<TypeaheadControl ref={ref} accessibilityLabel="Country" options={OPTIONS} testID={TID} value="" onChange={jest.fn()} />);

    ref.current?.focus();

    expect(document.activeElement).toBe(screen.getByTestId(INPUT));
  });
});
