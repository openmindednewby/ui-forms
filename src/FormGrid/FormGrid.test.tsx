/**
 * `FormGrid` / `FormCell` guards.
 *
 * These pin the two things the extraction is FOR: that the grid reproduces the box the fleet's ~177
 * hand-rolled copies produce (so adopting it is a no-op visually), and that the min-width /
 * flex-basis constants those copies vary are genuinely parameterised rather than re-hardcoded here.
 */
import { render, screen } from '@testing-library/react';

import { Field } from '../Field/Field';

import { FormCell } from './FormCell';
import {
  FORM_GRID_DEFAULT_BASIS,
  FORM_GRID_DEFAULT_GAP,
  FORM_GRID_DEFAULT_MIN_WIDTH,
  FormGrid,
} from './FormGrid';

const px = (value: number): string => `${String(value)}px`;

describe('FormGrid wrapping behaviour', () => {
  it('lays out as a wrapping row spaced by gap — the shape every copy hand-writes', () => {
    render(
      <FormGrid testID="grid">
        <FormCell>
          <span />
        </FormCell>
      </FormGrid>,
    );
    const style = getComputedStyle(screen.getByTestId('grid'));
    expect(style.flexDirection).toBe('row');
    expect(style.flexWrap).toBe('wrap');
    expect(style.gap).toBe(px(FORM_GRID_DEFAULT_GAP));
  });

  it('takes a custom gap, so a denser row does not have to fork the component', () => {
    render(
      <FormGrid gap={20} testID="grid">
        <span />
      </FormGrid>,
    );
    expect(getComputedStyle(screen.getByTestId('grid')).gap).toBe('20px');
  });
});

describe('FormCell min-width parameterisation', () => {
  it('inherits the grid metrics, so the common cell is a bare <FormCell>', () => {
    render(
      <FormGrid>
        <FormCell testID="cell">
          <span />
        </FormCell>
      </FormGrid>,
    );
    const style = getComputedStyle(screen.getByTestId('cell'));
    expect(style.minWidth).toBe(px(FORM_GRID_DEFAULT_MIN_WIDTH));
    expect(style.flexBasis).toBe(px(FORM_GRID_DEFAULT_BASIS));
    expect(style.flexGrow).toBe('1');
  });

  it('carries the grid-level metrics down — the 200/220/240/260 the fleet varies', () => {
    render(
      <FormGrid basis={220} minWidth={200}>
        <FormCell testID="cell">
          <span />
        </FormCell>
      </FormGrid>,
    );
    const style = getComputedStyle(screen.getByTestId('cell'));
    expect(style.minWidth).toBe('200px');
    expect(style.flexBasis).toBe('220px');
  });

  it('lets ONE cell override the row — aml-v2s fieldNarrow next to a wide name field', () => {
    render(
      <FormGrid basis={260} minWidth={220}>
        <FormCell testID="wide">
          <span />
        </FormCell>
        <FormCell basis={160} grow={false} minWidth={140} testID="narrow">
          <span />
        </FormCell>
      </FormGrid>,
    );
    const wide = getComputedStyle(screen.getByTestId('wide'));
    const narrow = getComputedStyle(screen.getByTestId('narrow'));
    expect(wide.minWidth).toBe('220px');
    expect(narrow.minWidth).toBe('140px');
    expect(narrow.flexBasis).toBe('160px');
    // `grow={false}` is what pins the narrow cell instead of letting it absorb the row's slack.
    expect(narrow.flexGrow).toBe('0');
  });

  it('falls back to the package defaults outside a grid rather than throwing', () => {
    render(
      <FormCell testID="cell">
        <span />
      </FormCell>,
    );
    expect(getComputedStyle(screen.getByTestId('cell')).minWidth).toBe(px(FORM_GRID_DEFAULT_MIN_WIDTH));
  });
});

describe('FormGrid owns the vertical rhythm of its fields', () => {
  it('does not leak gap-ownership to a sibling subtree outside it', () => {
    render(
      <>
        <FormGrid>
          <Field label="Inside" testID="inside">
            <span />
          </Field>
        </FormGrid>
        <Field label="Outside" testID="outside">
          <span />
        </Field>
      </>,
    );
    expect(getComputedStyle(screen.getByTestId('inside')).marginBottom).toBe('0px');
    expect(getComputedStyle(screen.getByTestId('outside')).marginBottom).toBe('16px');
  });

  it('reaches a Field nested inside a FormCell, not just a direct child', () => {
    render(
      <FormGrid>
        <FormCell>
          <Field label="Nested" testID="nested">
            <span />
          </Field>
        </FormCell>
      </FormGrid>,
    );
    expect(getComputedStyle(screen.getByTestId('nested')).marginBottom).toBe('0px');
  });
});
