import React, { useCallback, useRef, useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { useUi } from '@dloizides/ui-feedback';

import { AnchoredMenu } from '../AnchoredMenu/AnchoredMenu';
import { controlStyles as s } from '../controls/controlStyles';
import { Field } from '../Field/Field';
import { SelectedChip } from './components/SelectedChip';
import { addValue, remainingOptions, removeValue, selectedOptions } from './utils/multiSelectValues';

import type { ControlOption } from '../controls/controlTypes';
import type { FieldLabelVariant } from '../Field/labelVariants';

const CHEVRON_DOWN = '▾';
const CHEVRON_UP = '▴';
const BOX_GAP = 6;
const TRIGGER_MIN_WIDTH = 96;

const styles = StyleSheet.create({
  box: { flexWrap: 'wrap', justifyContent: 'flex-start', gap: BOX_GAP },
  trigger: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TOUCH_TARGET_PX,
    minWidth: TRIGGER_MIN_WIDTH,
  },
});

export interface MultiSelectChipLabels {
  removeLabel: (optionLabel: string) => string;
  removeHint: string;
}

export interface MultiSelectFieldProps {
  label: string;
  accessibilityHint: string;
  values: readonly string[];
  options: readonly ControlOption[];
  onChange: (values: string[]) => void;
  placeholder: string;
  chipLabels: MultiSelectChipLabels;
  testID: string;
  labelVariant?: FieldLabelVariant;
  hint?: string;
  error?: string;
}

type MultiSelectBoxProps = Omit<MultiSelectFieldProps, 'labelVariant' | 'hint' | 'error'> & { labelId: string };

function MultiSelectBox(props: MultiSelectBoxProps): React.ReactElement {
  const { label, accessibilityHint, values, options, onChange, placeholder, chipLabels, testID, labelId } = props;
  const { colors, palette } = useUi().theme;
  const anchorRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);
  const chosen = selectedOptions(options, values);
  const remaining = remainingOptions(options, values);
  const close = useCallback(() => { setIsOpen(false); }, []);
  const toggle = useCallback(() => { setIsOpen((prev) => !prev); }, []);
  const add = useCallback((next: string) => { onChange(addValue(values, next)); setIsOpen(false); }, [onChange, values]);
  const remove = useCallback((value: string) => { onChange(removeValue(values, value)); }, [onChange, values]);
  const chipColors = { text: colors.text, border: colors.border, surface: colors.surface };
  const summary = chosen.map((option) => option.label).join(', ');

  return (
    <View ref={anchorRef} style={s.anchor}>
      <View style={[s.selectTrigger, styles.box, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]} testID={`${testID}-box`}>
        {chosen.map((option) => (
          <SelectedChip
            key={option.value}
            colors={chipColors}
            option={option}
            removeHint={chipLabels.removeHint}
            removeLabel={chipLabels.removeLabel(option.label)}
            testID={`${testID}-chip-${option.value}`}
            onRemove={remove}
          />
        ))}
        <Pressable
          accessibilityHint={accessibilityHint}
          accessibilityLabel={`${label}: ${summary}`}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen, disabled: remaining.length === 0 }}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-labelledby={labelId}
          disabled={remaining.length === 0}
          style={styles.trigger}
          testID={`${testID}-trigger`}
          onPress={toggle}
        >
          <Text numberOfLines={1} style={[s.selectTriggerText, { color: colors.textSecondary }]}>{placeholder}</Text>
          <Text aria-hidden style={[s.chevron, { color: colors.textSecondary }]}>{isOpen ? CHEVRON_UP : CHEVRON_DOWN}</Text>
        </Pressable>
      </View>
      {isOpen ? (
        <AnchoredMenu
          anchorRef={anchorRef}
          colors={{ text: colors.text, border: colors.border, surface: colors.surface, brand: palette.primary['500'] }}
          optionHint={accessibilityHint}
          options={remaining}
          selectedValue=""
          testID={testID}
          onDismiss={close}
          onSelect={add}
        />
      ) : null}
    </View>
  );
}

/** A labelled select that holds several values, shown as removable chips inside the select box. */
export const MultiSelectField = ({ labelVariant, hint, error, ...boxProps }: MultiSelectFieldProps): React.ReactElement => (
  <Field error={error} hint={hint} label={boxProps.label} labelVariant={labelVariant}>
    {({ labelId }) => <MultiSelectBox {...boxProps} labelId={labelId} />}
  </Field>
);

export default MultiSelectField;
