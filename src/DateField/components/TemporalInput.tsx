import React from 'react';

import { Platform } from 'react-native';

import { WebDateInput } from './WebDateInput';
import { ThemedTextInput } from '../../ThemedTextInput/ThemedTextInput';

import type { FieldChildContext } from '../../Field/Field';
import type { DateFieldProps } from '../types';

const IS_WEB = Platform.OS === 'web';

interface TemporalInputProps {
  fieldProps: DateFieldProps;
  context: FieldChildContext;
  webInputType: string;
}

/** The bare control: a native picker on web, a text input off it. */
export function TemporalInput({ fieldProps, context, webInputType }: TemporalInputProps): React.ReactElement {
  if (IS_WEB) return <WebDateInput context={context} fieldProps={fieldProps} webInputType={webInputType} />;
  return (
    <ThemedTextInput
      accessibilityHint={fieldProps.accessibilityHint}
      accessibilityLabel={fieldProps.label}
      describedById={context.describedById}
      editable={fieldProps.disabled !== true}
      hasError={context.hasError}
      id={context.controlId}
      requiredField={fieldProps.required}
      testID={fieldProps.testID}
      value={fieldProps.value}
      onChangeText={fieldProps.onChange}
      onSubmitEditing={fieldProps.onSubmit}
    />
  );
}
