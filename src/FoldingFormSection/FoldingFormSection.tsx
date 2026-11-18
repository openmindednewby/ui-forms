import React, { useCallback, useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { resolveLabelVariantStyle, type FieldLabelVariant } from '../Field/labelVariants';
import { GapOwnedProvider } from '../FormGrid/formGridContext';

const SECTION_GAP = 10;
const HEADER_GAP = 8;
const MIN_TARGET_PX = 44;
const MARKER_FONT_SIZE = 13;
const SUMMARY_FONT_SIZE = 12;
const DESCRIPTION_FONT_SIZE = 12;
const MARKER_OPEN = '▾';
const MARKER_FOLDED = '▸';

const styles = StyleSheet.create({
  section: { gap: SECTION_GAP },
  header: { flexDirection: 'row', alignItems: 'center', gap: HEADER_GAP, minHeight: MIN_TARGET_PX },
  marker: { fontSize: MARKER_FONT_SIZE },
  titleBlock: { flexShrink: 1, flexGrow: 1 },
  summary: { fontSize: SUMMARY_FONT_SIZE },
  body: { gap: SECTION_GAP },
  hidden: { display: 'none' },
  description: { fontSize: DESCRIPTION_FONT_SIZE },
});

let foldingSectionSeq = 0;

function useLegendId(): string {
  const [id] = useState(() => {
    foldingSectionSeq += 1;
    return `folding-form-section-legend-${String(foldingSectionSeq)}`;
  });
  return id;
}

interface WebGroupA11y {
  'aria-labelledby'?: string;
}

export interface FoldingFormSectionProps {
  title: string;
  description?: string;
  summary?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  toggleHint?: string;
  right?: React.ReactNode;
  labelVariant?: FieldLabelVariant;
  testID?: string;
}

/** A form section whose fields fold behind a header; folded fields stay mounted so typed values survive. */
export const FoldingFormSection = ({
  title,
  description,
  summary,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  toggleHint,
  right,
  labelVariant,
  testID = 'folding-form-section',
}: FoldingFormSectionProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors } = theme;
  const legendId = useLegendId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const hasSummary = typeof summary === 'string' && summary !== '';
  const hasDescription = typeof description === 'string' && description !== '';
  const groupA11y: WebGroupA11y = { 'aria-labelledby': legendId };

  const handlePress = useCallback(() => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    if (onOpenChange !== undefined) onOpenChange(next);
  }, [isControlled, isOpen, onOpenChange]);

  return (
    <GapOwnedProvider value>
      <View style={styles.section} testID={testID}>
        <Pressable
          accessibilityHint={toggleHint}
          accessibilityLabel={title}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
          aria-expanded={isOpen}
          style={styles.header}
          testID={`${testID}-header`}
          onPress={handlePress}
        >
          <Text aria-hidden style={[styles.marker, { color: colors.textSecondary }]}>
            {isOpen ? MARKER_OPEN : MARKER_FOLDED}
          </Text>
          <View style={styles.titleBlock}>
            <Text nativeID={legendId} style={[resolveLabelVariantStyle(labelVariant), { color: colors.text }]}>
              {title}
            </Text>
            {!isOpen && hasSummary ? (
              <Text style={[styles.summary, { color: colors.textSecondary }]} testID={`${testID}-summary`}>
                {summary}
              </Text>
            ) : null}
          </View>
          {right}
        </Pressable>
        <View
          role="group"
          style={[styles.body, isOpen ? null : styles.hidden]}
          testID={`${testID}-body`}
          {...groupA11y}
        >
          {hasDescription ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
          ) : null}
          {children}
        </View>
      </View>
    </GapOwnedProvider>
  );
};

export default FoldingFormSection;
