import { defaultDecisionVariant, leadFirst, validateDecision } from './decisionRules';

const outcomes = [
  { value: 'approve', label: 'Approve', hint: 'h' },
  { value: 'correct', label: 'Request correction', hint: 'h' },
  { value: 'reject', label: 'Reject', hint: 'h', noteRequired: true },
];

describe('validateDecision', () => {
  it('with no outcome chosen, returns the choose error', () => {
    const error = validateDecision(outcomes, '', '');

    expect(error).toBe('choose');
  });

  it('with a note-required outcome and a blank note, returns the note error', () => {
    const error = validateDecision(outcomes, 'reject', '   ');

    expect(error).toBe('note');
  });

  it('with a note-required outcome and a note, returns null', () => {
    const error = validateDecision(outcomes, 'reject', 'Forged document');

    expect(error).toBeNull();
  });

  it('with an outcome that needs no note and a blank note, returns null', () => {
    const error = validateDecision(outcomes, 'approve', '');

    expect(error).toBeNull();
  });

  it('with an unknown outcome, returns the choose error', () => {
    const error = validateDecision(outcomes, 'escalate', 'x');

    expect(error).toBe('choose');
  });
});

describe('defaultDecisionVariant', () => {
  it.each([
    [360, 'choose-then-submit'],
    [767, 'choose-then-submit'],
    [768, 'sticky-bar'],
    [1280, 'sticky-bar'],
  ])('with a width of %p, returns %p', (width, expected) => {
    const variant = defaultDecisionVariant(width);

    expect(variant).toBe(expected);
  });
});

describe('leadFirst', () => {
  it('with a lead outcome, moves it to the front and keeps the rest in order', () => {
    const ordered = leadFirst(outcomes, 'correct');

    expect(ordered.map((o) => o.value)).toEqual(['correct', 'approve', 'reject']);
  });

  it('with no lead outcome, keeps the order', () => {
    const ordered = leadFirst(outcomes, undefined);

    expect(ordered.map((o) => o.value)).toEqual(['approve', 'correct', 'reject']);
  });
});
