import { radioRowIdentity } from './radioRowIdentity';

describe('radioRowIdentity', () => {
  it('with a description, joins label and description for the accessible name', () => {
    const option = { value: 'a', label: 'Approve', description: 'Session passes', hint: 'h' };

    const identity = radioRowIdentity(option, false, false, 'p');

    expect(identity.accessibilityLabel).toBe('Approve, Session passes');
  });

  it('with no description, uses the label', () => {
    const option = { value: 'a', label: 'Approve', hint: 'h' };

    const identity = radioRowIdentity(option, false, false, 'p');

    expect(identity.accessibilityLabel).toBe('Approve');
  });

  it('with the option selected, reports native checked state', () => {
    const option = { value: 'a', label: 'Approve', hint: 'h' };

    const identity = radioRowIdentity(option, true, false, 'p');

    expect(identity.accessibilityState).toEqual({ checked: true, selected: true, disabled: false });
  });

  it('with a prefix, builds the testID from prefix and value', () => {
    const option = { value: 'a', label: 'Approve', hint: 'h' };

    const identity = radioRowIdentity(option, false, false, 'p');

    expect(identity.testID).toBe('p-a');
  });
});
