import { render, screen } from '@testing-library/react';
import { useWindowDimensions } from 'react-native';

import { Field } from '../Field/Field';

import { InlineFieldRow } from './InlineFieldRow';

jest.mock('react-native', () => ({
  ...jest.requireActual<Record<string, unknown>>('react-native'),
  useWindowDimensions: jest.fn(),
}));

const PHONE_HEIGHT = 640;

function setWindowWidth(width: number): void {
  jest.mocked(useWindowDimensions).mockReturnValue({ width, height: PHONE_HEIGHT, scale: 1, fontScale: 1 });
}

const renderRow = (): void => {
  render(
    <InlineFieldRow
      action={<button type="button">Resend</button>}
      field={
        <Field label="Email">
          <input />
        </Field>
      }
      fieldMaxWidth={480}
      testID="row"
    />,
  );
};

describe('InlineFieldRow', () => {
  it('at a 1280px window, puts the action on the input line under a hidden label line', () => {
    setWindowWidth(1280);

    renderRow();

    expect(screen.getByTestId('row').querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('at a 360px window, stacks field and action with no row wrapper', () => {
    setWindowWidth(360);

    renderRow();

    expect(screen.queryByTestId('row')).toBeNull();
  });
});
