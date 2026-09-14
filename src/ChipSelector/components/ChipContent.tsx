import React from 'react';

import { Text, View, type StyleProp, type TextStyle } from 'react-native';

import { chipStyles } from './chipStyles';

interface ChipContentProps {
  icon: React.ReactNode;
  label: string;
  textStyle: StyleProp<TextStyle>;
}

/** Chip label, preceded by the option's decorative icon when one is supplied. */
export function ChipContent({ icon, label, textStyle }: ChipContentProps): React.ReactElement {
  const text = <Text style={textStyle}>{label}</Text>;
  if (icon === undefined || icon === null)
    return text;

  return (
    <View style={chipStyles.chipContent}>
      <View aria-hidden={true}>{icon}</View>
      {text}
    </View>
  );
}
