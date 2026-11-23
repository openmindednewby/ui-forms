import React from 'react';

import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { useUi } from '@dloizides/ui-feedback';

import { Field } from '../Field/Field';

import { SwitchSlot, type SwitchSlotProps } from './SwitchSlot';

const BOX_RADIUS = 8;
const BOX_PAD_LEFT = 10;
const BOX_BORDER = 1;
const STATE_FONT_SIZE = 13;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TOUCH_TARGET_PX,
    borderWidth: BOX_BORDER,
    borderRadius: BOX_RADIUS,
    paddingLeft: BOX_PAD_LEFT,
  },
  state: {
    flex: 1,
    fontSize: STATE_FONT_SIZE,
  },
});

export interface FormSwitchBoxProps extends Omit<SwitchSlotProps, 'inBox'> {
  stateLabel?: string;
  description?: string;
  containerStyle?: ViewStyle;
}

/** FormSwitch `box` variant: a control-voice label over a bordered 44 px field box; the whole box toggles. */
export const FormSwitchBox = ({
  stateLabel,
  description,
  containerStyle,
  ...slot
}: FormSwitchBoxProps): React.ReactElement => {
  const { colors } = useUi().theme;
  const { disabled, onValueChange, value } = slot;
  const toggle = React.useCallback((): void => {
    if (!disabled) onValueChange(!value);
  }, [disabled, onValueChange, value]);
  const boxColors = React.useMemo<ViewStyle>(
    () => ({ borderColor: colors.border, backgroundColor: colors.surface }),
    [colors.border, colors.surface],
  );

  return (
    <Field containerStyle={containerStyle} hint={description} label={slot.label} labelVariant="control">
      {() => (
        <Pressable
          accessible={false}
          disabled={disabled}
          style={[styles.box, boxColors]}
          tabIndex={-1}
          testID={slot.testID}
          onPress={toggle}
        >
          <Text numberOfLines={1} style={[styles.state, { color: colors.text }]}>
            {stateLabel ?? ''}
          </Text>
          <SwitchSlot {...slot} inBox />
        </Pressable>
      )}
    </Field>
  );
};
