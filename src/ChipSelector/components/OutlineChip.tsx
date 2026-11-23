import React from 'react';

import { Pressable, View } from 'react-native';

import { CHIP_HIT_SLOP } from '../constants';
import type { ChipProps } from '../types';

import { chipLabelLayout } from '../utils/chipLabelLayout';
import { chipFill, chipSizeLook } from '../utils/chipLook';

import { ChipContent } from './ChipContent';
import { chipStyles } from './chipStyles';

/** A single outline chip — owns its own hover state (web) for the border/ink lift. */
export function OutlineChip<T extends string | number>(props: ChipProps<T>): React.ReactElement {
  const { option, selected, disabled, colors, testID, accessibilityHint, onPress } = props;
  const [hovered, setHovered] = React.useState(false);
  const active = selected || hovered;

  const borderColor = active ? colors.primary : colors.border;
  const fill = chipFill({
    selected,
    selectedFill: props.selectedFill,
    ink: colors.textStrong,
    rest: { backgroundColor: selected ? colors.tint : colors.muted, textColor: active ? colors.primary : colors.textMuted },
  });
  const sized = chipSizeLook(props.size);
  const layout = chipLabelLayout(option.labelWrap);

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
      style={[sized.hitBox, layout.boxStyle]}
      tabIndex={props.tabIndex}
      testID={testID}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={onPress}
    >
      <View style={[chipStyles.chipOutline, sized.visual, { borderColor, backgroundColor: fill.backgroundColor }, layout.boxStyle]}>
        <ChipContent
          checkColor={fill.checkColor}
          checkTestID={`${testID}-check`}
          icon={option.icon}
          label={option.label}
          numberOfLines={layout.numberOfLines}
          textStyle={[chipStyles.chipText, chipStyles.chipTextOutline, sized.text, { color: fill.textColor }, layout.textStyle]}
        />
      </View>
    </Pressable>
  );
}
