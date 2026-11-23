import type { FieldError } from '@dloizides/api-client-base';

export type CodeFormatter = (code: string, error: FieldError) => string | null | undefined;

export interface AssignedServerErrors<Field extends string> {
  byField: Partial<Record<Field, string>>;
  formError: string | null;
  matched: Field[];
}

function lastSegment(path: string): string {
  return path.slice(path.lastIndexOf('.') + 1).toLowerCase();
}

function matchField<Field extends string>(path: string, fields: readonly Field[]): Field | null {
  const exact = fields.find((field) => field === path);
  if (exact !== undefined) {return exact;}
  const key = lastSegment(path);
  return key === '' ? null : fields.find((field) => field.toLowerCase() === key) ?? null;
}

function messageOf(error: FieldError, formatCode: CodeFormatter | undefined): string {
  const formatted = error.code !== undefined && formatCode !== undefined ? formatCode(error.code, error) : null;
  return typeof formatted === 'string' && formatted !== '' ? formatted : error.message;
}

/** Splits parsed server errors into the first message per known field and the first unmatched message. */
export function assignServerErrors<Field extends string>(
  errors: readonly FieldError[],
  fields: readonly Field[],
  formatCode?: CodeFormatter,
): AssignedServerErrors<Field> {
  const byField: Partial<Record<Field, string>> = {};
  let formError: string | null = null;
  for (const error of errors) {
    const field = matchField(error.path, fields);
    const message = messageOf(error, formatCode);
    if (field === null) {formError = formError ?? message;}
    else if (byField[field] === undefined) {byField[field] = message;}
  }
  const matched = fields.filter((field) => byField[field] !== undefined);
  return { byField, formError, matched };
}
