import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { resolveLabelVariantStyle } from '../../Field/labelVariants';
import { FORM_GRID_DEFAULT_GAP } from '../../FormGrid/FormGrid';
import { LINE_ITEMS_CARD_BORDER, LINE_ITEMS_CARD_PADDING } from '../utils/lineItemsLayout';

const CARD_RADIUS = 8;
const HEADER_GAP = 8;

const styles = StyleSheet.create({
  card: {
    borderRadius: CARD_RADIUS,
    borderWidth: LINE_ITEMS_CARD_BORDER,
    gap: FORM_GRID_DEFAULT_GAP,
    padding: LINE_ITEMS_CARD_PADDING,
  },
  header: { alignItems: 'center', columnGap: HEADER_GAP, flexDirection: 'row', flexWrap: 'wrap', rowGap: HEADER_GAP },
  spacer: { flexGrow: 1 },
});

interface LineItemCardProps {
  title: string;
  header?: React.ReactNode;
  removeAction?: React.ReactNode;
  children: React.ReactNode;
  testID: string;
}

/** One labelled line: a title row with a header slot and a remove action, then the line's cells. */
export const LineItemCard = ({ title, header, removeAction, children, testID }: LineItemCardProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors } = theme;

  return (
    <View
      aria-label={title}
      role="group"
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      testID={testID}
    >
      <View style={styles.header}>
        <Text style={[resolveLabelVariantStyle(), { color: colors.text }]} testID={`${testID}-title`}>
          {title}
        </Text>
        {header}
        <View style={styles.spacer} />
        {removeAction}
      </View>
      {children}
    </View>
  );
};
