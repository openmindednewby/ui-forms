import React, { useMemo } from 'react';

import { StyleSheet, Text } from 'react-native';

import type { ControlOption } from '../controls/controlTypes';
import type { Country } from '../countries/country';
import { countryFlag, countryOptions, toCountryValue } from '../countries/countryOptions';
import { DetailPlacement } from '../SearchSelect/DetailPlacement';
import { SearchSelect } from '../SearchSelect/SearchSelect';
import type { SearchSelectLabels } from '../SearchSelect/types';

const FLAG_FONT = 16;
const DEFAULT_OPTIONS = countryOptions();

export interface CountryFieldProps {
  value: string;
  onChange: (code: string) => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  labels: SearchSelectLabels;
  testID: string;
  countries?: readonly Country[];
}

const renderFlag = (option: ControlOption): React.ReactNode => <Text aria-hidden style={styles.flag}>{countryFlag(option.value)}</Text>;

/** A searchable country field: flag, name and grey code; stores the ISO 3166-1 alpha-2 code only. */
export function CountryField({ value, onChange, accessibilityLabel, accessibilityHint, labels, testID, countries }: CountryFieldProps): React.ReactElement {
  const options = useMemo(() => (countries === undefined ? DEFAULT_OPTIONS : countryOptions(countries)), [countries]);
  return (
    <SearchSelect
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      detailPlacement={DetailPlacement.End}
      labels={labels}
      options={options}
      recentKey="country"
      renderLeading={renderFlag}
      testID={testID}
      value={toCountryValue(value)}
      onChange={onChange}
    />
  );
}

const styles = StyleSheet.create({
  flag: { fontSize: FLAG_FONT },
});
