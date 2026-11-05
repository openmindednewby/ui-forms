import React from 'react';

import { render, screen } from '@testing-library/react';

import { Field } from '../Field/Field';

import { TypeaheadControl } from './TypeaheadControl';

const TID = 'ta';
const INPUT = `${TID}-input`;
const OPTIONS = [{ label: 'Cyprus', value: 'CY' }];

function control(): React.ReactElement {
  return <TypeaheadControl accessibilityLabel="Country" options={OPTIONS} testID={TID} value="" onChange={jest.fn()} />;
}

describe('TypeaheadControl inside a Field', () => {
  it('with a Field label, the label targets the input', () => {
    render(<Field label="Country">{control()}</Field>);

    const input = screen.getByTestId(INPUT);

    expect(input.id).not.toBe('');
    expect(document.querySelector(`label[for="${input.id}"]`)).not.toBeNull();
  });

  it('with a Field hint, the input is described by the hint line', () => {
    render(<Field hint="Type a name">{control()}</Field>);

    const input = screen.getByTestId(INPUT);

    expect(input.getAttribute('aria-describedby')).toBe(screen.getByText('Type a name').id);
  });
});

describe('TypeaheadControl browser autofill', () => {
  it('with no caller setting, turns the browser suggestions off', () => {
    render(control());

    const input = screen.getByTestId(INPUT);

    expect(input.getAttribute('autocomplete')).toBe('off');
  });
});
