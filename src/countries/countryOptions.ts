import type { ControlOption } from '../controls/controlTypes';
import { COUNTRIES } from './countriesData';
import type { Country } from './country';

const REGIONAL_INDICATOR_A = 0x1f1e6;
const CODE_A = 65;
const TWO_LETTERS = /^[A-Z]{2}$/;
const KNOWN_CODES = new Set(COUNTRIES.map((country) => country.code));

/** Countries as select options: name as the label, the 2-letter code as value and detail. */
export function countryOptions(list: readonly Country[] = COUNTRIES): ControlOption[] {
  return list.map((country) => ({ label: country.name, value: country.code, detail: country.code }));
}

/** The flag emoji for a 2-letter code, or '' for anything else. */
export function countryFlag(code: string): string {
  const upper = code.toUpperCase();
  if (!TWO_LETTERS.test(upper)) return '';
  return String.fromCodePoint(...Array.from(upper, (letter) => REGIONAL_INDICATOR_A + letter.charCodeAt(0) - CODE_A));
}

/** The stored value for an input: a known 2-letter code in upper case, else ''. */
export function toCountryValue(input: string): string {
  const upper = input.trim().toUpperCase();
  return KNOWN_CODES.has(upper) ? upper : '';
}
