import { isUnmatched, suggestOptions } from './suggestOptions';

const OPTIONS = [
  { label: 'Cyprus', value: 'CY' },
  { label: 'Canada', value: 'CA' },
  { label: 'Central African Republic', value: 'CF' },
  { label: 'Republic of Korea', value: 'KR' },
];

const MIN = 1;
const LIMIT = 8;

describe('suggestOptions — ranking', () => {
  it('ranks a VALUE-exact hit above every label hit', () => {
    const [first] = suggestOptions(OPTIONS, 'cy', MIN, LIMIT);
    expect(first.value).toBe('CY');
  });

  it('ranks a label PREFIX above a label CONTAINS', () => {
    // "Republic of Korea" starts with the needle; "Central African Republic" merely contains it.
    const ranked = suggestOptions(OPTIONS, 'republic', MIN, LIMIT).map((o) => o.value);
    expect(ranked.indexOf('KR')).toBeLessThan(ranked.indexOf('CF'));
  });

  it('breaks ties by label, alphabetically', () => {
    // Canada / Central African Republic both rank as value-prefix on "c"… but Cyprus's VALUE
    // also prefixes, so all three tie at the same rank and sort by label.
    const ranked = suggestOptions(OPTIONS, 'c', MIN, LIMIT).map((o) => o.label);
    expect(ranked).toEqual([...ranked].sort((a, b) => a.localeCompare(b)));
  });

  it('is case-insensitive on both sides', () => {
    expect(suggestOptions(OPTIONS, 'CYPRUS', MIN, LIMIT)[0].value).toBe('CY');
  });
});

describe('suggestOptions — gating', () => {
  it('returns nothing below minChars', () => {
    expect(suggestOptions(OPTIONS, 'c', 2, LIMIT)).toEqual([]);
  });

  it('counts TRIMMED length against minChars', () => {
    // "  c  " is one character of intent, not five.
    expect(suggestOptions(OPTIONS, '  c  ', 2, LIMIT)).toEqual([]);
  });

  it('caps at limit', () => {
    expect(suggestOptions(OPTIONS, 'c', MIN, 2)).toHaveLength(2);
  });

  it('returns nothing for a needle matching no option', () => {
    expect(suggestOptions(OPTIONS, 'zzz', MIN, LIMIT)).toEqual([]);
  });
});

describe('isUnmatched', () => {
  it('is false for empty text — an unfilled box is not an error', () => {
    expect(isUnmatched(OPTIONS, '')).toBe(false);
    expect(isUnmatched(OPTIONS, '   ')).toBe(false);
  });

  it('is false for an exact VALUE or an exact LABEL, case-insensitively', () => {
    expect(isUnmatched(OPTIONS, 'cy')).toBe(false);
    expect(isUnmatched(OPTIONS, 'CYPRUS')).toBe(false);
  });

  it('is true for a PARTIAL match — "Cypr" is not a country', () => {
    expect(isUnmatched(OPTIONS, 'Cypr')).toBe(true);
  });

  it('is true for text matching nothing', () => {
    expect(isUnmatched(OPTIONS, 'Atlantis')).toBe(true);
  });
});
