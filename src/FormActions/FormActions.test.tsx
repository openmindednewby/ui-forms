import { render, screen, fireEvent } from '@testing-library/react';

import { FormActions } from './FormActions';

const noop = (): void => undefined;

describe('FormActions cancel slot', () => {
  it('renders no cancel button when onCancel is omitted', () => {
    render(<FormActions saveLabel="Save" onSave={noop} />);
    expect(screen.queryByTestId('cancel-button')).toBeNull();
    expect(screen.getByTestId('save-button')).toBeTruthy();
  });

  it('renders cancel when onCancel is supplied', () => {
    render(<FormActions cancelLabel="Cancel" saveLabel="Save" onCancel={noop} onSave={noop} />);
    expect(screen.getByTestId('cancel-button')).toBeTruthy();
  });
});

describe('FormActions callbacks', () => {
  it('invokes onSave and onCancel from their own buttons', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();
    render(<FormActions cancelLabel="Cancel" saveLabel="Save" onCancel={onCancel} onSave={onSave} />);

    fireEvent.click(screen.getByTestId('save-button'));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});

describe('FormActions disabled state machine', () => {
  it('disables BOTH actions while saving, so the form cannot be abandoned mid-write', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();
    render(
      <FormActions saving cancelLabel="Cancel" saveLabel="Save" onCancel={onCancel} onSave={onSave} />,
    );

    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(onCancel).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('save-button'));
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saveDisabled blocks save WITHOUT blocking cancel — an invalid form stays escapable', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();
    render(
      <FormActions saveDisabled cancelLabel="Cancel" saveLabel="Save" onCancel={onCancel} onSave={onSave} />,
    );

    fireEvent.click(screen.getByTestId('save-button'));
    expect(onSave).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

describe('FormActions localization contract', () => {
  it('renders the pre-localized labels verbatim — no i18n runtime in the package', () => {
    render(
      <FormActions cancelLabel="Annuler" saveLabel="Enregistrer" onCancel={noop} onSave={noop} />,
    );
    expect(screen.getByTestId('save-button').textContent).toContain('Enregistrer');
    expect(screen.getByTestId('cancel-button').textContent).toContain('Annuler');
  });

  it('falls back to the label for the accessible hint when no hint is supplied', () => {
    render(<FormActions saveLabel="Save" onSave={noop} />);
    expect(screen.getByTestId('save-button').getAttribute('aria-label')).toBe('Save');
  });
});

describe('FormActions tab order', () => {
  it('puts the primary action LAST, so tab reaches Cancel before Save', () => {
    render(<FormActions cancelLabel="Cancel" saveLabel="Save" onCancel={noop} onSave={noop} testID="row" />);
    const kids = Array.from(screen.getByTestId('row').children);
    expect(kids[0]).toBe(screen.getByTestId('cancel-button'));
    expect(kids[1]).toBe(screen.getByTestId('save-button'));
  });
});

describe('FormActions testID overrides', () => {
  it('defaults to the twins testIDs so existing Playwright selectors keep matching', () => {
    render(<FormActions cancelLabel="Cancel" saveLabel="Save" onCancel={noop} onSave={noop} />);
    expect(screen.getByTestId('save-button')).toBeTruthy();
    expect(screen.getByTestId('cancel-button')).toBeTruthy();
  });

  it('accepts overrides for a screen hosting several action rows', () => {
    render(
      <FormActions
        cancelLabel="Cancel"
        cancelTestID="dlg-cancel"
        saveLabel="Save"
        saveTestID="dlg-save"
        onCancel={noop}
        onSave={noop}
      />,
    );
    expect(screen.getByTestId('dlg-save')).toBeTruthy();
    expect(screen.getByTestId('dlg-cancel')).toBeTruthy();
  });
});
