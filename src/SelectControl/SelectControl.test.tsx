/**
 * `SelectControl` — the newly-public API surface. These assert the BEHAVIOUR that was previously
 * only reachable through `ui-tables`' `Filters` bar, so a regression here is caught at the
 * package that owns the control rather than three layers up.
 */
import { fireEvent, render, screen } from '@testing-library/react';

import { SelectControl } from './SelectControl';

const OPTIONS = [
  { label: 'Any', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
];

const TID = 'sel';
const TRIGGER = `${TID}-trigger`;
const MENU = `${TID}-menu`;

function renderSelect(overrides: Partial<React.ComponentProps<typeof SelectControl>> = {}): jest.Mock {
  const onChange = jest.fn();
  render(
    <SelectControl
      accessibilityLabel="Status: Any"
      options={OPTIONS}
      testID={TID}
      value=""
      onChange={onChange}
      {...overrides}
    />,
  );
  return onChange;
}

describe('SelectControl — displayed value', () => {
  it('shows the SELECTED option label, not the placeholder, when a value is set', () => {
    renderSelect({ placeholder: 'Any', value: 'closed' });
    expect(screen.getByTestId(TRIGGER).textContent).toContain('Closed');
    // Mutation guard: a control that always rendered the placeholder would pass a
    // "renders something" assertion but fail this one.
    expect(screen.getByTestId(TRIGGER).textContent).not.toContain('Any');
  });

  it('falls back to the placeholder when the value matches NO option', () => {
    renderSelect({ placeholder: 'Any', value: 'ghost-value' });
    expect(screen.getByTestId(TRIGGER).textContent).toContain('Any');
  });

  it('renders an empty placeholder rather than crashing when none is supplied', () => {
    renderSelect({ value: 'ghost-value' });
    expect(screen.getByTestId(TRIGGER)).toBeTruthy();
  });
});

describe('SelectControl — accessible name', () => {
  it('uses the caller-composed PRE-LOCALIZED name, which may differ from the visible text', () => {
    // The whole reason the name is a prop: it must carry the selection ("Status: Closed"),
    // while the trigger only shows the value ("Closed"). Composing it inside the control
    // would require a `t` call, which this package must never make.
    renderSelect({ accessibilityLabel: 'Status: Closed', value: 'closed' });
    const trigger = screen.getByTestId(TRIGGER);
    expect(trigger.getAttribute('aria-label')).toBe('Status: Closed');
    expect(trigger.textContent).toContain('Closed');
    expect(trigger.textContent).not.toContain('Status:');
  });

  it('reflects open state to assistive tech via aria-expanded', () => {
    renderSelect();
    const trigger = screen.getByTestId(TRIGGER);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigger);
    expect(screen.getByTestId(TRIGGER).getAttribute('aria-expanded')).toBe('true');
  });
});

describe('SelectControl — menu interaction', () => {
  it('opens on press and is closed before that', () => {
    renderSelect();
    expect(screen.queryByTestId(MENU)).toBeNull();
    fireEvent.click(screen.getByTestId(TRIGGER));
    expect(screen.getByTestId(MENU)).toBeTruthy();
  });

  it('emits the picked option VALUE (not its label) and closes', () => {
    const onChange = renderSelect();
    fireEvent.click(screen.getByTestId(TRIGGER));
    fireEvent.click(screen.getByTestId(`${TID}-option-open`));
    expect(onChange).toHaveBeenCalledWith('open');
    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('toggles shut on a second press of the trigger', () => {
    renderSelect();
    const trigger = screen.getByTestId(TRIGGER);
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('dismisses on Escape', () => {
    renderSelect();
    fireEvent.click(screen.getByTestId(TRIGGER));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('dismisses on an outside mousedown but NOT on one inside the menu', () => {
    renderSelect();
    fireEvent.click(screen.getByTestId(TRIGGER));
    // Inside the menu: must survive, or picking an option would race the dismissal.
    fireEvent.mouseDown(screen.getByTestId(`${TID}-option-open`));
    expect(screen.getByTestId(MENU)).toBeTruthy();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('marks the selected option, and only that option, as selected', () => {
    renderSelect({ value: 'closed' });
    fireEvent.click(screen.getByTestId(TRIGGER));
    expect(screen.getByTestId(`${TID}-option-closed`).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByTestId(`${TID}-option-open`).getAttribute('aria-selected')).not.toBe('true');
  });

  it('renders one option per supplied option, keyed by value', () => {
    renderSelect();
    fireEvent.click(screen.getByTestId(TRIGGER));
    // NOTE: `optionHint` is deliberately NOT asserted against the DOM. react-native-web drops
    // `accessibilityHint` entirely (it is native-only), so a DOM assertion here would prove
    // nothing about whether the hint is threaded — it would pass on a control that ignored the
    // prop and fail on one that honoured it. The prop is carried for native parity.
    expect(screen.getAllByRole('menuitem')).toHaveLength(OPTIONS.length);
  });
});
