/**
 * `recentValuesCore` — the pure + storage-facing internals of {@link useRecentValues}, kept out of
 * the hook file so the list algebra (trim / de-dupe / promote / cap) and the `localStorage` access
 * are each unit-testable in isolation.
 *
 * ## RN-web storage reality
 *
 * `ui-forms` runs on react-native-web, so a component using this may mount on web (where
 * `window.localStorage` exists), on native (where it does NOT), or under SSR / a hardened browser
 * where touching `window.localStorage` THROWS (disabled cookies, privacy mode, quota). Every access
 * therefore goes through {@link getStorage}, which returns `null` rather than throwing, and every
 * read/write is wrapped so a storage failure degrades to an in-memory-only no-op instead of
 * exploding inside render. On native / when storage is unavailable the feature is simply inert and
 * the recents list is always `[]`.
 */

/** The single namespace every persisted list lives under, so one product can never collide with another. */
const STORAGE_PREFIX = '@dloizides/ui-forms:recent:';

/** Default cap on remembered values (most-recent-first). */
export const DEFAULT_MAX_RECENTS = 10;

/** The full `localStorage` key for a caller's logical `key`. */
export function recentStorageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

/**
 * The active web `localStorage`, or `null` on native / SSR / when merely READING the property
 * throws (some browsers throw on `window.localStorage` access when storage is disabled). Never
 * throws — callers treat `null` as "storage unavailable, no-op".
 */
function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    const storage = window.localStorage;
    return storage !== null && storage !== undefined ? storage : null;
  } catch {
    return null;
  }
}

/**
 * Read the persisted list for `key`. Returns `[]` when storage is unavailable, the key is absent,
 * the stored JSON is corrupt, or the parsed value is not an array of strings — corruption is
 * tolerated, never surfaced as a throw.
 */
export function readRecents(key: string): string[] {
  const storage = getStorage();
  if (storage === null) return [];
  try {
    const raw = storage.getItem(recentStorageKey(key));
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === 'string');
  } catch {
    return [];
  }
}

/** Persist `values` for `key`. Silent no-op when storage is unavailable or the write throws (quota). */
export function writeRecents(key: string, values: readonly string[]): void {
  const storage = getStorage();
  if (storage === null) return;
  try {
    storage.setItem(recentStorageKey(key), JSON.stringify(values));
  } catch {
    // Quota exceeded / storage disabled mid-session — drop the write rather than throw into render.
  }
}

/** Remove the persisted list for `key`. Silent no-op when storage is unavailable or removal throws. */
export function clearRecents(key: string): void {
  const storage = getStorage();
  if (storage === null) return;
  try {
    storage.removeItem(recentStorageKey(key));
  } catch {
    // Storage disabled mid-session — nothing to do.
  }
}

/**
 * The pure list algebra: fold `value` into `current`, returning the new most-recent-first list.
 *
 * - trims `value`; an empty (or whitespace-only) value is ignored, returning `current` unchanged;
 * - de-dupes case-insensitively, so "Cyprus" typed after "cyprus" does not create a second row;
 * - PROMOTES an existing (case-insensitive) match to the front, keeping the newly-typed casing;
 * - caps the result at `max` (most-recent-first), so the list can never grow without bound.
 */
export function computeNextRecents(current: readonly string[], value: string, max: number): string[] {
  const trimmed = value.trim();
  if (trimmed === '') return [...current];
  const lower = trimmed.toLowerCase();
  const withoutMatch = current.filter((entry) => entry.toLowerCase() !== lower);
  const promoted = [trimmed, ...withoutMatch];
  const cap = max > 0 ? max : 0;
  return promoted.slice(0, cap);
}

/** True when two lists hold the same values in the same order (reference-stability guard for state). */
export function recentsEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((entry, index) => entry === b[index]);
}
