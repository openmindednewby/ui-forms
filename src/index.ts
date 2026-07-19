export { Field } from './Field/Field';
export type { FieldProps, FieldChildContext, FieldChildren } from './Field/Field';

export type { FieldSpacing } from './Field/fieldSpacing';

export { DEFAULT_OPTIONAL_LABEL } from './Field/fieldMarkers';

// ---------------------------------------------------------------------------
// LAYOUT primitives (F3). `FormGrid` + `FormCell` replace the wrapping form row the fleet
// re-declares by hand; `FormSection` is the fieldset/legend grouping only v1 had.
//
// Using `FormGrid` or `FormSection` also tells the `Field`s inside them that a parent's `gap`
// owns the vertical rhythm, so they drop their 16px bottom margin — which is what retires the
// 16 `containerStyle={{ marginBottom: 0 }}` cancel hacks across the fleet.
//
// There is deliberately no `FormRow`: every real call site measured wraps, so a non-wrapping
// variant would be an export with no consumer.
// ---------------------------------------------------------------------------

export { FormGrid } from './FormGrid/FormGrid';
export type { FormGridProps } from './FormGrid/FormGrid';

export { FormCell } from './FormGrid/FormCell';
export type { FormCellProps } from './FormGrid/FormCell';

export { FormSection } from './FormSection/FormSection';
export type { FormSectionProps } from './FormSection/FormSection';
export type { FieldMarker } from './Field/fieldMarkers';
export type { FieldLabelVariant } from './Field/labelVariants';

export { FormActions } from './FormActions/FormActions';
export type { FormActionsProps } from './FormActions/FormActions';

export { FormField } from './FormField/FormField';
export type { FormFieldProps } from './FormField/FormField';

export { ThemedTextInput } from './ThemedTextInput/ThemedTextInput';
export type { ThemedTextInputProps } from './ThemedTextInput/ThemedTextInput';

export { useThemedInput } from './useThemedInput/useThemedInput';
export type { ThemedInput, UseThemedInputOptions } from './useThemedInput/useThemedInput';

export { ChipSelector } from './ChipSelector/ChipSelector';
export type { ChipSelectorProps, ChipOption, ChipVariant } from './ChipSelector/ChipSelector';

export { FormSwitch } from './FormSwitch/FormSwitch';
export type { FormSwitchProps } from './FormSwitch/FormSwitch';

export { FormCheckbox } from './FormCheckbox/FormCheckbox';
export type { FormCheckboxProps } from './FormCheckbox/FormCheckbox';

// ---------------------------------------------------------------------------
// Dense CONTROLS — promoted out of @dloizides/ui-tables' private filter bar (F2).
//
// These rendered, themed and a11y-wired correctly for six portals and were exported to
// none of them, so the fleet reimplemented them: 6 selects, 5 date fields, 2 typeaheads.
// They are LABEL-FREE — compose them inside `Field` (`labelVariant="control"` on a dense
// surface) so there stays ONE label implementation rather than one per control.
// ---------------------------------------------------------------------------

export { SelectControl } from './SelectControl/SelectControl';
export type { SelectControlProps } from './SelectControl/SelectControl';

export {
  TypeaheadControl,
  DEFAULT_TYPEAHEAD_MIN_CHARS,
  DEFAULT_TYPEAHEAD_MAX_SUGGESTIONS,
} from './TypeaheadControl/TypeaheadControl';
export type { TypeaheadControlProps } from './TypeaheadControl/TypeaheadControl';

export { DateRangeControl } from './DateRangeControl/DateRangeControl';
export type { DateRangeControlProps } from './DateRangeControl/DateRangeControl';

export { AnchoredMenu } from './AnchoredMenu/AnchoredMenu';
export type { AnchoredMenuProps, AnchoredMenuColors } from './AnchoredMenu/AnchoredMenu';

export { controlStyles } from './controls/controlStyles';
export { suggestOptions, isUnmatched } from './controls/suggestOptions';
export type { ControlOption, DateRangeValue } from './controls/controlTypes';
