import { render, screen } from '@testing-library/react';

import { SelectControl } from './SelectControl';
import { SelectLookProvider, selectLookMetrics } from './selectLook';

const LONG = 'Comprehensive - all lists, every PEP class, every sanction regime and adverse media source';
const OPTIONS = [
  { value: 'full', label: LONG },
  { value: 'core', label: 'Core' },
];

const noop = (): void => undefined;

describe('selectLookMetrics', () => {
  it('with the default look, returns no override', () => {
    const config = { look: 'default' as const };

    const metrics = selectLookMetrics(config, 1280);

    expect(metrics).toBeUndefined();
  });

  it('with the field look on a wide window, returns a 38 px box with 13 px text', () => {
    const config = { look: 'field' as const };

    const metrics = selectLookMetrics(config, 1280);

    expect(metrics).toMatchObject({ height: 38, fontSize: 13, paddingHorizontal: 10, paddingVertical: 0 });
  });

  it('with the field look on a phone window, returns a 44 px box', () => {
    const config = { look: 'field' as const };

    const metrics = selectLookMetrics(config, 360);

    expect(metrics?.height).toBe(44);
  });
});

describe('NativeSelect under SelectLookProvider', () => {
  it('with the field look and a long fit label, caps the width and ellipsizes on one line', () => {
    render(
      <SelectLookProvider borderColor="rgb(1, 2, 3)" look="field">
        <SelectControl native="fit" accessibilityLabel="Preset" options={OPTIONS} testID="preset" value="full" onChange={noop} />
      </SelectLookProvider>,
    );

    const select = screen.getByTestId('preset');

    expect(select.style).toMatchObject({ maxWidth: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '13px', borderColor: 'rgb(1, 2, 3)' });
  });

  it('without a provider, keeps the default box', () => {
    render(<SelectControl native accessibilityLabel="Preset" options={OPTIONS} testID="preset" value="full" onChange={noop} />);

    const select = screen.getByTestId('preset');

    expect(select.style.textOverflow).toBe('');
  });
});
