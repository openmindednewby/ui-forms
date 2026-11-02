import React, { useState } from 'react';

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { useFocusRing } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import { FormField } from '../FormField/FormField';

const DEFAULT_PREVIEW_PX = 48;
const PREVIEW_RADIUS = 8;
const GAP = 8;
const TITLE_FONT_SIZE = 14;
const HELP_FONT_SIZE = 13;

const styles = StyleSheet.create({
  help: { flex: 1, fontSize: HELP_FONT_SIZE },
  root: { gap: GAP },
  tile: { alignItems: 'center', flexDirection: 'row', gap: GAP },
  title: { fontSize: TITLE_FONT_SIZE, fontWeight: '700' },
  toggle: { alignSelf: 'flex-start', justifyContent: 'center', minHeight: MIN_TOUCH_TARGET_PX },
  toggleText: { fontSize: TITLE_FONT_SIZE, fontWeight: '700', textDecorationLine: 'underline' },
});

/** Every string the field shows; all pre-localized. */
export interface UploadWithLinkLabels {
  title: string;
  help?: string;
  pasteToggle: string;
  pasteToggleHint: string;
  link: string;
  linkHint: string;
  linkPlaceholder: string;
}

export interface UploadWithLinkFieldProps {
  value: string | null | undefined;
  onChange: (url: string) => void;
  labels: UploadWithLinkLabels;
  /** The upload control, e.g. ui-media `ImagePickerButton`; its transport stays with the app. */
  uploadControl: React.ReactNode;
  /** The link input; the others are `${testID}-preview` and `${testID}-paste`. */
  testID: string;
  disabled?: boolean;
  previewSize?: number;
}

/** An image field: preview, an upload control, and a link input revealed on request. */
export const UploadWithLinkField = ({
  value,
  onChange,
  labels,
  uploadControl,
  testID,
  disabled = false,
  previewSize = DEFAULT_PREVIEW_PX,
}: UploadWithLinkFieldProps): React.ReactElement => {
  const { theme } = useUi();
  const ring = useFocusRing();
  const url = value ?? '';
  const [pasting, setPasting] = useState(url !== '');
  const previewBox = { borderRadius: PREVIEW_RADIUS, height: previewSize, width: previewSize };
  return (
    <View style={styles.root}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{labels.title}</Text>
      <View style={styles.tile}>
        {url === ''
          ? <View style={[previewBox, { backgroundColor: theme.colors.border }]} />
          : <Image accessible={false} source={{ uri: url }} style={previewBox} testID={`${testID}-preview`} />}
        {labels.help === undefined ? null : (
          <Text style={[styles.help, { color: theme.colors.text }]}>{labels.help}</Text>
        )}
      </View>
      {uploadControl}
      <Pressable
        accessibilityHint={labels.pasteToggleHint}
        accessibilityLabel={labels.pasteToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: pasting }}
        aria-expanded={pasting}
        style={[styles.toggle, ring.ringStyle]}
        testID={`${testID}-paste`}
        onBlur={ring.onBlur}
        onFocus={ring.onFocus}
        onPress={() => setPasting(!pasting)}
      >
        <Text style={[styles.toggleText, { color: theme.colors.text }]}>{labels.pasteToggle}</Text>
      </Pressable>
      {pasting ? (
        <FormField
          accessibilityHint={labels.linkHint}
          editable={!disabled}
          label={labels.link}
          placeholder={labels.linkPlaceholder}
          testID={testID}
          value={url}
          onChangeText={onChange}
        />
      ) : null}
    </View>
  );
};
