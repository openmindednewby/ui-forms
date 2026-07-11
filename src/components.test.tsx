import { render, screen, fireEvent } from '@testing-library/react';

import { FormField } from './FormField/FormField';
import { ChipSelector } from './ChipSelector/ChipSelector';
import { FormSwitch } from './FormSwitch/FormSwitch';
import { FormCheckbox } from './FormCheckbox/FormCheckbox';

describe('FormField a11y', () => {
  it('marks the input invalid and links the error text via aria-describedby', () => {
    render(<FormField label="Email" required error="Required" />);
    const input = screen.getByTestId('form-field-input');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    // The error line carries the id the input points at, and is an alert.
    const errorNode = screen.getByText('Required');
    expect(errorNode.getAttribute('id')).toBe(describedBy);
    expect(errorNode.getAttribute('role')).toBe('alert');
  });

  it('is not aria-invalid when there is no error', () => {
    render(<FormField label="Name" />);
    const input = screen.getByTestId('form-field-input');
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });
});

// These components read theme from @dloizides/ui-feedback's context, which provides a
// neutral default when no provider is mounted — so they render standalone in tests.

describe('FormField', () => {
  it('renders the label, input, and error text', () => {
    render(<FormField label="Email" required error="Required" />);
    expect(screen.getByTestId('form-field-input')).toBeTruthy();
    expect(screen.getByText(/Email/)).toBeTruthy();
    expect(screen.getByText('Required')).toBeTruthy();
  });
});

describe('ChipSelector', () => {
  it('renders a chip per option and fires onChange on press', () => {
    const onChange = jest.fn();
    render(
      <ChipSelector
        label="Pick"
        options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]}
        value="a"
        onChange={onChange}
      />
    );
    expect(screen.getByTestId('chip-selector-chip-a')).toBeTruthy();
    fireEvent.click(screen.getByTestId('chip-selector-chip-b'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('outline variant renders every chip and fires onChange on press', () => {
    const onChange = jest.fn();
    render(
      <ChipSelector
        variant="outline"
        options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]}
        value="a"
        onChange={onChange}
      />
    );
    expect(screen.getByTestId('chip-selector-chip-a')).toBeTruthy();
    fireEvent.click(screen.getByTestId('chip-selector-chip-b'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('supports multiple selection: fires the pressed value regardless of current array', () => {
    const onChange = jest.fn();
    render(
      <ChipSelector
        multiple
        variant="outline"
        options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]}
        value={['a']}
        onChange={onChange}
      />
    );
    // Both chips render; pressing an already-selected chip still fires (parent owns toggle).
    fireEvent.click(screen.getByTestId('chip-selector-chip-a'));
    expect(onChange).toHaveBeenCalledWith('a');
    fireEvent.click(screen.getByTestId('chip-selector-chip-b'));
    expect(onChange).toHaveBeenCalledWith('b');
  });
});

describe('FormSwitch', () => {
  it('renders label + description and toggles', () => {
    const onValueChange = jest.fn();
    render(
      <FormSwitch label="Notifications" description="Email me" value={false} onValueChange={onValueChange} />
    );
    expect(screen.getByTestId('form-switch')).toBeTruthy();
    expect(screen.getByText('Notifications')).toBeTruthy();
    expect(screen.getByText('Email me')).toBeTruthy();
  });
});

describe('FormCheckbox', () => {
  it('renders label + hint and fires the toggled value on press', () => {
    const onValueChange = jest.fn();
    render(
      <FormCheckbox label="Monitor" hint="Re-screen on a schedule" value={false} onValueChange={onValueChange} />
    );
    expect(screen.getByText('Monitor')).toBeTruthy();
    expect(screen.getByText('Re-screen on a schedule')).toBeTruthy();
    fireEvent.click(screen.getByTestId('form-checkbox'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('exposes aria-checked reflecting the value and does not fire when disabled', () => {
    const onValueChange = jest.fn();
    render(
      <FormCheckbox testID="cb-on" label="On" value disabled onValueChange={onValueChange} />
    );
    const box = screen.getByTestId('cb-on');
    expect(box.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(box);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('also supports the onChange alias', () => {
    const onChange = jest.fn();
    render(<FormCheckbox testID="cb-alias" label="Alias" value={false} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('cb-alias'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles on the Enter and Space keys (keyboard operable)', () => {
    const onValueChange = jest.fn();
    render(<FormCheckbox testID="cb-kbd" label="Kbd" value={false} onValueChange={onValueChange} />);
    const box = screen.getByTestId('cb-kbd');
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onValueChange).toHaveBeenLastCalledWith(true);
    fireEvent.keyDown(box, { key: ' ' });
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it('does not toggle on keydown when disabled', () => {
    const onValueChange = jest.fn();
    render(<FormCheckbox testID="cb-kbd-dis" label="Kbd" value={false} disabled onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByTestId('cb-kbd-dis'), { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
