import { fireEvent, render, screen } from '@testing-library/react';

import { SelectControl } from './SelectControl';

const OPTIONS = [
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
];

function renderNative(overrides: Partial<React.ComponentProps<typeof SelectControl>> = {}): jest.Mock {
  const onChange = jest.fn();
  render(
    <SelectControl
      native
      accessibilityHint="Filters the list by status"
      accessibilityLabel="Status: Open"
      options={OPTIONS}
      testID="sel"
      value="open"
      onChange={onChange}
      {...overrides}
    />,
  );
  return onChange;
}

describe('SelectControl native', () => {
  it('with native on web, renders a real select element under the trigger testID', () => {
    renderNative();

    const trigger = screen.getByTestId('sel-trigger');

    expect(trigger.tagName).toBe('SELECT');
  });

  it('with a changed native option, calls onChange with the option value', () => {
    const onChange = renderNative();

    fireEvent.change(screen.getByTestId('sel-trigger'), { target: { value: 'closed' } });

    expect(onChange).toHaveBeenCalledWith('closed');
  });

  it('with an accessible label and hint, puts them on the select', () => {
    renderNative({ accessibilityLabel: 'Status: Closed', value: 'closed', labelledById: 'status-label' });

    const trigger = screen.getByTestId('sel-trigger');

    expect([trigger.getAttribute('aria-label'), trigger.getAttribute('title'), trigger.getAttribute('aria-labelledby')]).toEqual(['Status: Closed', 'Filters the list by status', 'status-label']);
  });

  it('with a value matching no option, shows the placeholder as the selected option', () => {
    renderNative({ value: '', placeholder: 'Any status' });

    const trigger = screen.getByTestId('sel-trigger') as HTMLSelectElement;

    expect(trigger.selectedOptions[0]?.textContent).toBe('Any status');
  });

  it('without native, keeps the menu trigger', () => {
    renderNative({ native: false });

    const trigger = screen.getByTestId('sel-trigger');

    expect(trigger.tagName).not.toBe('SELECT');
  });
});
