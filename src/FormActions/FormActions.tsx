/**
 * `FormActions` — the submit/cancel button row every form ends with.
 *
 * Promoted from the BYTE-IDENTICAL `erevna-web/src/components/Forms/FormActions.tsx` and
 * `katalogos-web/src/components/Forms/FormActions.tsx` (68 lines each, `diff` returns nothing);
 * all seven apps hand-roll the same row. Buttons come from the shared `@dloizides/ui-buttons` kit
 * rather than being forked here, so there is exactly one button implementation in the estate.
 *
 * The layout implements the contract's actions row
 * (`…/wwwroot/shared/FORMS.md` → "Actions row"): the primary action is LAST in DOM order, so tab
 * order reaches Cancel before Save, and `saving` drives the primary button's spinner rather than
 * disabling-and-relabelling it.
 *
 * Two minimal generalizations over the app-local twins:
 *  1. Labels and hints arrive as PRE-LOCALIZED props. The twins called `FM()` internally, which
 *     cannot work here: aml-v2 localizes via `@dloizides/i18n` with positional `{0}` params while
 *     the other six use i18next `{{p1}}`, and nothing bridges them.
 *  2. `testID`s are overridable but default to the twins' `save-button` / `cancel-button`, so the
 *     existing Playwright selectors in every app keep matching.
 */
import React from 'react';

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from '@dloizides/ui-buttons';

/** Gap between the actions, matching the contract's `.actions { gap: 12px }`. */
const ACTIONS_GAP = 12;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: ACTIONS_GAP,
  },
});

export interface FormActionsProps {
  /** Submit handler. May be async — the shared Button drives its own spinner for the promise. */
  onSave: () => void | Promise<unknown>;
  /** Cancel handler. Omit it entirely to render a save-only row (no empty Cancel slot). */
  onCancel?: () => void | Promise<unknown>;
  /** Pre-localized label for the primary action. */
  saveLabel: string;
  /** Pre-localized label for the cancel action. Required whenever `onCancel` is supplied. */
  cancelLabel?: string;
  /** Pre-localized accessibility hint for the primary action. Falls back to its label. */
  saveHint?: string;
  /** Pre-localized accessibility hint for the cancel action. Falls back to its label. */
  cancelHint?: string;
  /** In-flight submit: spins the primary action and disables cancel so the form can't be abandoned mid-write. */
  saving?: boolean;
  /** Disables the primary action independently of `saving` (e.g. an invalid form). */
  saveDisabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  saveTestID?: string;
  cancelTestID?: string;
  testID?: string;
}

export const FormActions = ({
  onSave,
  onCancel,
  saveLabel,
  cancelLabel = '',
  saveHint,
  cancelHint,
  saving = false,
  saveDisabled = false,
  containerStyle,
  saveTestID = 'save-button',
  cancelTestID = 'cancel-button',
  testID,
}: FormActionsProps): React.ReactElement => (
  <View style={[styles.container, containerStyle]} testID={testID}>
    {typeof onCancel === 'function' ? (
      <Button
        accessibilityHint={cancelHint ?? cancelLabel}
        accessibilityLabel={cancelLabel}
        disabled={saving}
        label={cancelLabel}
        testID={cancelTestID}
        variant="outline"
        onPress={onCancel}
      />
    ) : null}

    <Button
      accessibilityHint={saveHint ?? saveLabel}
      accessibilityLabel={saveLabel}
      disabled={saveDisabled}
      label={saveLabel}
      loading={saving}
      testID={saveTestID}
      variant="primary"
      onPress={onSave}
    />
  </View>
);

export default FormActions;
