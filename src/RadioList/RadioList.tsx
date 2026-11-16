import React from 'react';

import { StyleSheet, View, type ViewProps } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { useRadioKeyboard } from '../ChipSelector/hooks/useRadioKeyboard';
import { buildChipColors } from '../ChipSelector/utils/chipColors';
import { Field } from '../Field/Field';
import { webFieldA11y } from '../webFieldA11y/webFieldA11y';

import { RadioRow } from './components/RadioRow';
import type { RadioListProps } from './types';
import { radioRowIdentity } from './utils/radioRowIdentity';

const ROW_GAP = 8;

const styles = StyleSheet.create({
  list: { rowGap: ROW_GAP },
});

/** A vertical radio group of labelled rows with descriptions; arrow keys move the choice. */
export function RadioList<T extends string | number>(props: RadioListProps<T>): React.ReactElement {
  const { options, value, onChange, optionTestIDPrefix, label, error, required = false, disabled = false, testID } = props;
  const { theme } = useUi();
  const colors = React.useMemo(() => buildChipColors(theme.colors, theme.palette), [theme.colors, theme.palette]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const radio = useRadioKeyboard({ enabled: true, disabled, values: options.map((option) => option.value), selectedIndex, onChange });

  return (
    <Field error={error} label={label} required={required} testID={testID}>
      {({ describedById, hasError }) => (
        <View
          accessibilityRole="radiogroup"
          style={styles.list}
          {...(webFieldA11y({ describedById, hasError }) as ViewProps)}
          {...radio.groupProps}
        >
          {options.map((option, index) => (
            <RadioRow
              key={String(option.value)}
              colors={colors}
              hostRef={radio.chipRef(index)}
              identity={radioRowIdentity(option, index === selectedIndex, disabled, optionTestIDPrefix)}
              option={option}
              tabIndex={radio.tabIndexFor(index)}
              onPress={() => onChange(option.value)}
            />
          ))}
        </View>
      )}
    </Field>
  );
}
