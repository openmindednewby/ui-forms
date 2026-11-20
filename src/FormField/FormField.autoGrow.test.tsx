import { render, screen } from '@testing-library/react';

import { FormField } from './FormField';

const MIN_ROWS = 8;

describe('FormField autoGrowMinRows', () => {
  it('with less text than the minimum, draws a box of the minimum rows', () => {
    const value = 'Hello';

    render(<FormField autoGrowMinRows={MIN_ROWS} label="Body" value={value} onChangeText={jest.fn()} />);

    expect(screen.getByLabelText('Body').getAttribute('rows')).toBe('8');
  });

  it('with more lines than the minimum, draws a row per line plus one spare', () => {
    const value = Array.from({ length: 12 }, () => 'line').join('\n');

    render(<FormField autoGrowMinRows={MIN_ROWS} label="Body" value={value} onChangeText={jest.fn()} />);

    expect(screen.getByLabelText('Body').getAttribute('rows')).toBe('13');
  });

  it('without the option, keeps a single-line input', () => {
    const value = 'Hello';

    render(<FormField label="Body" value={value} onChangeText={jest.fn()} />);

    expect(screen.getByLabelText('Body').tagName).toBe('INPUT');
  });
});
