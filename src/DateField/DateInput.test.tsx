import { fireEvent, render, screen } from '@testing-library/react';

import { DateInput } from './DateInput';
import { Field } from '../Field/Field';

const TEST_ID = 'booked-on';

function renderInput(onChange: jest.Mock = jest.fn()): void {
  render(
    <Field label="Booked on" labelVariant="control" testID="wrap">
      {(context) => (
        <DateInput
          context={context}
          fieldProps={{ accessibilityHint: 'Pick a date', label: 'Booked on', testID: TEST_ID, value: '', onChange }}
        />
      )}
    </Field>,
  );
}

describe('DateInput', () => {
  it('inside a Field, renders one native date input', () => {
    renderInput();

    expect(screen.getByTestId(TEST_ID).getAttribute('type')).toBe('date');
  });

  it('inside a Field, shows only the Field label, never a second one', () => {
    renderInput();

    expect(screen.getAllByText('Booked on')).toHaveLength(1);
  });

  it('with a date picked, emits the ISO value', () => {
    const onChange = jest.fn();
    renderInput(onChange);

    fireEvent.change(screen.getByTestId(TEST_ID), { target: { value: '2024-03-05' } });

    expect(onChange).toHaveBeenCalledWith('2024-03-05');
  });
});
