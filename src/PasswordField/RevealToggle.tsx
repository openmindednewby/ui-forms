import React from 'react';

import { Pressable, StyleSheet } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { SvgIcon } from '@dloizides/ui-icons';

const ICON_SIZE = 20;

const styles = StyleSheet.create({
  button: { width: MIN_TOUCH_TARGET_PX, height: MIN_TOUCH_TARGET_PX, alignItems: 'center', justifyContent: 'center' },
});

export interface RevealToggleProps {
  revealed: boolean;
  onToggle: () => void;
  onPressIn?: () => void;
  showLabel: string;
  hideLabel: string;
  color: string;
  testID: string;
}

export function RevealToggle({ revealed, onToggle, onPressIn, showLabel, hideLabel, color, testID }: RevealToggleProps): React.ReactElement {
  const label = revealed ? hideLabel : showLabel;
  return (
    <Pressable
      accessibilityHint={label}
      accessibilityLabel={label}
      accessibilityRole="button"
      aria-pressed={revealed}
      style={styles.button}
      testID={testID}
      onPress={onToggle}
      onPressIn={onPressIn}
    >
      <SvgIcon color={color} name={revealed ? 'eyeOff' : 'eye'} size={ICON_SIZE} />
    </Pressable>
  );
}
