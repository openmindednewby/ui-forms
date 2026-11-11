import { fireEvent, render, screen } from '@testing-library/react';

import { BicInput } from './BicInput';
import { IbanInput } from './IbanInput';

describe('IbanInput onBlur', () => {
  it('with the box left, calls onBlur after the verdict', () => {
    const onBlur = jest.fn();
    const onVerdict = jest.fn();
    render(<IbanInput accessibilityHint="Type the IBAN" accessibilityLabel="IBAN" testID="iban" value="CY17002001280000001200527600" onBlur={onBlur} onChange={jest.fn()} onVerdict={onVerdict} />);

    fireEvent.blur(screen.getByTestId('iban'));

    expect(onVerdict).toHaveBeenCalledWith(expect.objectContaining({ electronic: 'CY17002001280000001200527600' }));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

describe('BicInput onBlur', () => {
  it('with the box left, calls onBlur', () => {
    const onBlur = jest.fn();
    render(<BicInput accessibilityHint="Type the BIC" accessibilityLabel="BIC" placeholder="BCYPCY2N" testID="bic" value="" onBlur={onBlur} onChange={jest.fn()} />);

    fireEvent.blur(screen.getByTestId('bic'));

    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
