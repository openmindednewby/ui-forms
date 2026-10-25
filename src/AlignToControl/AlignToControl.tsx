import React from 'react';

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { fieldSpacingStyleSet, resolveFieldSpacing, type FieldSpacing } from '../Field/fieldSpacing';
import { resolveLabelVariantStyle, type FieldLabelVariant } from '../Field/labelVariants';
import { useIsGapOwned } from '../FormGrid/formGridContext';

const LABEL_LINE_PLACEHOLDER = ' ';

const styles = StyleSheet.create({
  labelLine: {
    userSelect: 'none',
  },
});

export interface AlignToControlProps {
  children: React.ReactNode;
  labelVariant?: FieldLabelVariant;
  spacing?: FieldSpacing;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Puts a button or other unlabelled control on the input line of the labelled `Field`s beside it. */
export const AlignToControl = ({
  children,
  labelVariant,
  spacing,
  style,
  testID,
}: AlignToControlProps): React.ReactElement => {
  const spacingStyles = fieldSpacingStyleSet(resolveFieldSpacing(spacing, useIsGapOwned()));
  const labelLineTestID = testID !== undefined ? `${testID}-label-line` : undefined;

  return (
    <View style={[spacingStyles.container, style]} testID={testID}>
      <Text
        accessibilityElementsHidden
        aria-hidden
        importantForAccessibility="no"
        style={[spacingStyles.label, resolveLabelVariantStyle(labelVariant), styles.labelLine]}
        testID={labelLineTestID}
      >
        {LABEL_LINE_PLACEHOLDER}
      </Text>
      {children}
    </View>
  );
};

export default AlignToControl;
