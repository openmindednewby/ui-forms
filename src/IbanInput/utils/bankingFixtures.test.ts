import { readFileSync } from 'fs';
import { join } from 'path';

import { validateBic } from './bic';
import { validateIban } from './iban';

interface Fixture {
  input: string;
  rejection: string;
  electronic: string | null;
  expectedLength?: number;
}

const fixtures = JSON.parse(readFileSync(join(__dirname, '../data/bankingFixtures.json'), 'utf8')) as { iban: Fixture[]; bic: Fixture[] };

describe('validateIban', () => {
  it.each(fixtures.iban)('with the shared fixture %j, gives the backend verdict', (fixture) => {
    const verdict = validateIban(fixture.input);

    expect(verdict.rejection).toBe(fixture.rejection);
    expect(verdict.electronic).toBe(fixture.electronic);
    expect(verdict.expectedLength).toBe(fixture.expectedLength ?? null);
  });

  it('with null, refuses it as missing', () => {
    const verdict = validateIban(null);

    expect(verdict.rejection).toBe('Missing');
  });
});

describe('validateBic', () => {
  it.each(fixtures.bic)('with the shared fixture %j, gives the backend verdict', (fixture) => {
    const verdict = validateBic(fixture.input);

    expect(verdict.rejection).toBe(fixture.rejection);
    expect(verdict.electronic).toBe(fixture.electronic);
  });
});
