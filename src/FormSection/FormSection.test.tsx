/**
 * `FormSection` guards — the fieldset/legend grouping only AML v1 had.
 *
 * The a11y assertions matter more than the visual ones here: the whole point is that the grouping
 * stops being purely visual. A `View` with a `Heading` above it (zygos's current approach) looks
 * identical and tells assistive tech nothing.
 */
import { render, screen } from '@testing-library/react';

import { Field } from '../Field/Field';
import { labelVariantStyles } from '../Field/labelVariants';

import { FormSection } from './FormSection';

describe('FormSection grouping semantics', () => {
  it('exposes a real group labelled by its own legend, not a bare div', () => {
    render(
      <FormSection testID="sec" title="Advanced matching">
        <Field label="Threshold">
          <span />
        </Field>
      </FormSection>,
    );
    const group = screen.getByRole('group');
    const legend = screen.getByText('Advanced matching');
    expect(group.getAttribute('aria-labelledby')).toBe(legend.getAttribute('id'));
    expect(legend.getAttribute('id')).toBeTruthy();
  });

  it('renders no legend and NO aria-labelledby when untitled', () => {
    render(
      <FormSection testID="sec">
        <Field label="Threshold">
          <span />
        </Field>
      </FormSection>,
    );
    // A group pointed at a missing/empty label is worse for assistive tech than an unlabelled one.
    expect(screen.getByTestId('sec').getAttribute('aria-labelledby')).toBeNull();
  });

  it('gives two sections distinct legend ids so the labelling cannot cross', () => {
    render(
      <>
        <FormSection title="One">
          <span />
        </FormSection>
        <FormSection title="Two">
          <span />
        </FormSection>
      </>,
    );
    const idOne = screen.getByText('One').getAttribute('id');
    const idTwo = screen.getByText('Two').getAttribute('id');
    expect(idOne).toBeTruthy();
    expect(idOne).not.toBe(idTwo);
  });

  it('renders a description under the legend as the group-level sibling of a hint', () => {
    render(
      <FormSection description="Applies to every screen" testID="sec" title="Coverage">
        <span />
      </FormSection>,
    );
    const children = Array.from(screen.getByTestId('sec').children).map((el) => el.textContent);
    expect(children.slice(0, 2)).toEqual(['Coverage', 'Applies to every screen']);
  });
});

describe('FormSection legend metric', () => {
  it('speaks the SAME label voice as a Field label, so a third voice cannot appear', () => {
    render(
      <>
        <FormSection title="Coverage">
          <span />
        </FormSection>
        <Field label="Currency">
          <span />
        </Field>
      </>,
    );
    const legend = getComputedStyle(screen.getByText('Coverage'));
    const fieldLabel = getComputedStyle(screen.getByText(/Currency/));
    expect(legend.fontSize).toBe(fieldLabel.fontSize);
    expect(legend.fontWeight).toBe(fieldLabel.fontWeight);
    // Anchored to the shared source of truth, not to a copied literal.
    expect(legend.fontSize).toBe(`${String(labelVariantStyles.field.fontSize)}px`);
  });

  it('follows Field into the dense control voice when asked', () => {
    render(
      <FormSection labelVariant="control" title="Filters">
        <span />
      </FormSection>,
    );
    const legend = getComputedStyle(screen.getByText('Filters'));
    expect(legend.textTransform).toBe('uppercase');
    expect(legend.fontSize).toBe(`${String(labelVariantStyles.control.fontSize)}px`);
  });
});
