import { render, screen } from '@testing-library/react';

import { SelectField } from './SelectField';

const OPTIONS = [
  { label: 'Paid', value: 'paid' },
  { label: 'Draft', value: 'draft' },
];

const nameFor = (value: string): string | null => {
  render(
    <SelectField accessibilityHint="Pick" label="Status" options={OPTIONS} testID="status" value={value} onChange={jest.fn()} />,
  );
  return screen.getByTestId('status-trigger').getAttribute('aria-label');
};

describe('SelectField', () => {
  it('with a known value, names the control with the label and the selection', () => {
    const value = 'draft';

    const name = nameFor(value);

    expect(name).toBe('Status: Draft');
  });

  it('with an unknown value, names the control with the label and no selection', () => {
    const value = 'gone';

    const name = nameFor(value);

    expect(name).toBe('Status: ');
  });

  it('with the caption label variant, renders the label at 12 px uppercase', () => {
    render(
      <SelectField accessibilityHint="Pick" label="Status" labelVariant="caption" options={OPTIONS} testID="status" value="paid" onChange={jest.fn()} />,
    );

    const label = screen.getByText('Status');

    expect(getComputedStyle(label)).toMatchObject({ fontSize: '12px', textTransform: 'uppercase' });
  });
});
