/**
 * The F3 spacing guards.
 *
 * Two layers, on purpose:
 *
 *  - The PURE layer pins the model-selection rules (`resolveFieldSpacing`) and the constants.
 *  - The RENDERED layer pins the pixels through `getComputedStyle`. That is not theatre here:
 *    react-native-web injects its generated rules into a real `<style>` element, and jsdom's CSSOM
 *    resolves them, so `getComputedStyle(field).marginBottom === '16px'` is the actual cascaded
 *    value the browser would compute — verified against the DOM before these assertions were
 *    written, not assumed. What jsdom does NOT have is a layout engine, which is why the
 *    "one baseline" guard below is a box-model equality check and says so.
 */
import { render, screen } from '@testing-library/react';

import { ChipSelector } from '../ChipSelector/ChipSelector';
import { FormField } from '../FormField/FormField';
import { FormGrid } from '../FormGrid/FormGrid';
import { FormSection } from '../FormSection/FormSection';

import { Field } from './Field';
import {
  FIELD_CONTRACT_GAP,
  FIELD_STACK_CHILD_MARGIN_TOP,
  FIELD_STACK_LABEL_MARGIN_BOTTOM,
  FIELD_STACK_MARGIN_BOTTOM,
  fieldSpacingStyleSet,
  resolveFieldSpacing,
} from './fieldSpacing';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];
const noop = (): void => undefined;

const px = (value: number): string => `${String(value)}px`;

describe('resolveFieldSpacing precedence', () => {
  it('defaults to the historical stack model outside a grid — the answer that changes nothing', () => {
    expect(resolveFieldSpacing(undefined, false)).toBe('stack');
  });

  it('switches to the gap model inside a grid, so the grid owns the rhythm', () => {
    expect(resolveFieldSpacing(undefined, true)).toBe('gap');
  });

  it('lets an explicit prop beat the grid in BOTH directions', () => {
    expect(resolveFieldSpacing('stack', true)).toBe('stack');
    expect(resolveFieldSpacing('gap', false)).toBe('gap');
  });
});

describe('fieldSpacingStyleSet', () => {
  it('gives the stack model a bottom margin and per-child margins', () => {
    const set = fieldSpacingStyleSet('stack');
    expect(FIELD_STACK_MARGIN_BOTTOM).toBe(16);
    expect(set.container).toEqual({ marginBottom: FIELD_STACK_MARGIN_BOTTOM });
    expect(set.label).toEqual({ marginBottom: FIELD_STACK_LABEL_MARGIN_BOTTOM });
    expect(set.child).toEqual({ marginTop: FIELD_STACK_CHILD_MARGIN_TOP });
  });

  it('gives the gap model a container gap and NO child margins at all', () => {
    // The LITERAL 6, not the constant. Asserting `toEqual({ gap: FIELD_CONTRACT_GAP })` alone is a
    // tautology — it reads the same symbol it is guarding, so changing the constant to 10 keeps it
    // green. Proven: that mutation passed 16/16 until this line was added. FORMS.md fixes the
    // contract gap at 6px, so 6 is what the test must state.
    expect(FIELD_CONTRACT_GAP).toBe(6);
    const set = fieldSpacingStyleSet('gap');
    expect(set.container).toEqual({ gap: FIELD_CONTRACT_GAP });
    // FORMS.md: "The gap is owned by the container, never by margins on the children."
    expect(set.label).toEqual({});
    expect(set.child).toEqual({});
  });
});

describe('Field contributes no bottom margin inside a FormGrid', () => {
  it('keeps the historical 16px outside a grid — every un-migrated consumer is untouched', () => {
    render(
      <Field label="Currency" testID="fld">
        <span />
      </Field>,
    );
    expect(getComputedStyle(screen.getByTestId('fld')).marginBottom).toBe('16px');
    expect(getComputedStyle(screen.getByTestId('fld')).marginBottom).toBe(px(FIELD_STACK_MARGIN_BOTTOM));
  });

  it('drops the bottom margin to zero inside a grid — this is the 16 cancel hacks, retired', () => {
    render(
      <FormGrid>
        <Field label="Currency" testID="fld">
          <span />
        </Field>
      </FormGrid>,
    );
    expect(getComputedStyle(screen.getByTestId('fld')).marginBottom).toBe('0px');
  });

  it('drops it inside a FormSection too, so the bug cannot reappear one level up', () => {
    render(
      <FormSection title="Coverage">
        <Field label="Currency" testID="fld">
          <span />
        </Field>
      </FormSection>,
    );
    expect(getComputedStyle(screen.getByTestId('fld')).marginBottom).toBe('0px');
  });

  it('honours an explicit spacing override inside a grid', () => {
    render(
      <FormGrid>
        <Field label="Currency" spacing="stack" testID="fld">
          <span />
        </Field>
      </FormGrid>,
    );
    expect(getComputedStyle(screen.getByTestId('fld')).marginBottom).toBe(px(FIELD_STACK_MARGIN_BOTTOM));
  });
});

describe('Field internal spacing matches the FORMS.md contract in gap mode', () => {
  it('spaces label -> control -> hint -> error with ONE uniform container gap', () => {
    render(
      <FormGrid>
        <Field error="Enter a value" hint="As registered" label="VAT" testID="fld">
          <span data-testid="control" />
        </Field>
      </FormGrid>,
    );
    const container = screen.getByTestId('fld');
    // Literal, for the same anti-tautology reason as above: the rendered gap must be the
    // contract's 6px, not merely "whatever FIELD_CONTRACT_GAP happens to say today".
    expect(getComputedStyle(container).gap).toBe('6px');
    expect(getComputedStyle(container).gap).toBe(px(FIELD_CONTRACT_GAP));

    // ...and no child re-states the spacing as a margin, which is what double-spaces against a gap.
    expect(getComputedStyle(screen.getByText(/VAT/)).marginBottom).toBe('0px');
    expect(getComputedStyle(screen.getByText('As registered')).marginTop).toBe('0px');
    expect(getComputedStyle(screen.getByText('Enter a value')).marginTop).toBe('0px');
  });

  it('keeps the historical child margins in stack mode', () => {
    render(
      <Field error="Enter a value" hint="As registered" label="VAT" testID="fld">
        <span />
      </Field>,
    );
    expect(getComputedStyle(screen.getByText(/VAT/)).marginBottom).toBe(px(FIELD_STACK_LABEL_MARGIN_BOTTOM));
    expect(getComputedStyle(screen.getByText('As registered')).marginTop).toBe(px(FIELD_STACK_CHILD_MARGIN_TOP));
    expect(getComputedStyle(screen.getByText('Enter a value')).marginTop).toBe(px(FIELD_STACK_CHILD_MARGIN_TOP));
  });

  it('renders the contract order: label, control, hint, error', () => {
    render(
      <Field error="Enter a value" hint="As registered" label="VAT" testID="fld">
        <span data-testid="control" />
      </Field>,
    );
    const texts = Array.from(screen.getByTestId('fld').children).map((el) => el.textContent);
    // FieldLabel emits `{label}{' '}` so a marker can follow — hence the trailing space.
    expect(texts).toEqual(['VAT ', '', 'As registered', 'Enter a value']);
  });
});

describe('ChipSelector and Field stay in lockstep', () => {
  /**
   * The drift this stops: `ChipSelector` used to carry `marginBottom: -8` whose comment claimed it
   * was compensating for `Field`'s 16px. It was not — it cancelled the chips' OWN gutter — but the
   * comment was believed, and a change to `Field` would have been made "in lockstep" with a margin
   * that had nothing to do with it. Asserting the two blocks occupy the SAME box in BOTH models is
   * what makes the relationship checkable instead of folkloric.
   */
  it.each(['stack', 'gap'] as const)('occupies the same box as a bare Field in %s mode', (spacing) => {
    const { unmount } = render(
      <Field label="Pick" spacing={spacing} testID="probe">
        <span />
      </Field>,
    );
    const fieldBox = getComputedStyle(screen.getByTestId('probe'));
    const expected = { marginBottom: fieldBox.marginBottom, gap: fieldBox.gap };
    unmount();

    render(
      <ChipSelector
        label="Pick"
        options={OPTIONS}
        spacing={spacing}
        testID="probe"
        value="a"
        onChange={noop}
      />,
    );
    const chipBox = getComputedStyle(screen.getByTestId('probe'));
    expect({ marginBottom: chipBox.marginBottom, gap: chipBox.gap }).toEqual(expected);
  });

  it('leaves NO negative margin hanging off the chip row in either mode', () => {
    render(<ChipSelector label="Pick" options={OPTIONS} testID="probe" value="a" onChange={noop} />);
    // The chip row is the Field's second child (label, then the group).
    const chipRow = screen.getByTestId('probe').children[1];
    const rowStyle = getComputedStyle(chipRow);
    expect(rowStyle.marginBottom).toBe('0px');
    expect(rowStyle.gap).toBe('8px');
  });
});

describe('a mixed-control row shares one box model', () => {
  /**
   * The original complaint that started this campaign: a dropdown, a text field and a chip group in
   * one row started at different heights. The cause is always the same — one of them carries a
   * different label metric or a different container margin, so its control box begins at a
   * different offset.
   *
   * jsdom has NO layout engine, so this CANNOT measure y-positions; claiming otherwise would be the
   * "pure helpers green, integration broken" failure. What it can prove is the box model each cell
   * contributes, which is the whole of the cause. The rendered baseline itself is verified in the
   * browser (visual QA), not here.
   */
  it('gives every control type the identical label metric and container box', () => {
    render(
      <FormGrid>
        <FormField label="Name" />
        <Field label="Plan">
          <span />
        </Field>
        <ChipSelector label="Tier" options={OPTIONS} value="a" onChange={noop} />
      </FormGrid>,
    );

    // Selected via the label's parent rather than a testID: `FormField` forwards `testID` to the
    // INPUT (it spreads `TextInputProps`), so there is no testID handle on its field block. Every
    // control type does own its label, so the label's parent IS the block, uniformly.
    const blockOf = (text: string): Element => {
      const parent = screen.getByText(new RegExp(text)).parentElement;
      if (parent === null) throw new Error(`no field block for ${text}`);
      return parent;
    };

    const boxes = ['Name', 'Plan', 'Tier'].map((text) => {
      const style = getComputedStyle(blockOf(text));
      return { marginBottom: style.marginBottom, marginTop: style.marginTop, gap: style.gap };
    });
    expect(boxes[1]).toEqual(boxes[0]);
    expect(boxes[2]).toEqual(boxes[0]);

    const labels = ['Name', 'Plan', 'Tier'].map((text) => {
      const style = getComputedStyle(screen.getByText(new RegExp(text)));
      return { fontSize: style.fontSize, fontWeight: style.fontWeight, marginBottom: style.marginBottom };
    });
    expect(labels[1]).toEqual(labels[0]);
    expect(labels[2]).toEqual(labels[0]);
  });
});
