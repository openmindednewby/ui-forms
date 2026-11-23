import React from 'react';

import { Text, View, type StyleProp, type TextStyle } from 'react-native';

import { SvgIcon } from '@dloizides/ui-icons';

import { chipStyles } from './chipStyles';

const CHECK_SIZE = 12;

interface ChipContentProps {
  icon: React.ReactNode;
  label: string;
  textStyle: StyleProp<TextStyle>;
  numberOfLines?: number;
  checkColor?: string;
  checkTestID: string;
}

/** Chip label, preceded by a check mark when `checkColor` is set and the option's decorative icon. */
export function ChipContent(props: ChipContentProps): React.ReactElement {
  const { icon, label, textStyle, numberOfLines, checkColor } = props;
  const text = (
    <Text numberOfLines={numberOfLines} style={textStyle}>
      {label}
    </Text>
  );
  const hasIcon = icon !== undefined && icon !== null;
  if (!hasIcon && checkColor === undefined)
    return text;

  return (
    <View style={chipStyles.chipContent}>
      {checkColor === undefined ? null : (
        <View aria-hidden={true} testID={props.checkTestID}>
          <SvgIcon color={checkColor} name="check" size={CHECK_SIZE} />
        </View>
      )}
      {hasIcon ? <View aria-hidden={true}>{icon}</View> : null}
      {text}
    </View>
  );
}
