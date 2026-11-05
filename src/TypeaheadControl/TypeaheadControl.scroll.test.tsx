import React, { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { TypeaheadControl, type TypeaheadSearch } from './TypeaheadControl';

const TID = 'ta';
const INPUT = `${TID}-input`;
const SEARCH: TypeaheadSearch = {
  load: () => Promise.resolve([]),
  onPick: () => undefined,
  loadingText: 'Searching',
  emptyText: 'No patterns match',
  errorText: 'Search failed',
};

function Harness({ search }: { search: TypeaheadSearch }): React.ReactElement {
  const [value, setValue] = useState('');
  return <TypeaheadControl accessibilityLabel="Pattern" search={search} testID={TID} value={value} onChange={setValue} />;
}

describe('TypeaheadControl focus scroll', () => {
  it('with too little room under the field for the list, scrolls the field to the top below the given margin', () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    window.innerWidth = 1280;
    window.innerHeight = 200;
    render(<Harness search={{ ...SEARCH, scrollMarginTop: 64 }} />);

    fireEvent.focus(screen.getByTestId(INPUT));

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    expect(screen.getByTestId(INPUT).parentElement?.style.scrollMarginTop).toBe('64px');
  });

  it('with room for the list under the field, scrolls only as far as needed', () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    window.innerWidth = 360;
    window.innerHeight = 800;
    render(<Harness search={SEARCH} />);

    fireEvent.focus(screen.getByTestId(INPUT));

    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest' });
  });

  it('with the on-screen keyboard taking the room after focus, scrolls the field to the top', () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    window.innerWidth = 1280;
    const viewport = Object.assign(new EventTarget(), { height: 640, offsetTop: 0 });
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: viewport });
    render(<Harness search={SEARCH} />);
    fireEvent.focus(screen.getByTestId(INPUT));

    act(() => {
      viewport.height = 200;
      viewport.dispatchEvent(new Event('resize'));
    });

    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'start' });
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: undefined });
  });
});
