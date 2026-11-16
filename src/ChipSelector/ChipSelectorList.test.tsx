import { fireEvent, render, screen } from '@testing-library/react';

import { ChipSelector } from './ChipSelector';
import { listOptionLabel } from './utils/listOptionLabel';

const options = [
  { value: 'approve', label: 'Approve', description: 'Session passes' },
  { value: 'reject', label: 'Reject', description: 'Note required' },
];

describe('listOptionLabel', () => {
  it('with a description, joins label and description for the accessible name', () => {
    const option = { value: 'a', label: 'Approve', description: 'Session passes' };

    const name = listOptionLabel(option);

    expect(name).toBe('Approve, Session passes');
  });

  it('with no description, returns the label', () => {
    const option = { value: 'a', label: 'Approve' };

    const name = listOptionLabel(option);

    expect(name).toBe('Approve');
  });
});

describe('ChipSelector list variant', () => {
  it('with a radio list, pressing an option calls onChange with its value', () => {
    const onChange = jest.fn();
    render(<ChipSelector chipTestIDPrefix="d" options={options} singleSelectRole="radio" value="" variant="list" onChange={onChange} />);

    fireEvent.click(screen.getByTestId('d-reject'));

    expect(onChange).toHaveBeenCalledWith('reject');
  });

  it('with a radio list, marks the selected option checked', () => {
    render(<ChipSelector chipTestIDPrefix="d" options={options} singleSelectRole="radio" value="approve" variant="list" onChange={jest.fn()} />);

    const option = screen.getByTestId('d-approve');

    expect(option.getAttribute('aria-checked')).toBe('true');
  });

  it('with a description, shows it under the label', () => {
    render(<ChipSelector chipTestIDPrefix="d" options={options} value="" variant="list" onChange={jest.fn()} />);

    const description = screen.getByTestId('d-approve-description');

    expect(description.textContent).toBe('Session passes');
  });
});
