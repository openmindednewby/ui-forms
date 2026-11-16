import { render, screen } from '@testing-library/react';

import { ActionBar, actionBarPosition } from './ActionBar';

describe('actionBarPosition', () => {
  it.each([
    [true, 'web', 'sticky'],
    [true, 'ios', 'relative'],
    [false, 'web', 'relative'],
  ])('with sticky %p on %p, returns %p', (sticky, os, expected) => {
    const position = actionBarPosition(sticky, os);

    expect(position).toBe(expected);
  });
});

describe('ActionBar', () => {
  it('with a message, shows it as status text', () => {
    render(<ActionBar message="2 checks need you" testID="bar">{null}</ActionBar>);

    const text = screen.getByTestId('bar-message');

    expect(text.textContent).toBe('2 checks need you');
  });

  it('with no message, renders only the actions', () => {
    render(<ActionBar testID="bar">{null}</ActionBar>);

    const text = screen.queryByTestId('bar-message');

    expect(text).toBeNull();
  });
});
