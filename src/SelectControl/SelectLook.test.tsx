import { render, screen } from '@testing-library/react';

import { SelectControl } from './SelectControl';
import { SelectLookProvider, selectLookMetrics, selectThemeInk } from './selectLook';

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

describe('selectLookMetrics chip look', () => {
  it('with the chip look on a wide window, returns a 30 px content-width box with a 6 px gap', () => {
    const config = { look: 'chip' as const };

    const metrics = selectLookMetrics(config, 1280);

    expect(metrics).toMatchObject({ height: 30, fontSize: 13, paddingHorizontal: 10, borderRadius: 8, hug: true, gap: 6 });
  });

  it('with the chip look on a phone window, keeps the 44 px touch floor', () => {
    const config = { look: 'chip' as const };

    const metrics = selectLookMetrics(config, 360);

    expect(metrics?.height).toBe(44);
  });

  it('with the field look, fills the row', () => {
    const config = { look: 'field' as const };

    const metrics = selectLookMetrics(config, 1280);

    expect(metrics?.hug).toBe(false);
  });
});

describe('SelectControl under a chip SelectLookProvider', () => {
  it('paints the trigger with the configured border, fill and ink and hugs its label (height is covered by the metrics tests)', () => {
    render(
      <SelectLookProvider backgroundColor="rgba(0, 0, 0, 0)" borderColor="rgb(1, 2, 3)" look="chip" textColor="rgb(4, 5, 6)">
        <SelectControl accessibilityLabel="Tenant: All" options={OPTIONS} testID="tenant" value="core" onChange={noop} />
      </SelectLookProvider>,
    );

    const trigger = screen.getByTestId('tenant-trigger');

    const box = window.getComputedStyle(trigger);
    const painted = { borderColor: box.borderTopColor, backgroundColor: box.backgroundColor, justifyContent: box.justifyContent, alignSelf: box.alignSelf };

    expect(painted).toEqual({ borderColor: 'rgba(1,2,3,1.00)', backgroundColor: 'rgba(0, 0, 0, 0)', justifyContent: 'flex-start', alignSelf: 'flex-start' });
    expect(window.getComputedStyle(screen.getByText('Core')).color).toBe('rgb(4, 5, 6)');
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

describe('selectThemeInk', () => {
  const colors = { surface: '#ffffff', surfaceElevated: '#f8fafc', text: '#0b1220', textSecondary: '#4a5567' };

  it('with the field look, fills with the card surface and draws the chevron in text ink', () => {
    const metrics = selectLookMetrics({ look: 'field' }, 1280);

    const ink = selectThemeInk(metrics, colors);

    expect(ink).toEqual({ background: '#ffffff', chevron: '#0b1220' });
  });

  it('with the default look, keeps the raised fill and the muted chevron', () => {
    const metrics = selectLookMetrics({ look: 'default' }, 1280);

    const ink = selectThemeInk(metrics, colors);

    expect(ink).toEqual({ background: '#f8fafc', chevron: '#4a5567' });
  });
});
