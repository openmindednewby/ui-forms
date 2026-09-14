import { radioKeyTarget, radioTabIndex } from './radioKeyboard';

const COUNT = 3;
const LAST = COUNT - 1;

describe('radioKeyTarget — WAI-ARIA radio group keys', () => {
  it.each([' ', 'Spacebar'])('activates the focused chip on Space (%j)', (key) => {
    expect(radioKeyTarget(key, 1, COUNT)).toBe(1);
  });

  it.each(['ArrowRight', 'ArrowDown'])('moves to the next chip on %s', (key) => {
    expect(radioKeyTarget(key, 0, COUNT)).toBe(1);
  });

  it.each(['ArrowLeft', 'ArrowUp'])('moves to the previous chip on %s', (key) => {
    expect(radioKeyTarget(key, LAST, COUNT)).toBe(1);
  });

  it('wraps from the last chip to the first going forward', () => {
    expect(radioKeyTarget('ArrowRight', LAST, COUNT)).toBe(0);
    expect(radioKeyTarget('ArrowDown', LAST, COUNT)).toBe(0);
  });

  it('wraps from the first chip to the last going backward', () => {
    expect(radioKeyTarget('ArrowLeft', 0, COUNT)).toBe(LAST);
    expect(radioKeyTarget('ArrowUp', 0, COUNT)).toBe(LAST);
  });

  it('leaves Enter to the RNW press responder (null, so onChange is not fired twice)', () => {
    expect(radioKeyTarget('Enter', 0, COUNT)).toBeNull();
  });

  it('ignores keys outside the pattern', () => {
    expect(radioKeyTarget('Tab', 0, COUNT)).toBeNull();
    expect(radioKeyTarget('a', 0, COUNT)).toBeNull();
  });

  it('ignores a key whose target is not a registered chip', () => {
    expect(radioKeyTarget('ArrowRight', -1, COUNT)).toBeNull();
    expect(radioKeyTarget(' ', COUNT, COUNT)).toBeNull();
  });

  it('does not move in a one-chip group, but Space still activates it', () => {
    expect(radioKeyTarget('ArrowRight', 0, 1)).toBeNull();
    expect(radioKeyTarget(' ', 0, 1)).toBe(0);
  });
});

describe('radioTabIndex — roving tab stop', () => {
  it('makes only the selected chip a tab stop', () => {
    expect([0, 1, 2].map((index) => radioTabIndex(index, 1, false))).toEqual([-1, 0, -1]);
  });

  it('falls back to the first chip when nothing is selected', () => {
    expect([0, 1, 2].map((index) => radioTabIndex(index, -1, false))).toEqual([0, -1, -1]);
  });

  it('removes every chip from the tab order when the group is disabled', () => {
    expect([0, 1, 2].map((index) => radioTabIndex(index, 1, true))).toEqual([-1, -1, -1]);
  });
});
