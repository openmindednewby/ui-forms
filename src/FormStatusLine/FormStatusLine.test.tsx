import { render, screen } from '@testing-library/react';

import { FormStatusLine } from './FormStatusLine';

describe('FormStatusLine', () => {
  it('with a message, announces it as an alert', () => {
    render(<FormStatusLine message="Sent" testID="s" />);

    const line = screen.getByTestId('s');

    expect(line.getAttribute('role')).toBe('alert');
    expect(line.textContent).toBe('Sent');
  });

  it.each([null, undefined, ''])('with the message %p, renders nothing', (message) => {
    render(<FormStatusLine message={message} testID="s" />);

    const line = screen.queryByTestId('s');

    expect(line).toBeNull();
  });
});
