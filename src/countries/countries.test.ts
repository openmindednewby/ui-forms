import { DetailPlacement } from '../SearchSelect/DetailPlacement';
import { buildSearchSelectSections, toRow } from '../SearchSelect/utils/searchSelectModel';
import { COUNTRIES } from './countriesData';
import { countryFlag, countryOptions, toCountryValue } from './countryOptions';

const ISO_COUNTRY_COUNT = 249;

describe('COUNTRIES', () => {
  it('with the shipped list, holds 249 unique 2-letter codes', () => {
    const codes = COUNTRIES.map((country) => country.code);

    expect(codes).toHaveLength(ISO_COUNTRY_COUNT);
    expect(new Set(codes).size).toBe(ISO_COUNTRY_COUNT);
    expect(codes.every((code) => /^[A-Z]{2}$/.test(code))).toBe(true);
  });
});

describe('country search', () => {
  it('with the code "de" typed, lists Germany first', () => {
    const sections = buildSearchSelectSections(countryOptions(), 'de', []);

    expect(sections.flat[0]?.label).toBe('Germany');
  });

  it('with part of the name typed, finds the country', () => {
    const sections = buildSearchSelectSections(countryOptions(), 'cypr', []);

    expect(sections.flat.map((o) => o.value)).toEqual(['CY']);
  });
});

describe('countryOptions row', () => {
  it('with a country, shows the name with the code at the end', () => {
    const germany = countryOptions().find((o) => o.value === 'DE');

    const row = germany === undefined ? null : toRow(germany, DetailPlacement.End);

    expect(row).toEqual({ primary: 'Germany', secondary: 'DE', placement: DetailPlacement.End });
  });
});

describe('countryFlag', () => {
  it('with CY, returns the Cyprus flag', () => {
    const flag = countryFlag('cy');

    expect(flag).toBe('\u{1F1E8}\u{1F1FE}');
  });
});

describe('toCountryValue', () => {
  it('with a typed country name, stores nothing', () => {
    const value = toCountryValue('Germany');

    expect(value).toBe('');
  });

  it('with a lower-case known code, stores the upper-case code', () => {
    const value = toCountryValue(' de ');

    expect(value).toBe('DE');
  });
});
