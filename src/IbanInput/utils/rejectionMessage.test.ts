import { IbanRejection } from '../data/IbanRejection';
import type { IbanRejectionLabels } from '../types';
import { rejectionMessage } from './rejectionMessage';

const LABELS: IbanRejectionLabels = {
  [IbanRejection.Missing]: 'Enter an IBAN',
  [IbanRejection.IllegalCharacter]: 'Letters and digits only',
  [IbanRejection.MalformedCountryCode]: 'Start with a country code',
  [IbanRejection.MalformedCheckDigits]: 'Check digits are wrong',
  [IbanRejection.UnknownCountry]: 'Unknown country',
  [IbanRejection.WrongLengthForCountry]: 'Wrong length',
  [IbanRejection.ChecksumFailed]: 'This IBAN has a typo',
};

describe('rejectionMessage', () => {
  it('with a failed checksum, returns its localized label, never the raw code', () => {
    const rejection: IbanRejection = IbanRejection.ChecksumFailed;

    const message = rejectionMessage<IbanRejection, IbanRejection.None>(rejection, IbanRejection.None, LABELS);

    expect(message).toBe('This IBAN has a typo');
  });

  it('with a passing verdict, returns null', () => {
    const rejection: IbanRejection = IbanRejection.None;

    const message = rejectionMessage<IbanRejection, IbanRejection.None>(rejection, IbanRejection.None, LABELS);

    expect(message).toBeNull();
  });

  it('with no labels given, returns null', () => {
    const rejection: IbanRejection = IbanRejection.ChecksumFailed;

    const message = rejectionMessage<IbanRejection, IbanRejection.None>(rejection, IbanRejection.None, undefined);

    expect(message).toBeNull();
  });
});
