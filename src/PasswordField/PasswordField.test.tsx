import React, { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { PasswordField } from './PasswordField';
import { PasswordRulesDisplay } from './PasswordRulesDisplay';
import { changedRules, ruleAnnouncement } from './ruleAnnouncement';
import { RuleTone, ruleTone } from './RuleTone';
import type { PasswordFieldLabels, PasswordRuleState } from './types';

const LABELS: PasswordFieldLabels = { show: 'Show password', hide: 'Hide password', met: 'met', unmet: 'not met' };

function rulesFor(value: string): PasswordRuleState[] {
  return [
    { id: 'length', label: '8-128 characters', met: value.length >= 8 },
    { id: 'upper', label: 'Uppercase', met: /[A-Z]/.test(value) },
  ];
}

function Harness({ display, flagUnmet = false }: { display?: PasswordRulesDisplay; flagUnmet?: boolean }): React.ReactElement {
  const [value, setValue] = useState('');
  return (
    <PasswordField flagUnmet={flagUnmet} label="Password" labels={LABELS} rules={rulesFor(value)} rulesDisplay={display} testID="pw" value={value} onChangeText={setValue} />
  );
}

function toneOf(id: string): string | null {
  return screen.getByTestId(`pw-rules-${id}`).getAttribute('data-tone');
}

describe('ruleTone', () => {
  it('with an unmet rule and no flag, is Unmet', () => {
    const tone = ruleTone(false, false);

    expect(tone).toBe(RuleTone.Unmet);
  });

  it('with an unmet rule after submit, is Refused', () => {
    const tone = ruleTone(false, true);

    expect(tone).toBe(RuleTone.Refused);
  });

  it('with a met rule after submit, stays Met', () => {
    const tone = ruleTone(true, true);

    expect(tone).toBe(RuleTone.Met);
  });
});

describe('changedRules', () => {
  it('with one rule flipped, returns only that rule', () => {
    const before = rulesFor('abc');
    const after = rulesFor('Abc');

    const changed = changedRules(before, after);

    expect(changed.map((rule) => rule.id)).toEqual(['upper']);
  });

  it('with nothing flipped, returns no rule', () => {
    const before = rulesFor('abc');

    const changed = changedRules(before, rulesFor('abcd'));

    expect(changed).toEqual([]);
  });
});

describe('ruleAnnouncement', () => {
  it('with a rule turned met, names the rule and its new state', () => {
    const changed = [{ id: 'upper', label: 'Uppercase', met: true }];

    const text = ruleAnnouncement(changed, LABELS);

    expect(text).toBe('Uppercase: met');
  });
});

describe('PasswordField', () => {
  it('when the eye is pressed, unmasks the value and sets aria-pressed with the hide label', () => {
    render(<Harness />);

    fireEvent.click(screen.getByTestId('pw-reveal'));

    expect(screen.getByTestId('pw').getAttribute('type')).not.toBe('password');
    expect(screen.getByTestId('pw-reveal').getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByLabelText('Hide password')).toBeTruthy();
  });

  it('when a keystroke meets a rule, marks it met; deleting un-marks it', () => {
    render(<Harness />);
    const input = screen.getByTestId('pw');
    fireEvent.change(input, { target: { value: 'A' } });
    const metAfterTyping = toneOf('upper');

    fireEvent.change(input, { target: { value: '' } });

    expect(metAfterTyping).toBe(RuleTone.Met);
    expect(toneOf('upper')).toBe(RuleTone.Unmet);
  });

  it('when one rule flips, announces only that rule in the polite region', () => {
    render(<Harness />);

    act(() => {
      fireEvent.change(screen.getByTestId('pw'), { target: { value: 'A' } });
    });

    expect(screen.getByTestId('pw-announce').textContent).toBe('Uppercase: met');
    expect(screen.getByTestId('pw-announce').getAttribute('aria-live')).toBe('polite');
  });

  it.each([PasswordRulesDisplay.Checklist, PasswordRulesDisplay.MeterGrid, PasswordRulesDisplay.Chips, PasswordRulesDisplay.Sentence])(
    'with rulesDisplay %s and flagUnmet, shows each unmet rule as refused',
    (display) => {
      render(<Harness flagUnmet display={display} />);

      const tones = [toneOf('length'), toneOf('upper')];

      expect(tones).toEqual([RuleTone.Refused, RuleTone.Refused]);
    },
  );

  it('with no rules, renders the eye but no rule list', () => {
    render(<PasswordField label="Password" labels={LABELS} testID="pw" value="" onChangeText={jest.fn()} />);

    const list = screen.queryByTestId('pw-rules');

    expect(list).toBeNull();
    expect(screen.getByTestId('pw-reveal')).toBeTruthy();
  });
});
