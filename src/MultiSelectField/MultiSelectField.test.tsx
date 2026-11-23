import { fireEvent, render, screen } from '@testing-library/react';

import { MultiSelectField } from './MultiSelectField';

const OPTIONS = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
  { label: 'Gamma', value: 'c' },
];

const CHIP_LABELS = { removeLabel: (optionLabel: string) => `Remove ${optionLabel}`, removeHint: 'Removes the value' };

const renderField = (values: string[], onChange: jest.Mock): void => {
  render(
    <MultiSelectField
      accessibilityHint="Pick values"
      chipLabels={CHIP_LABELS}
      label="Tags"
      options={OPTIONS}
      placeholder="Add"
      testID="tags"
      values={values}
      onChange={onChange}
    />,
  );
};

describe('MultiSelectField', () => {
  it('with two chosen values, names the trigger with the label and both choices in pick order', () => {
    renderField(['c', 'a'], jest.fn());

    const name = screen.getByTestId('tags-trigger').getAttribute('aria-label');

    expect(name).toBe('Tags: Gamma, Alpha');
  });

  it('with a chip pressed, reports the values without that chip', () => {
    const onChange = jest.fn();
    renderField(['a', 'b'], onChange);

    fireEvent.click(screen.getByTestId('tags-chip-a'));

    expect(onChange).toHaveBeenCalledWith(['b']);
  });

  it('with an option picked from the open menu, reports the values with it appended', () => {
    const onChange = jest.fn();
    renderField(['a'], onChange);
    fireEvent.click(screen.getByTestId('tags-trigger'));

    fireEvent.click(screen.getByText('Gamma'));

    expect(onChange).toHaveBeenCalledWith(['a', 'c']);
  });

  it('with the menu open, offers only the options not chosen yet', () => {
    renderField(['a'], jest.fn());

    fireEvent.click(screen.getByTestId('tags-trigger'));

    expect(screen.getAllByText('Alpha')).toHaveLength(1);
  });
});
