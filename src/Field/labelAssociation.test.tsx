/**
 * Label association, asserted against the DOM rather than against props.
 *
 * The defect this closes was invisible to every prop-level test: controls carried a correct
 * `accessibilityLabel`, so screen readers announced them properly and a naming audit came back
 * clean. A live page nevertheless had **0** `<label>` elements, **0** `label[for]` and **0**
 * controls with an `id` — clicking a field's visible label did nothing.
 *
 * These assertions therefore check what a browser actually received: a real `<label>`, a real
 * `for`, and a real element at the other end of it. A test that asserted `htmlFor` was passed
 * would have passed against the broken build too, since react-native-web silently drops props it
 * does not map.
 */
import { render, screen } from '@testing-library/react';

import { Field } from './Field';
import { SelectControl } from '../SelectControl/SelectControl';
import { ThemedTextInput } from '../ThemedTextInput/ThemedTextInput';

const noop = (): void => undefined;

describe('Field label association', () => {
  it('renders a real <label> element, not a div', () => {
    render(
      <Field label="Τίτλος">
        <ThemedTextInput accessibilityLabel="Τίτλος" value="" onChangeText={noop} />
      </Field>,
    );

    expect(screen.getByText(/Τίτλος/).tagName).toBe('LABEL');
  });

  it('points the label at the control that actually exists in the document', () => {
    const { container } = render(
      <Field label="Τίτλος">
        <ThemedTextInput accessibilityLabel="Τίτλος" value="" onChangeText={noop} />
      </Field>,
    );

    const label = container.querySelector('label');
    const target = label?.getAttribute('for');

    expect(target).toBeTruthy();
    // The half that a "does this page have labels?" check would miss: the `for` has to RESOLVE.
    expect(container.querySelector(`#${target ?? ''}`)).toBe(container.querySelector('input'));
  });

  it('does not disturb the control-supplied aria-label', () => {
    // aria-label still WINS for the accessible name. Association adds click-to-focus; it must not
    // change a single announcement, or this becomes a regression dressed as a fix.
    const { container } = render(
      <Field label="Τίτλος">
        <ThemedTextInput accessibilityLabel="Τίτλος οδηγού" value="" onChangeText={noop} />
      </Field>,
    );

    expect(container.querySelector('input')?.getAttribute('aria-label')).toBe('Τίτλος οδηγού');
  });

  it('emits NO for at all when the render child never placed the id', () => {
    // Caught in a real browser, not by a unit test: the difficulty dropdown's label shipped
    // `for="field-control-3"` pointing at nothing, because Field handed the id to a render child
    // that associates itself via aria-labelledby instead. Every structural check passed — there
    // was a <label>, and it had a `for` — and clicking it focused nothing.
    const { container } = render(
      <Field label="Δυσκολία">
        {() => <SelectControl accessibilityLabel="Δυσκολία" onChange={noop} options={[]} testID="d" value="" />}
      </Field>,
    );

    expect(container.querySelector('label')?.hasAttribute('for')).toBe(false);
  });

  it('links a non-labelable control back to the label instead of emitting a dead for', () => {
    // A SelectControl trigger is a <div role="button">. `<label for>` addresses native form
    // elements only, so pointing at one would produce an association that silently does nothing.
    const { container } = render(
      <Field label="Δυσκολία">
        {({ labelId }) => (
          <SelectControl
            accessibilityLabel="Δυσκολία"
            labelledById={labelId}
            onChange={noop}
            options={[{ value: '1', label: 'Εύκολο' }]}
            testID="difficulty"
            value="1"
          />
        )}
      </Field>,
    );

    const trigger = screen.getByTestId('difficulty-trigger');
    const labelledBy = trigger.getAttribute('aria-labelledby');

    expect(labelledBy).toBeTruthy();
    expect(container.querySelector(`#${labelledBy ?? ''}`)?.tagName).toBe('LABEL');
  });

  it('gives each field its own ids so two fields never share a target', () => {
    const { container } = render(
      <>
        <Field label="Πρώτο">
          <ThemedTextInput accessibilityLabel="Πρώτο" value="" onChangeText={noop} />
        </Field>
        <Field label="Δεύτερο">
          <ThemedTextInput accessibilityLabel="Δεύτερο" value="" onChangeText={noop} />
        </Field>
      </>,
    );

    const targets = [...container.querySelectorAll('label')].map((l) => l.getAttribute('for'));

    expect(targets).toHaveLength(2);
    expect(new Set(targets).size).toBe(2);
  });
});
