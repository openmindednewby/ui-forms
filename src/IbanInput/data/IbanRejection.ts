/** Why an IBAN was refused; member names match `Finreg.Core.Banking.IbanRejection`. */
export enum IbanRejection {
  None = 'None',
  Missing = 'Missing',
  IllegalCharacter = 'IllegalCharacter',
  MalformedCountryCode = 'MalformedCountryCode',
  MalformedCheckDigits = 'MalformedCheckDigits',
  UnknownCountry = 'UnknownCountry',
  WrongLengthForCountry = 'WrongLengthForCountry',
  ChecksumFailed = 'ChecksumFailed',
}
