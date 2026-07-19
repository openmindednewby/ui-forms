import { DEFAULT_OPTIONAL_LABEL, resolveFieldMarker } from './fieldMarkers';

describe('resolveFieldMarker', () => {
  it('yields none when neither flag is set', () => {
    expect(resolveFieldMarker(false, false)).toBe('none');
  });

  it('yields required for required alone and optional for optional alone', () => {
    expect(resolveFieldMarker(true, false)).toBe('required');
    expect(resolveFieldMarker(false, true)).toBe('optional');
  });

  /**
   * The contract makes the two markers MUTUALLY EXCLUSIVE. Exclusivity is resolved (not type-
   * enforced) so a caller spreading a computed props object still gets one defined marker.
   */
  it('resolves the both-set conflict to required, the safe direction', () => {
    // Showing "optional" on a field the server rejects sends the user into a failed submit;
    // showing "required" on an optional field costs, at worst, one keystroke.
    expect(resolveFieldMarker(true, true)).toBe('required');
  });

  it('never returns both markers — the result is always exactly one of three', () => {
    const combos: Array<[boolean, boolean]> = [
      [false, false],
      [true, false],
      [false, true],
      [true, true],
    ];
    for (const [required, optional] of combos)
      expect(['none', 'required', 'optional']).toContain(resolveFieldMarker(required, optional));
  });
});

describe('DEFAULT_OPTIONAL_LABEL', () => {
  it('is exported so the English fallback is greppable and overridable', () => {
    // The package ships no i18n runtime; this is the one user-visible string in it, and it exists
    // solely so a single-locale app can adopt `optional` in one line.
    expect(DEFAULT_OPTIONAL_LABEL).toBe('(optional)');
  });
});
