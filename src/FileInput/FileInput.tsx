import React from 'react';

import { Platform, Pressable, StyleSheet, Text } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { useUi } from '@dloizides/ui-feedback';

const IS_WEB = Platform.OS === 'web';
const INPUT_FONT = 14;

const styles = StyleSheet.create({
  nativeButton: { minHeight: MIN_TOUCH_TARGET_PX, minWidth: MIN_TOUCH_TARGET_PX, justifyContent: 'center' },
  nativeText: { fontSize: INPUT_FONT },
});

export interface FileInputProps {
  /** PRE-LOCALIZED accessible name of the control. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  /** Called with the chosen files; never called with an empty list. */
  onFiles: (files: readonly File[]) => void;
  /** Accepted types, e.g. `.pdf,image/*`. */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** DOM id, e.g. the `Field` render-child `controlId`, so `<label for>` names the input. */
  id?: string;
  describedById?: string;
  /** PRE-LOCALIZED button text off web. Defaults to `accessibilityLabel`. */
  nativeLabel?: string;
  /** Off web there is no file input: the caller opens its own picker here. */
  onNativePick?: () => void;
  /** testID of the web `<input type="file">` (Playwright `setInputFiles`) or the native button. */
  testID: string;
}

/** A file picker atom: a real `<input type="file">` on web, a pressable that hands off to the caller's picker elsewhere. */
export function FileInput({
  accessibilityLabel,
  accessibilityHint,
  onFiles,
  accept,
  multiple = false,
  disabled = false,
  id,
  describedById,
  nativeLabel,
  onNativePick,
  testID,
}: FileInputProps): React.ReactElement {
  const { theme } = useUi();
  const { colors } = theme;

  if (!IS_WEB) {
    return (
      <Pressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        style={styles.nativeButton}
        testID={testID}
        onPress={onNativePick}
      >
        <Text style={[styles.nativeText, { color: colors.text }]}>{nativeLabel ?? accessibilityLabel}</Text>
      </Pressable>
    );
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) onFiles(files);
  };

  return (
    <input
      accept={accept}
      aria-describedby={describedById}
      aria-label={accessibilityLabel}
      data-testid={testID}
      disabled={disabled}
      id={id}
      multiple={multiple}
      style={{ minHeight: MIN_TOUCH_TARGET_PX, color: colors.text, fontSize: INPUT_FONT, fontFamily: 'inherit' }}
      title={accessibilityHint}
      type="file"
      onChange={handleChange}
    />
  );
}

export default FileInput;
