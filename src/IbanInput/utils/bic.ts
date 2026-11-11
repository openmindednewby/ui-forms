import { BicRejection } from '../data/BicRejection';

const BIC8_LENGTH = 8;
const BIC11_LENGTH = 11;
const COUNTRY_START = 4;
const LOCATION_INDEX = 6;
const ALPHANUMERIC = /^[A-Za-z0-9]*$/;
const INSTITUTION = /^[A-Z]{4}/;
const COUNTRY = /^[A-Z]{2}$/;
const RESERVED_LOCATION = ['0', '1'];

/** The outcome of validating one BIC; `electronic` (upper case, trimmed) is set only when valid. */
export interface BicVerdict {
  readonly rejection: BicRejection;
  readonly electronic: string | null;
}

const refused = (rejection: BicRejection): BicVerdict => ({ rejection, electronic: null });

/** Validates a BIC with the same rules as `Finreg.Core.Banking.Bic.Validate`. */
export function validateBic(raw: string | null | undefined): BicVerdict {
  if (raw === null || raw === undefined || raw.trim() === '') return refused(BicRejection.Missing);
  const trimmed = raw.trim();
  if (!ALPHANUMERIC.test(trimmed)) return refused(BicRejection.IllegalCharacter);
  const bic = trimmed.toUpperCase();
  if (bic.length !== BIC8_LENGTH && bic.length !== BIC11_LENGTH) return refused(BicRejection.WrongLength);
  if (!INSTITUTION.test(bic)) return refused(BicRejection.MalformedInstitution);
  if (!COUNTRY.test(bic.slice(COUNTRY_START, LOCATION_INDEX))) return refused(BicRejection.MalformedCountry);
  if (RESERVED_LOCATION.includes(bic.charAt(LOCATION_INDEX))) return refused(BicRejection.MalformedLocation);
  return { rejection: BicRejection.None, electronic: bic };
}
