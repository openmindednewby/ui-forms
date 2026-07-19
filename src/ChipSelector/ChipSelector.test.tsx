/**
 * ChipSelector's label used to be a LOCAL `<Text>` whose metrics drifted from `Field`'s on three
 * of four axes, so it sat misaligned next to a `FormField`. These tests lock the label to the
 * shared shell, and pin the no-label case so composing `Field` cannot introduce a phantom row.
 *
 * The pre-existing behaviour tests live in `../components.test.tsx` and are deliberately
 * untouched — they passing unmodified is the backward-compatibility evidence.
 */
import { render, screen, fireEvent } from '@testing-library/react';

import { FormField } from '../FormField/FormField';

import { ChipSelector, chipIdentity } from './ChipSelector';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

const noop = (): void => undefined;

describe('ChipSelector label row', () => {
  it('takes its label metrics from the same shell as FormField (one implementation, not two)', () => {
    const { unmount } = render(<ChipSelector label="Pick" options={OPTIONS} value="a" onChange={noop} />);
    const chipLabel = screen.getByText(/Pick/);
    const chipClassName = chipLabel.className;
    const chipInlineStyle = chipLabel.getAttribute('style');
    unmount();

    render(<FormField label="Pick" />);
    const fieldLabel = screen.getByText(/Pick/);
    // Same emitted class + inline style => same font size, weight, colour and margin. If either
    // component ever grows its own label styles again, these diverge and this test fails.
    expect(chipClassName).toBeTruthy();
    expect(fieldLabel.className).toBe(chipClassName);
    expect(fieldLabel.getAttribute('style')).toBe(chipInlineStyle);
  });

  it('renders NO label row when no label is supplied (no phantom gap above the chips)', () => {
    render(<ChipSelector testID="chips" options={OPTIONS} value="a" onChange={noop} />);
    const shell = screen.getByTestId('chips');
    // The chip group is the shell's FIRST child — nothing is rendered above it.
    expect(shell.firstElementChild?.textContent).toBe('AlphaBeta');
    expect(shell.children).toHaveLength(1);
  });

  it('renders NO label row for an empty-string label', () => {
    render(<ChipSelector testID="chips" label="" options={OPTIONS} value="a" onChange={noop} />);
    const shell = screen.getByTestId('chips');
    expect(shell.firstElementChild?.textContent).toBe('AlphaBeta');
    expect(shell.children).toHaveLength(1);
  });

  it('renders the label row above the chips when a label IS supplied', () => {
    render(<ChipSelector testID="chips" label="Pick" options={OPTIONS} value="a" onChange={noop} />);
    const shell = screen.getByTestId('chips');
    expect(shell.firstElementChild?.textContent).toMatch(/Pick/);
    expect(shell.children).toHaveLength(2);
  });
});

describe('ChipSelector validation', () => {
  it('renders the error as a role=alert line tied to the chip group via aria-describedby', () => {
    render(<ChipSelector testID="chips" label="Pick" error="Choose one" options={OPTIONS} value="a" onChange={noop} />);
    const errorNode = screen.getByText('Choose one');
    expect(errorNode.getAttribute('role')).toBe('alert');

    const group = screen.getByTestId('chips').firstElementChild?.nextElementSibling;
    expect(group?.getAttribute('aria-describedby')).toBe(errorNode.getAttribute('id'));
    expect(group?.getAttribute('aria-invalid')).toBe('true');
  });

  it('renders an error even with no label, and still no label row', () => {
    render(<ChipSelector testID="chips" error="Choose one" options={OPTIONS} value="a" onChange={noop} />);
    const shell = screen.getByTestId('chips');
    expect(shell.children).toHaveLength(2);
    expect(shell.firstElementChild?.textContent).toBe('AlphaBeta');
    expect(screen.getByText('Choose one').getAttribute('role')).toBe('alert');
  });

  it('has no error line and no aria-invalid when there is no error', () => {
    render(<ChipSelector testID="chips" label="Pick" options={OPTIONS} value="a" onChange={noop} />);
    expect(screen.queryByRole('alert')).toBeNull();
    const group = screen.getByTestId('chips').firstElementChild?.nextElementSibling;
    expect(group?.getAttribute('aria-describedby')).toBeNull();
    expect(group?.getAttribute('aria-invalid')).toBeNull();
  });

  it('renders the decorative required asterisk, hidden from assistive tech', () => {
    render(<ChipSelector required label="Pick" options={OPTIONS} value="a" onChange={noop} />);
    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true');
  });
});

describe('ChipSelector public prop shape', () => {
  it('still accepts every documented prop together and fires onChange', () => {
    const onChange = jest.fn();
    render(
      <ChipSelector
        multiple
        containerStyle={{ marginTop: 4 }}
        disabled={false}
        label="Pick"
        options={OPTIONS}
        value={['a']}
        variant="outline"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId('chip-selector-chip-b'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('keeps working with numeric option values', () => {
    const onChange = jest.fn();
    render(
      <ChipSelector
        options={[{ value: 1, label: 'One' }, { value: 2, label: 'Two' }]}
        value={1}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId('chip-selector-chip-2'));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});

/**
 * The four capabilities added so kefi-web's `SelectField`/`MultiSelectField` could be deleted
 * rather than kept as a local fork. Each is OPT-IN: the first test of each pair pins the
 * untouched default, because aml-v2's specs, aml-v2's Playwright suite and erevna/katalogos's
 * `Accessibility.test.tsx` all select on the existing behaviour.
 */
describe('ChipSelector chip testID stem', () => {
  it('defaults to chip-selector-chip-<value> (existing specs select on this)', () => {
    render(<ChipSelector options={OPTIONS} value="a" onChange={noop} />);
    expect(screen.getByTestId('chip-selector-chip-a')).toBeTruthy();
  });

  it('uses chipTestIDPrefix when supplied, so sibling groups are addressable apart', () => {
    render(
      <ChipSelector chipTestIDPrefix="admin-invite-role" options={OPTIONS} value="a" onChange={noop} />,
    );
    expect(screen.getByTestId('admin-invite-role-a')).toBeTruthy();
    expect(screen.queryByTestId('chip-selector-chip-a')).toBeNull();
  });

  it('leaves the wrapper testID independent of the chip stem', () => {
    render(
      <ChipSelector
        chipTestIDPrefix="roles"
        options={OPTIONS}
        testID="role-field"
        value="a"
        onChange={noop}
      />,
    );
    expect(screen.getByTestId('role-field')).toBeTruthy();
    expect(screen.getByTestId('roles-a')).toBeTruthy();
  });
});

/**
 * These assert `chipIdentity` directly rather than rendering.
 *
 * NOT a shortcut — a deliberate consequence of a measured RN-web behaviour: react-native-web
 * drops `accessibilityHint` on the floor. It is forwarded to native, but NO web attribute
 * carries it (verified against RNW 0.21.2 — it emits neither `aria-description` nor
 * `title`). A DOM assertion therefore cannot distinguish a correctly threaded hint from one
 * that was never passed at all, which makes any rendering test here worse than useless: it
 * would pass whether or not the feature worked.
 */
describe('chipIdentity — option accessibility hint', () => {
  const OPTION = { value: 'a', label: 'Alpha' };
  const single = { prefix: 'chip-selector-chip', multiple: false };

  it('defaults to the English "Selects <label>" that existing consumers assert', () => {
    // erevna-web / katalogos-web assert this exact string via the NATIVE testing library,
    // where the hint does survive. Changing the default breaks them.
    expect(chipIdentity(OPTION, false, single).accessibilityHint).toBe('Selects Alpha');
  });

  it('uses the supplied localized hint instead of the English default', () => {
    const hint = 'Choisissez un rôle';
    expect(chipIdentity(OPTION, false, { ...single, hint }).accessibilityHint).toBe(hint);
  });

  it('applies the same localized hint regardless of selection state', () => {
    // A half-localized group would announce one language per chip.
    const hint = 'Choisissez un rôle';
    expect(chipIdentity(OPTION, true, { ...single, hint }).accessibilityHint).toBe(hint);
  });
});

describe('chipIdentity — testID and pressed state', () => {
  const OPTION = { value: 'a', label: 'Alpha' };

  it('builds the chip testID from the prefix and the option value', () => {
    expect(chipIdentity(OPTION, false, { prefix: 'roles', multiple: true }).testID).toBe('roles-a');
  });

  it('marks a multi chip pressed exactly when it is selected', () => {
    const cfg = { prefix: 'roles', multiple: true };
    expect(chipIdentity(OPTION, true, cfg).ariaPressed).toBe(true);
    expect(chipIdentity(OPTION, false, cfg).ariaPressed).toBe(false);
  });

  it('leaves a single-select chip without a pressed state — it is a choice, not a toggle', () => {
    const cfg = { prefix: 'roles', multiple: false };
    expect(chipIdentity(OPTION, true, cfg).ariaPressed).toBeUndefined();
  });
});

describe('ChipSelector multi-select toggle semantics', () => {
  it('renders every chip as a REAL <button>, single or multi', () => {
    // This is the load-bearing assertion. react-native-web renders accessibilityRole="button"
    // as a <button> and every other role as a plain <div>. A <div> is not activated by
    // Space/Enter, so "upgrading" a multi chip to role="checkbox" would silently cost keyboard
    // users the control entirely. If anyone changes the role, this fails.
    render(<ChipSelector multiple options={OPTIONS} value={['a']} onChange={noop} />);
    const chip = screen.getByTestId('chip-selector-chip-a');
    expect(chip.tagName).toBe('BUTTON');
    expect(chip.getAttribute('role')).toBe('button');
  });

  it('conveys the on/off state of a MULTI chip via aria-pressed', () => {
    render(<ChipSelector multiple options={OPTIONS} value={['a']} onChange={noop} />);
    expect(screen.getByTestId('chip-selector-chip-a').getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('chip-selector-chip-b').getAttribute('aria-pressed')).toBe('false');
  });

  it('leaves a SINGLE-select chip unpressed — it is a choice, not a toggle', () => {
    render(<ChipSelector options={OPTIONS} value="a" onChange={noop} />);
    expect(screen.getByTestId('chip-selector-chip-a').getAttribute('aria-pressed')).toBeNull();
  });

  it('keeps a multi chip keyboard-activatable', () => {
    const onChange = jest.fn();
    render(<ChipSelector multiple options={OPTIONS} value={['a']} onChange={onChange} />);
    const chip = screen.getByTestId('chip-selector-chip-b');
    chip.focus();
    expect(document.activeElement).toBe(chip);
    fireEvent.click(chip);
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
