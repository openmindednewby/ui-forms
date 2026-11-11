import { countryFieldOptions } from './countryOptions';

describe('countryFieldOptions', () => {
  it('with a none label, leads with an empty-value choice before the countries', () => {
    const countries = [{ code: 'CY', name: 'Cyprus' }];

    const options = countryFieldOptions(countries, 'No country');

    expect(options.map((option) => option.value)).toEqual(['', 'CY']);
    expect(options[0]?.label).toBe('No country');
  });

  it('without a none label, lists only the countries', () => {
    const countries = [{ code: 'CY', name: 'Cyprus' }];

    const options = countryFieldOptions(countries);

    expect(options.map((option) => option.value)).toEqual(['CY']);
  });
});
