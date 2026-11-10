import { fireEvent, render, screen } from '@testing-library/react';

import { AddOnRequest, isAddOnOpen } from './AddOnRequest';

const renderGroup = (hasValue: boolean, onRemove: () => void = jest.fn()): void => {
  render(
    <AddOnRequest
      addHint="Adds a subtitle"
      addLabel="Add subtitle"
      hasValue={hasValue}
      removeHint="Removes the subtitle"
      removeLabel="Remove"
      testID="sub"
      onRemove={onRemove}
    >
      <span data-testid="sub-field" />
    </AddOnRequest>,
  );
};

describe('isAddOnOpen', () => {
  it.each([
    [false, false, false],
    [true, false, true],
    [false, true, true],
    [true, true, true],
  ])('with hasValue %p and requested %p, returns %p', (hasValue, requested, expected) => {
    const open = isAddOnOpen(hasValue, requested);

    expect(open).toBe(expected);
  });
});

describe('AddOnRequest', () => {
  it('with no value, pressing Add reveals the fields', () => {
    renderGroup(false);

    fireEvent.click(screen.getByTestId('sub-add'));

    expect(screen.getByTestId('sub-field')).toBeTruthy();
    expect(screen.queryByTestId('sub-add')).toBeNull();
  });

  it('with a requested group, pressing Remove calls onRemove and shows Add again', () => {
    const onRemove = jest.fn();
    renderGroup(false, onRemove);
    fireEvent.click(screen.getByTestId('sub-add'));

    fireEvent.click(screen.getByTestId('sub-remove'));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('sub-add')).toBeTruthy();
  });

  it('with a value, opens on the fields without Add', () => {
    renderGroup(true);

    const field = screen.queryByTestId('sub-field');

    expect(field).toBeTruthy();
    expect(screen.queryByTestId('sub-add')).toBeNull();
  });
});
