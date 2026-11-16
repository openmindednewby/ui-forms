import { fireEvent, render, screen } from '@testing-library/react';

import { GatedChecklist } from './GatedChecklist';
import { isChecklistComplete } from './isChecklistComplete';

const items = [
  { id: 'doc', label: 'Document matches' },
  { id: 'face', label: 'Face matches' },
];

const slotGate = (checked: string[]): boolean | undefined => {
  const slot = jest.fn((_complete: boolean) => null);
  render(<GatedChecklist checked={checked} items={items} testID="gc" title="Checks" onToggle={jest.fn()}>{slot}</GatedChecklist>);
  return slot.mock.calls[0]?.[0];
};

describe('isChecklistComplete', () => {
  it.each([
    [[], false],
    [['doc'], false],
    [['doc', 'face'], true],
    [['face', 'doc', 'extra'], true],
  ])('with %p checked, returns %p', (checked, expected) => {
    const complete = isChecklistComplete(items, checked);

    expect(complete).toBe(expected);
  });

  it('with no items, returns true', () => {
    const complete = isChecklistComplete([], []);

    expect(complete).toBe(true);
  });
});

describe('GatedChecklist', () => {
  it('with an unchecked item, pressing it calls onToggle with its id', () => {
    const onToggle = jest.fn();
    render(<GatedChecklist checked={[]} items={items} testID="gc" title="Checks" onToggle={onToggle} />);

    fireEvent.click(screen.getByTestId('gc-item-face'));

    expect(onToggle).toHaveBeenCalledWith('face');
  });

  it('with items left unchecked, passes an incomplete gate to the slot', () => {
    const checked = ['doc'];

    const complete = slotGate(checked);

    expect(complete).toBe(false);
  });

  it('with every item checked, passes a complete gate to the slot', () => {
    const checked = ['doc', 'face'];

    const complete = slotGate(checked);

    expect(complete).toBe(true);
  });
});
