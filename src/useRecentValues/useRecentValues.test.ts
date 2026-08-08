import { renderHook, act } from '@testing-library/react';

import {
  computeNextRecents,
  readRecents,
  recentStorageKey,
  writeRecents,
} from './recentValuesCore';
import { useRecentValues } from './useRecentValues';

// jsdom provides a real `window.localStorage`, so the web storage path is exercised end-to-end.
// Each test starts from a clean slate.
beforeEach(() => {
  window.localStorage.clear();
});

const KEY = 'search';
const STORAGE_KEY = recentStorageKey(KEY);

describe('computeNextRecents (pure list algebra)', () => {
  it('caps the list at max, dropping the oldest', () => {
    const seeded = ['e', 'd', 'c', 'b', 'a'];
    const next = computeNextRecents(seeded, 'f', 3);
    expect(next).toEqual(['f', 'e', 'd']);
  });

  it('de-dupes case-insensitively and promotes the existing value to the front', () => {
    const seeded = ['alpha', 'beta', 'gamma'];
    const next = computeNextRecents(seeded, 'BETA', 10);
    // One 'beta' only, now at the front, keeping the newly-typed casing.
    expect(next).toEqual(['BETA', 'alpha', 'gamma']);
  });

  it('ignores an empty / whitespace-only value, returning the list unchanged', () => {
    const seeded = ['alpha', 'beta'];
    expect(computeNextRecents(seeded, '', 10)).toEqual(seeded);
    expect(computeNextRecents(seeded, '   ', 10)).toEqual(seeded);
  });

  it('trims surrounding whitespace before storing', () => {
    expect(computeNextRecents([], '  hello  ', 10)).toEqual(['hello']);
  });
});

describe('readRecents (corruption tolerance)', () => {
  it('returns [] when the stored JSON is corrupt', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(readRecents(KEY)).toEqual([]);
  });

  it('returns [] when the parsed value is not an array', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ a: 1 }));
    expect(readRecents(KEY)).toEqual([]);
  });

  it('keeps only string entries from a mixed array', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['a', 2, null, 'b']));
    expect(readRecents(KEY)).toEqual(['a', 'b']);
  });

  it('returns [] when the key is absent', () => {
    expect(readRecents('never-written')).toEqual([]);
  });
});

describe('storage helpers with no window (native / SSR)', () => {
  it('are silent no-ops that return [] when window is undefined', () => {
    const originalWindow = global.window;
    // Simulate a native / SSR environment where there is no window at all.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- deliberate teardown of the global for this case
    delete (global as any).window;
    try {
      expect(readRecents(KEY)).toEqual([]);
      // Must not throw despite there being nowhere to write.
      expect(() => writeRecents(KEY, ['a'])).not.toThrow();
    } finally {
      global.window = originalWindow;
    }
  });
});

describe('useRecentValues', () => {
  it('starts empty and persists a remembered value across a fresh mount', () => {
    const first = renderHook(() => useRecentValues(KEY));
    expect(first.result.current.recents).toEqual([]);

    act(() => first.result.current.remember('cyprus'));
    expect(first.result.current.recents).toEqual(['cyprus']);

    // A brand-new hook instance re-hydrates from storage.
    const second = renderHook(() => useRecentValues(KEY));
    expect(second.result.current.recents).toEqual(['cyprus']);
  });

  it('promotes a repeated value and caps at max', () => {
    const { result } = renderHook(() => useRecentValues(KEY, 3));
    act(() => result.current.remember('a'));
    act(() => result.current.remember('b'));
    act(() => result.current.remember('c'));
    act(() => result.current.remember('d')); // pushes 'a' out
    expect(result.current.recents).toEqual(['d', 'c', 'b']);

    act(() => result.current.remember('c')); // promote existing
    expect(result.current.recents).toEqual(['c', 'd', 'b']);
  });

  it('ignores empty submissions', () => {
    const { result } = renderHook(() => useRecentValues(KEY));
    act(() => result.current.remember('   '));
    expect(result.current.recents).toEqual([]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('clear() empties the list and removes it from storage', () => {
    const { result } = renderHook(() => useRecentValues(KEY));
    act(() => result.current.remember('x'));
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    act(() => result.current.clear());
    expect(result.current.recents).toEqual([]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('tolerates a corrupt stored list on mount, seeding from []', () => {
    window.localStorage.setItem(STORAGE_KEY, 'not-json');
    const { result } = renderHook(() => useRecentValues(KEY));
    expect(result.current.recents).toEqual([]);
  });
});
