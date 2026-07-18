/**
 * ChipSelector's label used to be a LOCAL `<Text>` whose metrics drifted from `Field`'s on three
 * of four axes, so it sat misaligned next to a `FormField`. These tests lock the label to the
 * shared shell, and pin the no-label case so composing `Field` cannot introduce a phantom row.
 *
 * The pre-existing behaviour tests live in `../components.test.tsx` and are deliberately
 * untouched — they passing unmodified is the backward-compatibility evidence.
 */
import { render, screen, fireEvent } from '@testing-library/react';

import { FormField } from '../FormField/FormField';

import { ChipSelector } from './ChipSelector';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

const noop = (): void => undefined;

describe('ChipSelector label row', () => {
  it('takes its label metrics from the same shell as FormField (one implementation, not two)', () => {
    const { unmount } = render(<ChipSelector label="Pick" options={OPTIONS} value="a" onChange={noop} />);
    const chipLabel = screen.getByText(/Pick/);
    const chipClassName = chipLabel.className;
    const chipInlineStyle = chipLabel.getAttribute('style');
    unmount();

    render(<FormField label="Pick" />);
    const fieldLabel = screen.getByText(/Pick/);
    // Same emitted class + inline style => same font size, weight, colour and margin. If either
    // component ever grows its own label styles again, these diverge and this test fails.
    expect(chipClassName).toBeTruthy();
    expect(fieldLabel.className).toBe(chipClassName);
    expect(fieldLabel.getAttribute('style')).toBe(chipInlineStyle);
  });

  it('renders NO label row when no label is supplied (no phantom gap above the chips)', () => {
    render(<ChipSelector testID="chips" options={OPTIONS} value="a" onChange={noop} />);
    const shell = screen.getByTestId('chips');
    // The chip group is the shell's FIRST child — nothing is rendered above it.
    expect(shell.firstElementChild?.textContent).toBe('AlphaBeta');
    expect(shell.children).toHaveLength(1);
  });

  it('renders NO label row for an empty-string label', () => {
    render(<ChipSelector testID="chips" label="" options={OPTIONS} value="a" onChange={noop} />);
    const shell = screen.getByTestId('chips');
    expect(shell.firstElementChild?.textContent).toBe('AlphaBeta');
    expect(shell.children).toHaveLength(1);
  });

  it('renders the label row above the chips when a label IS supplied', () => {
    render(<ChipSelector testID="chips" label="Pick" options={OPTIONS} value="a" onChange={noop} />);
    const shell = screen.getByTestId('chips');
    expect(shell.firstElementChild?.textContent).toMatch(/Pick/);
    expect(shell.children).toHaveLength(2);
  });
});

describe('ChipSelector validation', () => {
  it('renders the error as a role=alert line tied to the chip group via aria-describedby', () => {
    render(<ChipSelector testID="chips" label="Pick" error="Choose one" options={OPTIONS} value="a" onChange={noop} />);
    const errorNode = screen.getByText('Choose one');
    expect(errorNode.getAttribute('role')).toBe('alert');

    const group = screen.getByTestId('chips').firstElementChild?.nextElementSibling;
    expect(group?.getAttribute('aria-describedby')).toBe(errorNode.getAttribute('id'));
    expect(group?.getAttribute('aria-invalid')).toBe('true');
  });

  it('renders an error even with no label, and still no label row', () => {
    render(<ChipSelector testID="chips" error="Choose one" options={OPTIONS} value="a" onChange={noop} />);
    const shell = screen.getByTestId('chips');
    expect(shell.children).toHaveLength(2);
    expect(shell.firstElementChild?.textContent).toBe('AlphaBeta');
    expect(screen.getByText('Choose one').getAttribute('role')).toBe('alert');
  });

  it('has no error line and no aria-invalid when there is no error', () => {
    render(<ChipSelector testID="chips" label="Pick" options={OPTIONS} value="a" onChange={noop} />);
    expect(screen.queryByRole('alert')).toBeNull();
    const group = screen.getByTestId('chips').firstElementChild?.nextElementSibling;
    expect(group?.getAttribute('aria-describedby')).toBeNull();
    expect(group?.getAttribute('aria-invalid')).toBeNull();
  });

  it('renders the decorative required asterisk, hidden from assistive tech', () => {
    render(<ChipSelector required label="Pick" options={OPTIONS} value="a" onChange={noop} />);
    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true');
  });
});

describe('ChipSelector public prop shape', () => {
  it('still accepts every documented prop together and fires onChange', () => {
    const onChange = jest.fn();
    render(
      <ChipSelector
        multiple
        containerStyle={{ marginTop: 4 }}
        disabled={false}
        label="Pick"
        options={OPTIONS}
        value={['a']}
        variant="outline"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId('chip-selector-chip-b'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('keeps working with numeric option values', () => {
    const onChange = jest.fn();
    render(
      <ChipSelector
        options={[{ value: 1, label: 'One' }, { value: 2, label: 'Two' }]}
        value={1}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId('chip-selector-chip-2'));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
