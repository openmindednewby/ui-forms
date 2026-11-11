import React, { useCallback, useMemo } from 'react';

import { StyleSheet, Text } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import type { ControlOption } from '../controls/controlTypes';
import type { Country } from '../countries/country';
import { countryFieldOptions, toCountryValue } from '../countries/countryOptions';
import { CountryFlag } from '../CountryFlag/CountryFlag';
import { SearchSelect } from '../SearchSelect/SearchSelect';
import type { SearchSelectLabels } from '../SearchSelect/types';

const CODE_FONT = 12;

export interface CountryFieldProps {
  value: string;
  onChange: (code: string) => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  labels: SearchSelectLabels;
  testID: string;
  countries?: readonly Country[];
  noneLabel?: string;
  onBlur?: () => void;
}

const NO_COUNTRY = '';

const renderFlag = (option: ControlOption): React.ReactNode => (option.value === NO_COUNTRY ? null : <CountryFlag code={option.value} />);


/** A searchable country field: flag, name and grey code; stores the ISO 3166-1 alpha-2 code, or '' for `noneLabel`; `onBlur` fires when focus leaves the closed field. */
export function CountryField({ value, onChange, accessibilityLabel, accessibilityHint, labels, testID, countries, noneLabel, onBlur }: CountryFieldProps): React.ReactElement {
  const { theme } = useUi();
  const { textSecondary } = theme.colors;
  const options = useMemo(() => countryFieldOptions(countries, noneLabel), [countries, noneLabel]);
  const renderCode = useCallback((option: ControlOption): React.ReactNode => <Text style={[styles.code, { color: textSecondary }]}>{option.detail}</Text>, [textSecondary]);
  return (
    <SearchSelect
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      labels={labels}
      options={options}
      recentKey="country"
      renderDetail={renderCode}
      renderLeading={renderFlag}
      testID={testID}
      value={toCountryValue(value)}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
}

const styles = StyleSheet.create({
  code: { fontSize: CODE_FONT },
});
