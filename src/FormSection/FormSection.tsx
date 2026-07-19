/**
 * `FormSection` — a titled group of fields. The React answer to v1's `<fieldset>` / `<legend>`.
 *
 * v1 has a real `<fieldset>` whose `<legend>` takes the identical label metric as a field label, so
 * a group heading reads as part of the form rather than as page furniture. Nothing in the React
 * fleet has this: zygos fakes it with a generic `Heading`, and everybody else emits an untitled
 * `<View>` — which means the grouping exists visually but not semantically, so a screen-reader user
 * tabbing into "Threshold" is never told it belongs to "Advanced matching".
 *
 * ## Why not a literal `<fieldset>`
 *
 * react-native-web has no `fieldset` mapping — a `View` is a `div`, and there is no escape hatch
 * that turns one into a `<fieldset>` with a real `<legend>`. What IS available is the pattern the
 * ARIA spec defines as the equivalent: `role="group"` + `aria-labelledby` pointing at the heading.
 * Assistive tech announces "Advanced matching, group" exactly as it would for a fieldset. This is
 * the honest ceiling of the platform, not a shortcut — and it is why the legend is a `Text` whose
 * `nativeID` is generated the same way `Field`'s hint/error ids are.
 *
 * The legend deliberately reuses `resolveLabelVariantStyle` — the SAME function `Field` uses for its
 * label — so the two cannot drift. A section titled in one metric above fields labelled in another
 * is precisely the "third voice is drift" failure FORMS.md warns about.
 */
import React from 'react';

import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { resolveLabelVariantStyle, type FieldLabelVariant } from '../Field/labelVariants';
import { GapOwnedProvider } from '../FormGrid/formGridContext';

/** Space between the legend, the description and the section's content. */
const SECTION_GAP = 10;
/** A description is a help line for the whole group — same size as `Field`'s hint. */
const DESCRIPTION_FONT_SIZE = 12;

const styles = StyleSheet.create({
  section: {
    gap: SECTION_GAP,
  },
  description: {
    fontSize: DESCRIPTION_FONT_SIZE,
  },
});

let sectionSeq = 0;

/** Stable-per-instance id so the group can point at its own legend via `aria-labelledby`. */
function useSectionLegendId(): string {
  const [id] = React.useState(() => {
    sectionSeq += 1;
    return `form-section-legend-${String(sectionSeq)}`;
  });
  return id;
}

/**
 * Web-only ARIA attributes react-native-web forwards to the underlying element but that RN's
 * `ViewProps` type does not enumerate — the same escape-hatch-free pattern `ChipSelector` uses.
 */
interface WebSectionA11y {
  'aria-labelledby'?: string;
}

export interface FormSectionProps {
  /**
   * The legend — pre-localized, like every string in this package. Optional: a section with no
   * title still groups its children for layout, but renders NO legend row and NO `aria-labelledby`,
   * because a group labelled by an empty element is worse for assistive tech than an unlabelled one.
   */
  title?: string;
  /** Help line for the whole group, under the legend. The group-level sibling of `Field`'s hint. */
  description?: string;
  children: React.ReactNode;
  /**
   * Which label voice the legend speaks. Defaults to `field` — a section heading on a form the user
   * fills in. Pass `control` on a dense surface so the legend matches the controls beneath it.
   */
  labelVariant?: FieldLabelVariant;
  /** Escape hatch applied AFTER `labelVariant`, for the genuine one-off a variant does not cover. */
  titleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const FormSection = ({
  title,
  description,
  children,
  labelVariant,
  titleStyle,
  style,
  testID,
}: FormSectionProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors } = theme;
  const legendId = useSectionLegendId();
  const hasTitle = typeof title === 'string' && title !== '';
  const hasDescription = typeof description === 'string' && description !== '';

  const a11y: WebSectionA11y = { 'aria-labelledby': hasTitle ? legendId : undefined };

  return (
    // The section spaces its children with `gap`, so it owns their vertical rhythm exactly as a
    // `FormGrid` owns a row's — without this a `Field` placed directly in a section would stack its
    // 16px margin on the section's gap and recreate the F3 bug one level up.
    <GapOwnedProvider value>
      <View role="group" style={[styles.section, style]} testID={testID} {...a11y}>
        {hasTitle ? (
          <Text
            nativeID={legendId}
            style={[resolveLabelVariantStyle(labelVariant), { color: colors.text }, titleStyle]}
          >
            {title}
          </Text>
        ) : null}
        {hasDescription ? (
          <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
        ) : null}
        {children}
      </View>
    </GapOwnedProvider>
  );
};

export default FormSection;
