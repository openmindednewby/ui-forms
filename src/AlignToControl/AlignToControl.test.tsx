import { render, screen } from '@testing-library/react';

import { Field } from '../Field/Field';
import { FormCell } from '../FormGrid/FormCell';
import { FormGrid } from '../FormGrid/FormGrid';

import { AlignToControl } from './AlignToControl';

describe('AlignToControl', () => {
  it('inside a FormGrid, spaces its label line with the same gap as the Field beside it', () => {
    render(
      <FormGrid>
        <Field label="Email" testID="field">
          <input />
        </Field>
        <AlignToControl testID="action">
          <button type="button">Send</button>
        </AlignToControl>
      </FormGrid>,
    );

    const fieldGap = getComputedStyle(screen.getByTestId('field')).gap;

    expect(getComputedStyle(screen.getByTestId('action')).gap).toBe(fieldGap);
  });

  it('outside a grid, gives its label line the same bottom margin as a stacked Field label', () => {
    render(
      <>
        <Field label="Email">
          <input />
        </Field>
        <AlignToControl testID="action">
          <button type="button">Send</button>
        </AlignToControl>
      </>,
    );

    const labelLine = screen.getByTestId('action-label-line');

    expect(getComputedStyle(labelLine).marginBottom).toBe(getComputedStyle(screen.getByText('Email')).marginBottom);
  });

  it('with the control label variant, uses the control label font size so the line height matches', () => {
    render(
      <>
        <Field label="Status" labelVariant="control">
          <input />
        </Field>
        <AlignToControl labelVariant="control" testID="action">
          <button type="button">Go</button>
        </AlignToControl>
      </>,
    );

    const labelLine = screen.getByTestId('action-label-line');

    expect(getComputedStyle(labelLine).fontSize).toBe(getComputedStyle(screen.getByText('Status')).fontSize);
  });

  it('hides its label line from assistive tech, so the row announces no phantom label', () => {
    render(
      <AlignToControl testID="action">
        <button type="button">Send</button>
      </AlignToControl>,
    );

    const labelLine = screen.getByTestId('action-label-line');

    expect(labelLine.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('FormCell alignToControl', () => {
  it('with alignToControl, wraps the cell content in a hidden label line', () => {
    render(
      <FormGrid>
        <FormCell alignToControl testID="cell">
          <button type="button">Add</button>
        </FormCell>
      </FormGrid>,
    );

    const cell = screen.getByTestId('cell');

    expect(cell.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('without alignToControl, renders the content with no label line', () => {
    render(
      <FormGrid>
        <FormCell testID="cell">
          <button type="button">Add</button>
        </FormCell>
      </FormGrid>,
    );

    const cell = screen.getByTestId('cell');

    expect(cell.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
