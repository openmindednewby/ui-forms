import React, { useState, type CSSProperties } from 'react';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { useUi } from '@dloizides/ui-feedback';

const FIELD_FONT = 14;
const FIELD_RADIUS = 8;
const FIELD_PAD_H = 12;
const DISABLED_OPACITY = 0.5;
const HIDDEN_INPUT: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' };

export interface WebFileFieldProps {
  inputProps: React.InputHTMLAttributes<HTMLInputElement> & { 'data-testid': string };
  placeholder: string;
  onFiles: (files: readonly File[]) => void;
}

/** The styled web file field: a themed box showing the chosen file names or the placeholder over a transparent file input. */
export function WebFileField({ inputProps, placeholder, onFiles }: WebFileFieldProps): React.ReactElement {
  const { theme } = useUi();
  const { colors } = theme;
  const [names, setNames] = useState('');
  const chosen = names !== '';
  const box: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET_PX,
    paddingInline: FIELD_PAD_H,
    borderRadius: FIELD_RADIUS,
    border: `1px solid ${colors.border}`,
    background: colors.surface,
    color: chosen ? colors.text : colors.textSecondary,
    fontSize: FIELD_FONT,
    fontFamily: 'inherit',
    opacity: inputProps.disabled === true ? DISABLED_OPACITY : 1,
    boxSizing: 'border-box',
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setNames(files.map((file) => file.name).join(', '));
    onFiles(files);
  };

  return (
    <div data-testid={`${inputProps['data-testid']}-field`} style={box}>
      <span data-testid={`${inputProps['data-testid']}-name`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chosen ? names : placeholder}</span>
      <input {...inputProps} style={HIDDEN_INPUT} type="file" onChange={handleChange} />
    </div>
  );
}
