import { draftBic, draftIban, ibanCounter } from './ibanFormat';

describe('draftIban', () => {
  it('with lower-case input, groups in fours and upper-cases', () => {
    const draft = draftIban('cy170020012');

    expect(draft.display).toBe('CY17 0020 012');
  });

  it('with spaces and dashes typed, stores the value with no separators', () => {
    const draft = draftIban('DE89 3704-0044 0532 0130 00');

    expect(draft.electronic).toBe('DE89370400440532013000');
  });

  it('with a known country, counts typed against the registered length', () => {
    const draft = draftIban('CY1700200128');

    expect(ibanCounter(draft)).toBe('12 / 28');
  });

  it('with no country yet, shows no counter and no ghost', () => {
    const draft = draftIban('C');

    expect(ibanCounter(draft)).toBeNull();
    expect(draft.ghost).toBe('');
  });

  it('with part of a German IBAN typed, the ghost shows the grouped rest', () => {
    const draft = draftIban('DE8937');

    expect(draft.display + draft.ghost).toBe('DE89 3700 0000 0000 0000 00');
  });

  it('with more characters than the country allows, caps at the registered length', () => {
    const draft = draftIban('DE8937040044053201300099');

    expect(draft.electronic).toBe('DE89370400440532013000');
  });

  it('with the country prefix typed, reports it apart', () => {
    const draft = draftIban('fr14');

    expect(draft.country).toBe('FR');
  });
});

describe('draftBic', () => {
  it('with lower-case input, upper-cases and caps at 11', () => {
    const draft = draftBic('deutdeff500xx');

    expect(draft.value).toBe('DEUTDEFF500');
  });

  it('with 6 characters typed, ghosts the 2 required and the 3 optional branch characters', () => {
    const draft = draftBic('DEUTDE');

    expect(draft.ghost).toBe('XX');
    expect(draft.branchGhost).toBe('XXX');
  });

  it('with 9 characters typed, ghosts the 2 branch characters still owed', () => {
    const draft = draftBic('DEUTDEFF5');

    expect(draft.ghost).toBe('');
    expect(draft.branchGhost).toBe('XX');
  });
});
