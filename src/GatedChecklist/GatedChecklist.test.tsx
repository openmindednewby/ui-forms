import { fireEvent, render, screen } from '@testing-library/react';

import { GatedChecklist } from './GatedChecklist';
import { isChecklistComplete } from './isChecklistComplete';

const items = [
  { id: 'doc', label: 'Document matches' },
  { id: 'face', label: 'Face matches' },
];

const submit = (onPress: () => void): { label: string; hint: string; onPress: () => void } => ({ label: 'Submit', hint: 'Sends', onPress });

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

  it('with items left unchecked, pressing submit does not call it', () => {
    const onPress = jest.fn();
    render(<GatedChecklist checked={['doc']} items={items} submit={submit(onPress)} testID="gc" title="Checks" onToggle={jest.fn()} />);

    fireEvent.click(screen.getByTestId('gc-submit'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('with every item checked, pressing submit calls it', () => {
    const onPress = jest.fn();
    render(<GatedChecklist checked={['doc', 'face']} items={items} submit={submit(onPress)} testID="gc" title="Checks" onToggle={jest.fn()} />);

    fireEvent.click(screen.getByTestId('gc-submit'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('with a children slot, passes whether the list is complete', () => {
    const slot = jest.fn((_complete: boolean) => null);
    render(<GatedChecklist checked={['doc']} items={items} testID="gc" title="Checks" onToggle={jest.fn()}>{slot}</GatedChecklist>);

    const complete = slot.mock.calls[0]?.[0];

    expect(complete).toBe(false);
  });
});
