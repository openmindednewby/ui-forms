import { groupAriaChecked, resolveGroupSelection, toggleGroupSelection } from './groupSelection';

const PS = ['ps5', 'ps4'];
const NIN = ['switch2', 'switch'];
const ORDER = ['ps5', 'ps4', 'switch2', 'switch'];

describe('resolveGroupSelection', () => {
  it('reports nothing selected as neither all nor some', () => {
    expect(resolveGroupSelection([], PS)).toEqual({ all: false, some: false });
  });

  it('reports a partially selected group as mixed', () => {
    expect(resolveGroupSelection(['ps5'], PS)).toEqual({ all: false, some: true });
  });

  it('reports a fully selected group as all, never as some', () => {
    expect(resolveGroupSelection(['ps4', 'ps5'], PS)).toEqual({ all: true, some: false });
  });

  it('ignores selected keys outside the group', () => {
    expect(resolveGroupSelection(['switch', 'switch2'], PS)).toEqual({ all: false, some: false });
  });

  it('treats an empty group as neither all nor some', () => {
    expect(resolveGroupSelection(['ps5'], [])).toEqual({ all: false, some: false });
  });
});

describe('groupAriaChecked', () => {
  it('maps the three states to true / mixed / false', () => {
    expect(groupAriaChecked({ all: true, some: false })).toBe(true);
    expect(groupAriaChecked({ all: false, some: true })).toBe('mixed');
    expect(groupAriaChecked({ all: false, some: false })).toBe(false);
  });
});

describe('toggleGroupSelection', () => {
  it('selects the whole group when nothing in it is selected', () => {
    expect(toggleGroupSelection([], PS, ORDER)).toEqual(['ps5', 'ps4']);
  });

  it('completes the group from a partial selection rather than clearing it', () => {
    expect(toggleGroupSelection(['ps4'], PS, ORDER)).toEqual(['ps5', 'ps4']);
  });

  it('clears the group only when every key in it is selected', () => {
    expect(toggleGroupSelection(['ps5', 'ps4'], PS, ORDER)).toEqual([]);
  });

  it('leaves keys outside the group untouched in both directions', () => {
    expect(toggleGroupSelection(['switch'], PS, ORDER)).toEqual(['ps5', 'ps4', 'switch']);
    expect(toggleGroupSelection(['ps5', 'ps4', 'switch'], PS, ORDER)).toEqual(['switch']);
  });

  it('sorts the result into the canonical order when one is given', () => {
    expect(toggleGroupSelection(['switch'], NIN, ORDER)).toEqual(['switch2', 'switch']);
  });

  it('appends in group order when no canonical order is given', () => {
    expect(toggleGroupSelection(['switch'], NIN)).toEqual(['switch', 'switch2']);
  });

  it('does not mutate the selection it was given', () => {
    const selection = ['ps5'];
    toggleGroupSelection(selection, PS, ORDER);
    expect(selection).toEqual(['ps5']);
  });

  it('selects and clears every key when the group is the whole set', () => {
    expect(toggleGroupSelection([], ORDER, ORDER)).toEqual(ORDER);
    expect(toggleGroupSelection(ORDER, ORDER, ORDER)).toEqual([]);
  });
});
