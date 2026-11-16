import { fireEvent, render, screen } from '@testing-library/react';

import { RadioList } from './RadioList';

const options = [
  { value: 'approve', label: 'Approve', description: 'Session passes', hint: 'Approves' },
  { value: 'reject', label: 'Reject', description: 'Note required', hint: 'Rejects' },
];

describe('RadioList', () => {
  it('with an option pressed, calls onChange with its value', () => {
    const onChange = jest.fn();
    render(<RadioList optionTestIDPrefix="d" options={options} value={undefined} onChange={onChange} />);

    fireEvent.click(screen.getByTestId('d-reject'));

    expect(onChange).toHaveBeenCalledWith('reject');
  });

  it('with a value, marks that option checked', () => {
    render(<RadioList optionTestIDPrefix="d" options={options} value="approve" onChange={jest.fn()} />);

    const option = screen.getByTestId('d-approve');

    expect(option.getAttribute('aria-checked')).toBe('true');
  });

  it('with a description, shows it under the label', () => {
    render(<RadioList optionTestIDPrefix="d" options={options} value={undefined} onChange={jest.fn()} />);

    const description = screen.getByTestId('d-approve-description');

    expect(description.textContent).toBe('Session passes');
  });

  it('with ArrowDown on the first option, selects the next one', () => {
    const onChange = jest.fn();
    render(<RadioList optionTestIDPrefix="d" options={options} value="approve" onChange={onChange} />);

    fireEvent.keyDown(screen.getByTestId('d-approve'), { key: 'ArrowDown' });

    expect(onChange).toHaveBeenCalledWith('reject');
  });
});
