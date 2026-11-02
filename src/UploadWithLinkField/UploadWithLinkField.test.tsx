import { fireEvent, render, screen } from '@testing-library/react';

import { UploadWithLinkField } from './UploadWithLinkField';

const labels = {
  title: 'Browser icon',
  pasteToggle: 'Paste a link instead',
  pasteToggleHint: 'Shows a field for an image link',
  link: 'Image link',
  linkHint: 'The address of the image',
  linkPlaceholder: 'https://example.test/icon.png',
};

const upload = <div data-testid="upload-slot" />;

describe('UploadWithLinkField', () => {
  it('with no value, hides the link input until toggled', () => {
    const value = '';

    render(<UploadWithLinkField labels={labels} onChange={jest.fn()} testID="icon" uploadControl={upload} value={value} />);

    expect(screen.queryByTestId('icon')).toBeNull();
  });

  it('when the toggle is pressed, reveals the link input and sets aria-expanded', () => {
    render(<UploadWithLinkField labels={labels} onChange={jest.fn()} testID="icon" uploadControl={upload} value={null} />);

    fireEvent.click(screen.getByTestId('icon-paste'));

    expect(screen.queryByTestId('icon')).not.toBeNull();
    expect(screen.getByTestId('icon-paste').getAttribute('aria-expanded')).toBe('true');
  });

  it('with a value, starts with the link input open and shows the preview', () => {
    const value = 'https://example.test/a.png';

    render(<UploadWithLinkField labels={labels} onChange={jest.fn()} testID="icon" uploadControl={upload} value={value} />);

    expect(screen.queryByTestId('icon')).not.toBeNull();
    expect(screen.queryByTestId('icon-preview')).not.toBeNull();
  });

  it('when the link is typed, reports it through onChange', () => {
    const onChange = jest.fn();
    render(<UploadWithLinkField labels={labels} onChange={onChange} testID="icon" uploadControl={upload} value="https://a.test/1.png" />);

    fireEvent.change(screen.getByTestId('icon'), { target: { value: 'https://a.test/2.png' } });

    expect(onChange).toHaveBeenCalledWith('https://a.test/2.png');
  });

  it('with an upload control, renders the consumer slot', () => {
    const value = undefined;

    render(<UploadWithLinkField labels={labels} onChange={jest.fn()} testID="icon" uploadControl={upload} value={value} />);

    expect(screen.queryByTestId('upload-slot')).not.toBeNull();
  });

  it('when disabled, makes the link input read-only', () => {
    const disabled = true;

    render(<UploadWithLinkField disabled={disabled} labels={labels} onChange={jest.fn()} testID="icon" uploadControl={upload} value="https://a.test/1.png" />);

    expect(screen.getByTestId('icon').hasAttribute('readonly')).toBe(true);
  });
});
