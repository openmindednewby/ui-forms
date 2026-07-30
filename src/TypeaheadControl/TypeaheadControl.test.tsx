import { fireEvent, render, screen } from '@testing-library/react';

import { TypeaheadControl } from './TypeaheadControl';

const OPTIONS = [
  { label: 'Cyprus', value: 'CY' },
  { label: 'Canada', value: 'CA' },
  { label: 'Central African Republic', value: 'CF' },
];

const TID = 'ta';
const INPUT = `${TID}-input`;
const MENU = `${TID}-menu`;

function renderTypeahead(
  overrides: Partial<React.ComponentProps<typeof TypeaheadControl>> = {},
): { onChange: jest.Mock; rerender: (value: string) => void } {
  const onChange = jest.fn();
  const props = { accessibilityLabel: 'Country', options: OPTIONS, testID: TID, value: '', onChange, ...overrides };
  const { rerender } = render(<TypeaheadControl {...props} />);
  return {
    onChange,
    rerender: (value: string) => rerender(<TypeaheadControl {...props} value={value} />),
  };
}

describe('TypeaheadControl — suggestions', () => {
  it('surfaces nothing until the user types', () => {
    renderTypeahead();
    fireEvent.focus(screen.getByTestId(INPUT));
    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('surfaces matches once typing starts', () => {
    const { rerender } = renderTypeahead();
    fireEvent.focus(screen.getByTestId(INPUT));
    fireEvent.change(screen.getByTestId(INPUT), { target: { value: 'ca' } });
    rerender('ca');
    expect(screen.getByTestId(`${TID}-option-CA`)).toBeTruthy();
  });

  it('HIDES the menu once the value is an exact option label — nothing left to disambiguate', () => {
    const { rerender } = renderTypeahead();
    fireEvent.focus(screen.getByTestId(INPUT));
    fireEvent.change(screen.getByTestId(INPUT), { target: { value: 'Cyprus' } });
    rerender('Cyprus');
    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('respects maxSuggestions', () => {
    const { rerender } = renderTypeahead({ maxSuggestions: 1 });
    fireEvent.focus(screen.getByTestId(INPUT));
    fireEvent.change(screen.getByTestId(INPUT), { target: { value: 'c' } });
    rerender('c');
    expect(screen.getAllByRole('menuitem')).toHaveLength(1);
  });

  it('respects minChars — a query shorter than the floor surfaces nothing', () => {
    const { rerender } = renderTypeahead({ minChars: 3 });
    fireEvent.focus(screen.getByTestId(INPUT));
    fireEvent.change(screen.getByTestId(INPUT), { target: { value: 'ca' } });
    rerender('ca');
    expect(screen.queryByTestId(MENU)).toBeNull();
  });
});

describe('TypeaheadControl — menu stacking (portal)', () => {
  it('PORTALS the open menu to document.body so no ancestor stacking context / overflow can hide it', () => {
    const { rerender } = renderTypeahead();
    fireEvent.focus(screen.getByTestId(INPUT));
    fireEvent.change(screen.getByTestId(INPUT), { target: { value: 'ca' } });
    rerender('ca');
    // The whole point of the fix: the menu is not nested in the anchor subtree (where RN-web would
    // trap its z-index under later siblings) — it is a direct child of document.body.
    expect(screen.getByTestId(MENU).parentElement).toBe(document.body);
    // ...and therefore NOT a descendant of the input's own field container.
    const input = screen.getByTestId(INPUT);
    expect(input.parentElement?.contains(screen.getByTestId(MENU))).toBe(false);
  });
});

describe('TypeaheadControl — open on focus (minChars 0)', () => {
  it('surfaces the option list on focus with an empty box when minChars is 0 (click-to-open)', () => {
    renderTypeahead({ minChars: 0 });
    expect(screen.queryByTestId(MENU)).toBeNull();
    fireEvent.focus(screen.getByTestId(INPUT));
    // With no text yet, focusing shows the ranked full list rather than nothing.
    expect(screen.getByTestId(MENU)).toBeTruthy();
    expect(screen.getByTestId(`${TID}-option-CA`)).toBeTruthy();
  });
});

describe('TypeaheadControl — picking', () => {
  it('fills the canonical LABEL, not the option value', () => {
    // The load-bearing behaviour: the box holds human text the caller normalises later.
    // A control that emitted `CY` here would look correct in a value map and wrong on screen.
    const { onChange, rerender } = renderTypeahead();
    fireEvent.focus(screen.getByTestId(INPUT));
    fireEvent.change(screen.getByTestId(INPUT), { target: { value: 'cy' } });
    rerender('cy');
    fireEvent.click(screen.getByTestId(`${TID}-option-CY`));
    expect(onChange).toHaveBeenLastCalledWith('Cyprus');
    expect(onChange).not.toHaveBeenLastCalledWith('CY');
  });

  it('closes the menu after a pick', () => {
    const { rerender } = renderTypeahead();
    fireEvent.focus(screen.getByTestId(INPUT));
    fireEvent.change(screen.getByTestId(INPUT), { target: { value: 'cy' } });
    rerender('cy');
    fireEvent.click(screen.getByTestId(`${TID}-option-CY`));
    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('preserves FREE typing — every keystroke is emitted verbatim', () => {
    const { onChange } = renderTypeahead();
    fireEvent.change(screen.getByTestId(INPUT), { target: { value: 'not-a-country' } });
    expect(onChange).toHaveBeenCalledWith('not-a-country');
  });
});

describe('TypeaheadControl — error banner', () => {
  it('renders a persistent role=alert banner carrying the pre-localized message', () => {
    renderTypeahead({ error: 'Unrecognised country' });
    const err = screen.getByTestId(`${TID}-error`);
    expect(err.textContent).toBe('Unrecognised country');
    expect(err.getAttribute('role')).toBe('alert');
  });

  it('renders NO banner for an absent or empty error', () => {
    renderTypeahead({ error: '' });
    expect(screen.queryByTestId(`${TID}-error`)).toBeNull();
  });
});

describe('TypeaheadControl — submit', () => {
  it('calls onSubmit on Enter', () => {
    const onSubmit = jest.fn();
    renderTypeahead({ onSubmit });
    fireEvent.keyDown(screen.getByTestId(INPUT), { key: 'Enter', keyCode: 13, charCode: 13 });
    expect(onSubmit).toHaveBeenCalled();
  });

  it('does not throw on Enter when no onSubmit is supplied', () => {
    renderTypeahead();
    expect(() => {
      fireEvent.keyDown(screen.getByTestId(INPUT), { key: 'Enter', keyCode: 13, charCode: 13 });
    }).not.toThrow();
  });
});
