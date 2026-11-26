import { render, screen } from '@testing-library/react';

import { ChipSelector } from './ChipSelector';
import { resolveSelectedFill } from './utils/chipLook';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];
const FILL = 'rgb(1, 2, 3)';

const noop = (): void => undefined;

describe('ChipSelector selectedFill', () => {
  it('with selectedFill, shows the check mark only on the selected chip', () => {
    render(<ChipSelector options={OPTIONS} selectedFill={FILL} value="a" onChange={noop} />);

    const checks = { a: screen.queryByTestId('chip-selector-chip-a-check'), b: screen.queryByTestId('chip-selector-chip-b-check') };

    expect(checks.a).not.toBeNull();
    expect(checks.b).toBeNull();
  });

  it('with selectedFill, hides the check mark from assistive tech and keeps the label text', () => {
    render(<ChipSelector options={OPTIONS} selectedFill={FILL} value="a" onChange={noop} />);

    const check = screen.getByTestId('chip-selector-chip-a-check');

    expect(check.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByTestId('chip-selector-chip-a').textContent).toBe('Alpha');
  });

  it('without selectedFill, shows no check mark', () => {
    render(<ChipSelector options={OPTIONS} value="a" onChange={noop} />);

    const check = screen.queryByTestId('chip-selector-chip-a-check');

    expect(check).toBeNull();
  });

  it('with selectedFill on the outline variant, shows the check mark on the selected chip', () => {
    render(<ChipSelector options={OPTIONS} selectedFill={FILL} value="b" variant="outline" onChange={noop} />);

    const check = screen.queryByTestId('chip-selector-chip-b-check');

    expect(check).not.toBeNull();
  });

  it('with selectedFill and compact size in a radio group, keeps aria-checked', () => {
    render(<ChipSelector options={OPTIONS} selectedFill={FILL} singleSelectRole="radio" size="compact" value="a" onChange={noop} />);

    const states = ['a', 'b'].map((v) => screen.getByTestId(`chip-selector-chip-${v}`).getAttribute('aria-checked'));

    expect(states).toEqual(['true', 'false']);
  });

  it('with selectedFill in a multi group, shows a check on each selected chip', () => {
    render(<ChipSelector multiple options={OPTIONS} selectedFill={FILL} value={['a', 'b']} onChange={noop} />);

    const checks = screen.queryAllByTestId(/-check$/);

    expect(checks).toHaveLength(2);
  });
});

describe('ChipSelector selectedFill ink', () => {
  it('with selectedFill "ink", fills the selected chip with the theme strong ink, not the literal word', () => {
    render(<ChipSelector options={OPTIONS} selectedFill="ink" size="tap" value="a" onChange={noop} />);

    const chip = screen.getByTestId('chip-selector-chip-a');

    expect(chip.innerHTML).not.toContain('background-color: ink');
    expect(screen.queryByTestId('chip-selector-chip-a-check')).not.toBeNull();
  });
});

describe('resolveSelectedFill', () => {
  it('with "ink", returns the strong ink; with a colour, returns it unchanged', () => {
    const results = [resolveSelectedFill('ink', 'rgb(9, 9, 9)'), resolveSelectedFill(FILL, 'rgb(9, 9, 9)'), resolveSelectedFill(undefined, 'rgb(9, 9, 9)')];

    expect(results).toEqual(['rgb(9, 9, 9)', FILL, undefined]);
  });
});
