import React from 'react';

import { Platform } from 'react-native';

import { WebDateInput } from './WebDateInput';
import { Field, type FieldChildContext } from '../../Field/Field';
import { ThemedTextInput } from '../../ThemedTextInput/ThemedTextInput';

import type { DateFieldProps } from '../types';

const IS_WEB = Platform.OS === 'web';

interface TemporalFieldProps {
  fieldProps: DateFieldProps;
  webInputType: string;
}

function renderNativeInput(fieldProps: DateFieldProps, context: FieldChildContext): React.ReactElement {
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

/** The `Field` shell shared by `DateField` and `DateTimeField`; a native picker on web, a text input off it. */
export function TemporalField({ fieldProps, webInputType }: TemporalFieldProps): React.ReactElement {
  const { label, required, hint, error } = fieldProps;
  return (
    <Field error={error} hint={hint} label={label} required={required}>
      {(context) =>
        IS_WEB ? (
          <WebDateInput context={context} fieldProps={fieldProps} webInputType={webInputType} />
        ) : (
          renderNativeInput(fieldProps, context)
        )
      }
    </Field>
  );
}
