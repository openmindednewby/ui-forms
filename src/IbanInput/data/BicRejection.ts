/** Why a BIC was refused; member names match `Finreg.Core.Banking.BicRejection`. */
export enum BicRejection {
  None = 'None',
  Missing = 'Missing',
  IllegalCharacter = 'IllegalCharacter',
  WrongLength = 'WrongLength',
  MalformedInstitution = 'MalformedInstitution',
  MalformedCountry = 'MalformedCountry',
  MalformedLocation = 'MalformedLocation',
}
