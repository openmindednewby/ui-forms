import React from 'react';

import { Pressable, View } from 'react-native';

import { CHIP_HIT_SLOP } from '../constants';
import type { ChipProps } from '../types';

import { ChipContent } from './ChipContent';
import { chipStyles } from './chipStyles';

/** A single outline chip — owns its own hover state (web) for the border/ink lift. */
export function OutlineChip<T extends string | number>(props: ChipProps<T>): React.ReactElement {
  const { option, selected, disabled, colors, testID, accessibilityHint, onPress } = props;
  const [hovered, setHovered] = React.useState(false);
  const active = selected || hovered;

  const borderColor = active ? colors.primary : colors.border;
  const backgroundColor = selected ? colors.tint : colors.muted;
  // Selected AND hovered both lift the ink to the primary colour (v1's indigo / indigo-dark);
  // the theme surface only guarantees the 500 step, so both use it — border + fill carry the state.
  const textColor = active ? colors.primary : colors.textMuted;

  return (
    <Pressable
      ref={props.hostRef}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={option.label}
      accessibilityRole={props.accessibilityRole}
      accessibilityState={{ selected, disabled }}
      aria-checked={props.ariaChecked}
      aria-pressed={props.ariaPressed}
      disabled={disabled}
      hitSlop={CHIP_HIT_SLOP}
      tabIndex={props.tabIndex}
      testID={testID}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={onPress}
    >
      <View style={[chipStyles.chipOutline, { borderColor, backgroundColor }]}>
        <ChipContent
          icon={option.icon}
          label={option.label}
          textStyle={[chipStyles.chipText, chipStyles.chipTextOutline, { color: textColor }]}
        />
      </View>
    </Pressable>
  );
}
