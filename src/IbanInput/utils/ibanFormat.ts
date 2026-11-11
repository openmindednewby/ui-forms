import { IBAN_MAX_LENGTH, ibanLengthFor } from '../data/ibanCountryLengths';

const NOT_ALPHANUMERIC = /[^A-Za-z0-9]/g;
const COUNTRY_PREFIX = /^[A-Z]{2}/;
const COUNTRY_LENGTH = 2;
const BIC8_LENGTH = 8;
const BIC11_LENGTH = 11;
const BRANCH_LENGTH = 3;
const DEFAULT_GHOST = '0';
const DEFAULT_BIC_GHOST = 'X';

/** What an IBAN field shows while typing: stored form, grouped display, counter and ghost tail. */
export interface IbanDraft {
  readonly electronic: string;
  readonly display: string;
  readonly country: string;
  readonly typed: number;
  readonly expected: number | null;
  readonly ghost: string;
}

/** What a BIC field shows while typing: stored form, the required ghost and the optional branch ghost. */
export interface BicDraft {
  readonly value: string;
  readonly ghost: string;
  readonly branchGhost: string;
}

/** Groups a string in blocks of four separated by single spaces. */
export function groupInFours(text: string): string {
  return text.replace(/(.{4})(?=.)/g, '$1 ');
}

function cleaned(raw: string): string {
  return raw.replace(NOT_ALPHANUMERIC, '').toUpperCase();
}

/** Upper-cases, strips separators, caps at the country length and groups an IBAN as typed. */
export function draftIban(raw: string, ghostChar: string = DEFAULT_GHOST): IbanDraft {
  const text = cleaned(raw);
  const country = COUNTRY_PREFIX.test(text) ? text.slice(0, COUNTRY_LENGTH) : '';
  const expected = country === '' ? null : ibanLengthFor(country);
  const electronic = text.slice(0, expected ?? IBAN_MAX_LENGTH);
  const display = groupInFours(electronic);
  const mask = expected === null ? '' : groupInFours(ghostChar.repeat(expected));
  return { electronic, display, country, typed: electronic.length, expected, ghost: mask.slice(display.length) };
}

/** The "typed / expected" counter, or `null` before the country is known. */
export function ibanCounter(draft: IbanDraft): string | null {
  return draft.expected === null ? null : `${draft.typed} / ${draft.expected}`;
}

/** Upper-cases and caps a BIC at 11, with ghosts for the required part and the optional branch. */
export function draftBic(raw: string, ghostChar: string = DEFAULT_BIC_GHOST): BicDraft {
  const value = cleaned(raw).slice(0, BIC11_LENGTH);
  const ghost = ghostChar.repeat(Math.max(0, BIC8_LENGTH - value.length));
  const branchLeft = value.length <= BIC8_LENGTH ? BRANCH_LENGTH : BIC11_LENGTH - value.length;
  return { value, ghost, branchGhost: ghostChar.repeat(branchLeft) };
}
