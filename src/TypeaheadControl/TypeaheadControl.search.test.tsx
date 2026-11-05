import React, { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { TypeaheadControl, type TypeaheadSearch } from './TypeaheadControl';

const TID = 'ta';
const INPUT = `${TID}-input`;
const MENU = `${TID}-menu`;
const DEBOUNCE_MS = 250;
const SHORT_MS = 249;
const MIN_CHARS = 2;
const ROSE = { label: 'Rose', value: 'r1', detail: 'Peyote, cuff' };
const IRIS = { label: 'Iris', value: 'i1' };

type Load = TypeaheadSearch['load'];

function buildSearch(load: Load, onPick: TypeaheadSearch['onPick'] = jest.fn()): TypeaheadSearch {
  return { load, onPick, loadingText: 'Searching', emptyText: 'No patterns match', errorText: 'Search failed' };
}

function mockLoad(rows: readonly { label: string; value: string }[]): jest.Mock<ReturnType<Load>, Parameters<Load>> {
  return jest.fn<ReturnType<Load>, Parameters<Load>>().mockResolvedValue(rows);
}

function Harness({ search }: { search: TypeaheadSearch }): React.ReactElement {
  const [value, setValue] = useState('');
  return <TypeaheadControl accessibilityLabel="Pattern" minChars={MIN_CHARS} search={search} testID={TID} value={value} onChange={setValue} />;
}

function typeText(text: string): void {
  const input = screen.getByTestId(INPUT);
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: text } });
}

async function advance(ms: number): Promise<void> {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });
}

function inputValue(): string {
  return (screen.getByTestId(INPUT) as HTMLInputElement).value;
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('TypeaheadControl search debounce', () => {
  it('with typing inside the 250 ms window, does not search yet', async () => {
    const load = mockLoad([ROSE]);
    render(<Harness search={buildSearch(load)} />);

    typeText('ro');
    await advance(SHORT_MS);

    expect(load).not.toHaveBeenCalled();
  });

  it('with two quick edits, searches once with the last text', async () => {
    const load = mockLoad([ROSE]);
    render(<Harness search={buildSearch(load)} />);

    typeText('ro');
    typeText('ros');
    await advance(DEBOUNCE_MS);

    expect(load).toHaveBeenCalledTimes(1);
    expect(load.mock.calls[0][0]).toBe('ros');
  });

  it('with text shorter than minChars, never searches', async () => {
    const load = mockLoad([ROSE]);
    render(<Harness search={buildSearch(load)} />);

    typeText('r');
    await advance(DEBOUNCE_MS);

    expect(load).not.toHaveBeenCalled();
  });
});

describe('TypeaheadControl stale responses', () => {
  it('with the older response landing last, keeps the newer rows and aborts the older call', async () => {
    const resolvers: ((rows: readonly { label: string; value: string }[]) => void)[] = [];
    const load = jest.fn<ReturnType<Load>, Parameters<Load>>(() => new Promise((resolve) => { resolvers.push(resolve); }));
    render(<Harness search={buildSearch(load)} />);
    typeText('ro');
    await advance(DEBOUNCE_MS);
    typeText('ros');
    await advance(DEBOUNCE_MS);

    await act(async () => {
      resolvers[1]([ROSE]);
      resolvers[0]([{ label: 'Stale', value: 's1' }]);
      await jest.advanceTimersByTimeAsync(0);
    });

    expect(screen.getByTestId(`${TID}-option-r1`)).toBeTruthy();
    expect(screen.queryByTestId(`${TID}-option-s1`)).toBeNull();
    expect(load.mock.calls[0][1].aborted).toBe(true);
  });
});

describe('TypeaheadControl status text', () => {
  it('with a search in flight, shows the loading text', async () => {
    const load = jest.fn<ReturnType<Load>, Parameters<Load>>(() => new Promise(() => undefined));
    render(<Harness search={buildSearch(load)} />);

    typeText('ro');
    await advance(DEBOUNCE_MS);

    expect(screen.getByTestId(MENU).textContent).toContain('Searching');
  });

  it('with no results, shows the empty text and no listbox', async () => {
    const load = mockLoad([]);
    render(<Harness search={buildSearch(load)} />);

    typeText('zz');
    await advance(DEBOUNCE_MS);

    expect(screen.getByTestId(MENU).textContent).toContain('No patterns match');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByTestId(INPUT).getAttribute('aria-expanded')).toBe('false');
  });

  it('with a failing search, shows the error text and keeps the typed text', async () => {
    const load = jest.fn<ReturnType<Load>, Parameters<Load>>().mockRejectedValue(new Error('down'));
    render(<Harness search={buildSearch(load)} />);

    typeText('ro');
    await advance(DEBOUNCE_MS);

    expect(screen.getByTestId(MENU).textContent).toContain('Search failed');
    expect(inputValue()).toBe('ro');
  });
});

describe('TypeaheadControl picking from search', () => {
  it('with a row clicked, shows the label and reports the whole option', async () => {
    const onPick = jest.fn();
    render(<Harness search={buildSearch(mockLoad([ROSE]), onPick)} />);
    typeText('ro');
    await advance(DEBOUNCE_MS);

    fireEvent.click(screen.getByTestId(`${TID}-option-r1`));

    expect(inputValue()).toBe('Rose');
    expect(onPick).toHaveBeenLastCalledWith(ROSE);
    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('with the text edited after a pick, clears the pick', async () => {
    const onPick = jest.fn();
    render(<Harness search={buildSearch(mockLoad([ROSE]), onPick)} />);
    typeText('ro');
    await advance(DEBOUNCE_MS);
    fireEvent.click(screen.getByTestId(`${TID}-option-r1`));

    fireEvent.change(screen.getByTestId(INPUT), { target: { value: 'Rosy' } });

    expect(onPick).toHaveBeenLastCalledWith(null);
  });

  it('with a pick already made, refocusing does not search again', async () => {
    const load = mockLoad([ROSE]);
    render(<Harness search={buildSearch(load)} />);
    typeText('ro');
    await advance(DEBOUNCE_MS);
    fireEvent.click(screen.getByTestId(`${TID}-option-r1`));

    fireEvent.focus(screen.getByTestId(INPUT));
    await advance(DEBOUNCE_MS);

    expect(load).toHaveBeenCalledTimes(1);
  });

  it('with maxResults set, renders only that many rows', async () => {
    render(<Harness search={{ ...buildSearch(mockLoad([ROSE, IRIS])), maxResults: 1 }} />);

    typeText('ro');
    await advance(DEBOUNCE_MS);

    expect(screen.getAllByRole('option')).toHaveLength(1);
  });
});

describe('TypeaheadControl focus scroll', () => {
  it('with a search field focused at a phone width, scrolls the field to the top below the given margin', () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    window.innerWidth = 360;
    render(<Harness search={{ ...buildSearch(mockLoad([])), scrollMarginTop: 64 }} />);

    fireEvent.focus(screen.getByTestId(INPUT));

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    expect(screen.getByTestId(INPUT).parentElement?.style.scrollMarginTop).toBe('64px');
  });

  it('with a search field focused at a desktop width, scrolls only as far as needed', () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    window.innerWidth = 1280;
    render(<Harness search={buildSearch(mockLoad([]))} />);

    fireEvent.focus(screen.getByTestId(INPUT));

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
  });
});

describe('TypeaheadControl input testID', () => {
  it('with search.inputTestID given, the input carries exactly that id', () => {
    render(<Harness search={{ ...buildSearch(mockLoad([])), inputTestID: 'jinx-report-pattern' }} />);

    const input = screen.getByTestId('jinx-report-pattern');

    expect(input.getAttribute('role')).toBe('combobox');
  });
});
