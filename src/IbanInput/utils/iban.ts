import { IbanRejection } from '../data/IbanRejection';
import { ibanLengthFor } from '../data/ibanCountryLengths';

const COUNTRY_LENGTH = 2;
const PREFIX_LENGTH = 4;
const MODULUS = 97;
const VALID_REMAINDER = 1;
const LETTER_OFFSET = 10;
const DIGIT_SHIFT = 10;
const LETTER_SHIFT = 100;
const CODE_A = 65;
const CODE_0 = 48;
const LETTER = /^[A-Za-z]$/;
const DIGIT = /^[0-9]$/;

/** The outcome of validating one IBAN; `electronic` (upper case, no spaces) is set only when valid. */
export interface IbanVerdict {
  readonly rejection: IbanRejection;
  readonly electronic: string | null;
  readonly expectedLength: number | null;
}

function refused(rejection: IbanRejection, expectedLength: number | null = null): IbanVerdict {
  return { rejection, electronic: null, expectedLength };
}

function stripSeparators(raw: string): string | null {
  let out = '';
  for (const character of raw) {
    if (character === ' ') continue;
    if (!LETTER.test(character) && !DIGIT.test(character)) return null;
    out += character.toUpperCase();
  }
  return out === '' ? null : out;
}

function shapeFailure(iban: string): IbanVerdict | null {
  if (iban.length <= PREFIX_LENGTH) return refused(IbanRejection.MalformedCountryCode);
  if (!LETTER.test(iban.charAt(0)) || !LETTER.test(iban.charAt(1))) return refused(IbanRejection.MalformedCountryCode);
  if (!DIGIT.test(iban.charAt(2)) || !DIGIT.test(iban.charAt(3))) return refused(IbanRejection.MalformedCheckDigits);
  const expected = ibanLengthFor(iban.slice(0, COUNTRY_LENGTH));
  if (expected === null) return refused(IbanRejection.UnknownCountry);
  return iban.length === expected ? null : refused(IbanRejection.WrongLengthForCountry, expected);
}

function mod97(iban: string): number {
  let remainder = 0;
  for (let index = 0; index < iban.length; index++) {
    const character = iban.charAt((index + PREFIX_LENGTH) % iban.length);
    const code = character.charCodeAt(0);
    remainder = DIGIT.test(character)
      ? remainder * DIGIT_SHIFT + (code - CODE_0)
      : remainder * LETTER_SHIFT + (code - CODE_A + LETTER_OFFSET);
    remainder %= MODULUS;
  }
  return remainder;
}

/** Validates an IBAN with the same rules as `Finreg.Core.Banking.Iban.Validate`. */
export function validateIban(raw: string | null | undefined): IbanVerdict {
  if (raw === null || raw === undefined || raw.trim() === '') return refused(IbanRejection.Missing);
  const normalised = stripSeparators(raw);
  if (normalised === null) return refused(IbanRejection.IllegalCharacter);
  const failure = shapeFailure(normalised);
  if (failure !== null) return failure;
  if (mod97(normalised) !== VALID_REMAINDER) return refused(IbanRejection.ChecksumFailed);
  return { rejection: IbanRejection.None, electronic: normalised, expectedLength: null };
}
