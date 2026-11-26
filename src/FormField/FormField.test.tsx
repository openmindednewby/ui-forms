import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';

import { FormField } from './FormField';

describe('FormField labelHidden', () => {
  it('renders the visible label by default', () => {
    render(<FormField label="Search" testID="fld" />);
    // The visible label text is present in the DOM.
    expect(screen.getByText('Search')).toBeTruthy();
  });

  it('hides the visible label but keeps the accessible name when labelHidden', () => {
    render(<FormField label="Search" labelHidden testID="fld" />);
    // No VISIBLE label row…
    expect(screen.queryByText('Search')).toBeNull();
    // …but the input still exposes the name to assistive tech (aria-label on web).
    expect(screen.getByLabelText('Search')).toBeTruthy();
  });

  it('keeps the accessible name reachable by role+name when the label is hidden', () => {
    render(<FormField label="Search name, phone or email" labelHidden testID="fld" />);
    const input = screen.getByLabelText('Search name, phone or email');
    expect(input.getAttribute('aria-label')).toBe('Search name, phone or email');
  });
});

describe('FormField icon', () => {
  it('with an icon, draws it inside the field and leaves room before the text', () => {
    const icon = <Text>Q</Text>;

    render(<FormField icon={icon} label="Request ID" />);

    expect({ icon: screen.getByTestId('form-field-icon').textContent, pad: getComputedStyle(screen.getByTestId('form-field-input')).paddingLeft }).toEqual({ icon: 'Q', pad: '36px' });
  });
});
