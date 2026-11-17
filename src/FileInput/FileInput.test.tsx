import { fireEvent, render, screen } from '@testing-library/react';

import { FileInput } from './FileInput';

function renderInput(overrides: Partial<React.ComponentProps<typeof FileInput>> = {}): jest.Mock {
  const onFiles = jest.fn();
  render(
    <FileInput
      accept=".pdf,image/*"
      accessibilityHint="Adds a document to the case"
      accessibilityLabel="Upload document"
      testID="doc-upload"
      onFiles={onFiles}
      {...overrides}
    />,
  );
  return onFiles;
}

describe('FileInput', () => {
  it('on web, renders a file input under the testID with the accept list', () => {
    renderInput();

    const input = screen.getByTestId('doc-upload') as HTMLInputElement;

    expect([input.tagName, input.type, input.accept]).toEqual(['INPUT', 'file', '.pdf,image/*']);
  });

  it('with chosen files, calls onFiles with every file', () => {
    const onFiles = renderInput({ multiple: true });
    const first = new File(['a'], 'a.pdf', { type: 'application/pdf' });
    const second = new File(['b'], 'b.png', { type: 'image/png' });

    fireEvent.change(screen.getByTestId('doc-upload'), { target: { files: [first, second] } });

    expect(onFiles).toHaveBeenCalledWith([first, second]);
  });

  it('with no file chosen, does not call onFiles', () => {
    const onFiles = renderInput();

    fireEvent.change(screen.getByTestId('doc-upload'), { target: { files: [] } });

    expect(onFiles).not.toHaveBeenCalled();
  });

  it('with a label, hint and described-by id, exposes them on the input', () => {
    renderInput({ describedById: 'doc-help', id: 'doc-control' });

    const input = screen.getByTestId('doc-upload');

    expect([input.getAttribute('aria-label'), input.getAttribute('title'), input.getAttribute('aria-describedby'), input.id]).toEqual(['Upload document', 'Adds a document to the case', 'doc-help', 'doc-control']);
  });

  it('with disabled set, disables the input', () => {
    renderInput({ disabled: true });

    const input = screen.getByTestId('doc-upload') as HTMLInputElement;

    expect(input.disabled).toBe(true);
  });
});
