import React from 'react';

import { TouchableOpacity, View, type ViewProps } from 'react-native';

import { CHIP_HIT_SLOP, TRANSPARENT_COLOR } from '../constants';
import type { ChipProps } from '../types';

import { chipLabelLayout } from '../utils/chipLabelLayout';

import { ChipContent } from './ChipContent';
import { chipStyles } from './chipStyles';

/** A single solid chip — the original filled-pill look (unchanged for existing consumers). */
export function SolidChip<T extends string | number>(props: ChipProps<T>): React.ReactElement {
  const { option, selected, disabled, colors, testID, accessibilityHint, onPress } = props;
  const backgroundColor = selected ? colors.primary : TRANSPARENT_COLOR;
  const textColor = selected ? colors.onPrimary : colors.textStrong;
  const layout = chipLabelLayout(option.labelWrap);
  // RNW forwards `tabIndex` to the DOM, but RN's TouchableOpacity types omit it (ViewProps has it).
  const rovingTabStop: Pick<ViewProps, 'tabIndex'> = { tabIndex: props.tabIndex };
  return (
    <TouchableOpacity
      ref={props.hostRef}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={option.label}
      accessibilityRole={props.accessibilityRole}
      accessibilityState={{ selected, disabled }}
      aria-checked={props.ariaChecked}
      aria-pressed={props.ariaPressed}
      disabled={disabled}
      hitSlop={CHIP_HIT_SLOP}
      style={layout.boxStyle}
      testID={testID}
      onPress={onPress}
      {...rovingTabStop}
    >
      <View style={[chipStyles.chip, { borderColor: colors.border, backgroundColor }, layout.boxStyle]}>
        <ChipContent
          icon={option.icon}
          label={option.label}
          numberOfLines={layout.numberOfLines}
          textStyle={[chipStyles.chipText, { color: textColor }, layout.textStyle]}
        />
      </View>
    </TouchableOpacity>
  );
}
