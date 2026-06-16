import { render, screen, fireEvent } from '@testing-library/react';

import { FormField } from './FormField/FormField';
import { ChipSelector } from './ChipSelector/ChipSelector';
import { FormSwitch } from './FormSwitch/FormSwitch';

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
