import { addValue, remainingOptions, removeValue, selectedOptions } from './multiSelectValues';

const OPTIONS = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
  { label: 'Gamma', value: 'c' },
];

describe('addValue', () => {
  it('with a new value, appends it at the end', () => {
    const values = ['b'];

    const next = addValue(values, 'a');

    expect(next).toEqual(['b', 'a']);
  });

  it('with a value already chosen, keeps the list unchanged', () => {
    const values = ['a', 'b'];

    const next = addValue(values, 'a');

    expect(next).toEqual(['a', 'b']);
  });
});

describe('removeValue', () => {
  it('with a chosen value, drops only that value', () => {
    const values = ['a', 'b', 'c'];

    const next = removeValue(values, 'b');

    expect(next).toEqual(['a', 'c']);
  });
});

describe('selectedOptions', () => {
  it('with values in pick order and one unknown, returns known options in pick order', () => {
    const values = ['c', 'gone', 'a'];

    const chosen = selectedOptions(OPTIONS, values);

    expect(chosen.map((option) => option.label)).toEqual(['Gamma', 'Alpha']);
  });
});

describe('remainingOptions', () => {
  it('with one chosen value, returns the others in option order', () => {
    const values = ['b'];

    const remaining = remainingOptions(OPTIONS, values);

    expect(remaining.map((option) => option.value)).toEqual(['a', 'c']);
  });
});
