import React from 'react';

import { StyleSheet, Switch, View } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';

const BOX_SLOT_PAD_H = 10;

const styles = StyleSheet.create({
  row: {
    minWidth: MIN_TOUCH_TARGET_PX,
    minHeight: MIN_TOUCH_TARGET_PX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BOX_SLOT_PAD_H,
  },
});

export interface SwitchSlotProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled: boolean;
  testID: string;
  accessibilityHint?: string;
  activeTrackColor?: string;
  inBox?: boolean;
}

/** The one switch element shared by both FormSwitch variants; pointer input goes to the parent hit box. */
export const SwitchSlot = ({
  label,
  value,
  onValueChange,
  disabled,
  testID,
  accessibilityHint,
  activeTrackColor,
  inBox = false,
}: SwitchSlotProps): React.ReactElement => (
  <View pointerEvents="none" style={inBox ? styles.box : styles.row} testID={`${testID}-hitbox`}>
    <Switch
      accessibilityHint={accessibilityHint ?? label}
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      testID={`${testID}-switch`}
      trackColor={activeTrackColor === undefined ? undefined : { true: activeTrackColor }}
      value={value}
      onValueChange={onValueChange}
    />
  </View>
);
