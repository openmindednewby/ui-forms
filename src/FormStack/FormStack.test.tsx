import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';

import { useIsGapOwned } from '../FormGrid/formGridContext';
import { FormStack } from './FormStack';

function GapProbe(): React.ReactElement {
  return <Text testID="probe">{useIsGapOwned() ? 'owned' : 'free'}</Text>;
}

describe('FormStack', () => {
  it('with a Field-like child, tells the child its vertical rhythm is gap-owned', () => {
    const child = <GapProbe />;

    render(<FormStack testID="stack">{child}</FormStack>);

    expect(screen.getByTestId('probe').textContent).toBe('owned');
  });
});
