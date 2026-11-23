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

export { AlignToControl } from './AlignToControl/AlignToControl';
export type { AlignToControlProps } from './AlignToControl/AlignToControl';

export { InlineFieldRow } from './InlineFieldRow/InlineFieldRow';
export type { InlineFieldRowProps } from './InlineFieldRow/InlineFieldRow';
export { INLINE_FIELD_ROW_MIN_WIDTH, inlineFieldRowLayout } from './InlineFieldRow/inlineFieldRowLayout';
export type { InlineFieldRowLayout } from './InlineFieldRow/inlineFieldRowLayout';
export { LineItems, LINE_ITEMS_WIDE_MIN_WIDTH, canRemoveLine, isLineItemsWide, lineItemColumnFlex, lineNumberOf } from './LineItems';
export type { LineItemCell, LineItemColumn, LineItemsLabels, LineItemsProps } from './LineItems';

export { FormStack } from './FormStack/FormStack';
export type { FormStackProps } from './FormStack/FormStack';

export { ResponsiveFormLayout } from './ResponsiveFormLayout/ResponsiveFormLayout';
export type { ResponsiveFormLayoutProps } from './ResponsiveFormLayout/ResponsiveFormLayout';
export { RESPONSIVE_FORM_DEFAULT_BREAKPOINT, isWideFormLayout } from './ResponsiveFormLayout/isWideFormLayout';

export { FormSection } from './FormSection/FormSection';
export type { FormSectionProps } from './FormSection/FormSection';
export type { FieldMarker } from './Field/fieldMarkers';
export type { FieldLabelVariant } from './Field/labelVariants';

export { FormActions } from './FormActions/FormActions';
export type { FormActionsProps } from './FormActions/FormActions';

export { FormField } from './FormField/FormField';
export type { FormFieldProps } from './FormField/FormField';
export { rowsForText } from './FormField/textRows';
export { useAutoGrowRows } from './FormField/useAutoGrowRows';
export type { AutoGrowRows } from './FormField/useAutoGrowRows';
export { SEGMENT_BESIDE_FIELD, SEGMENT_BESIDE_TEXT_INPUT } from './segmentBesideField/segmentBesideField';

export { ThemedTextInput } from './ThemedTextInput/ThemedTextInput';
export type { ThemedTextInputProps } from './ThemedTextInput/ThemedTextInput';

export { useThemedInput } from './useThemedInput/useThemedInput';
export type { ThemedInput, UseThemedInputOptions } from './useThemedInput/useThemedInput';

// ---------------------------------------------------------------------------
// OPT-IN "recent values" store. Powers FormField's `recentKey` prop, but exported standalone so a
// consumer can build a bespoke recents surface. Web-only persistence; a silent no-op on native.
// ---------------------------------------------------------------------------

export { useRecentValues } from './useRecentValues/useRecentValues';
export { DEFAULT_MAX_RECENTS } from './useRecentValues/recentValuesCore';
export type { RecentValues } from './useRecentValues/useRecentValues';

export { ChipSelector } from './ChipSelector/ChipSelector';
export type { ChipSelectorProps, ChipOption, ChipVariant, ChipSingleSelectRole } from './ChipSelector/types';
export { ChipLabelWrap } from './ChipSelector/ChipLabelWrap';

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
export type { SelectControlProps, SelectMenuAnchor } from './SelectControl/SelectControl';
export { nextHighlight } from './controls/nextHighlight';

export { SelectField } from './SelectField/SelectField';
export type { SelectFieldProps } from './SelectField/SelectField';

export {
  TypeaheadControl,
  DEFAULT_TYPEAHEAD_MIN_CHARS,
  DEFAULT_TYPEAHEAD_MAX_SUGGESTIONS,
} from './TypeaheadControl/TypeaheadControl';
export type { TypeaheadControlProps, TypeaheadSearchProps, TypeaheadSearch } from './TypeaheadControl/TypeaheadControl';

export { DateRangeControl } from './DateRangeControl/DateRangeControl';
export type { DateRangeControlProps } from './DateRangeControl/DateRangeControl';
export { DateField } from './DateField/DateField';
export { DateTimeField } from './DateField/DateTimeField';
export { DateInput } from './DateField/DateInput';
export { DateDisplay, DatePickerProvider, DEFAULT_DATE_PICKER_LABELS } from './DatePicker';
export type { DatePickerLabels, DatePickerProviderProps } from './DatePicker';
export type { DateFieldProps, DateInputProps, DateTimeFieldProps } from './DateField/types';

export { AnchoredMenu } from './AnchoredMenu/AnchoredMenu';
export type { AnchoredMenuProps, AnchoredMenuColors, AnchoredMenuListbox, AnchoredMenuPlacement } from './AnchoredMenu/AnchoredMenu';

export { controlStyles } from './controls/controlStyles';
export { suggestOptions, isUnmatched } from './controls/suggestOptions';
export type { ControlOption, DateRangeValue } from './controls/controlTypes';

// ---------------------------------------------------------------------------
// GROUP SELECTION — pure tri-state logic for "select all" / "select this category" controls.
//
// Extracted from ui-tables' private DataTable/selection.ts, which could not be reached by a
// second consumer: its tri-state is a `const enum` (an ambient const enum in a published .d.ts,
// which isolatedModules consumers reject) and it is page-scoped. Component-free on purpose —
// the control itself is app chrome; only the arithmetic is shared.
// ---------------------------------------------------------------------------

export { resolveGroupSelection, groupAriaChecked, toggleGroupSelection } from './groupSelection/groupSelection';
export type { GroupSelection } from './groupSelection/groupSelection';

export { StepperTabs } from './Stepper/StepperTabs';
export type { StepperTabsProps } from './Stepper/StepperTabs';
export { StepperNav } from './Stepper/StepperNav';
export type { StepperNavProps, StepperNavLabels } from './Stepper/StepperNav';
export { resolveStepNeighbours } from './Stepper/stepperModel';
export type { StepperStep, StepNeighbours } from './Stepper/stepperModel';

export { FormStatusLine } from './FormStatusLine/FormStatusLine';
export type { FormStatusLineProps } from './FormStatusLine/FormStatusLine';

export { useFocusFirstInvalid } from './useFocusFirstInvalid/useFocusFirstInvalid';
export type { Focusable, FocusableRefs } from './useFocusFirstInvalid/useFocusFirstInvalid';
export { useServerFieldErrors } from './useServerFieldErrors/useServerFieldErrors';
export type { ServerFieldErrors, UseServerFieldErrorsOptions } from './useServerFieldErrors/useServerFieldErrors';
export { assignServerErrors } from './useServerFieldErrors/assignServerErrors';
export type { AssignedServerErrors, CodeFormatter } from './useServerFieldErrors/assignServerErrors';

export { useKeepInView } from './useKeepInView/useKeepInView';

export { FileInput } from './FileInput/FileInput';
export type { FileInputProps } from './FileInput/FileInput';
export { UploadWithLinkField } from './UploadWithLinkField/UploadWithLinkField';
export type { UploadWithLinkFieldProps, UploadWithLinkLabels } from './UploadWithLinkField/UploadWithLinkField';

export { AddOnRequest, isAddOnOpen } from './AddOnRequest/AddOnRequest';
export type { AddOnRequestProps } from './AddOnRequest/AddOnRequest';
export { FixBar, isFixBarVisible } from './FixBar/FixBar';
export type { FixBarProps } from './FixBar/FixBar';

export { SearchSelect, SelectSurface, buildSearchSelectSections, findOption, highlightAfterQuery, moveHighlight, resolveSelectMotion, PHONE_MAX_WIDTH, useSearchSelectState, useReducedMotion, useOutsidePress, isOutside, DropdownPlacement, placeDropdown, dropdownFrame, fitDropdownWidth, useDeferredFocus } from './SearchSelect';
export type { SearchSelectProps, SearchSelectLabels, SearchSelectTrigger, SearchSelectSections, SelectMotion, SearchSelectState, AnchorRect, DropdownFrame } from './SearchSelect';

export { CountryFlag, FlagShapeKind, flagShapes, isFallbackFlag, FLAG_WIDTH, FLAG_HEIGHT } from './CountryFlag';
export type { CountryFlagProps, FlagShape } from './CountryFlag';
export { CountryField } from './CountryField';
export type { CountryFieldProps } from './CountryField';
export { COUNTRIES, countryOptions, countryFieldOptions, countryFlag, toCountryValue } from './countries';
export type { Country } from './countries';

export { IbanInput, BicInput, IbanRejection, BicRejection, IBAN_MAX_LENGTH, IBAN_REGISTERED_COUNTRY_COUNT, ibanLengthFor, validateIban, validateBic, draftIban, draftBic, groupInFours, ibanCounter, useBlurVerdict, rejectionMessage } from './IbanInput';
export type { IbanInputProps, BicInputProps, IbanVerdict, BicVerdict, IbanDraft, BicDraft, BlurVerdict, IbanRejectionLabels, BicRejectionLabels } from './IbanInput';

export { ActionBar, actionBarPosition } from './FixBar/ActionBar';
export type { ActionBarProps } from './FixBar/ActionBar';

export { GatedChecklist, isChecklistComplete } from './GatedChecklist';
export type { ChecklistItem, GatedChecklistProps } from './GatedChecklist';

export { RadioList, radioRowIdentity } from './RadioList';
export type { RadioListProps, RadioOption, RadioRowIdentity } from './RadioList';

export * from './DecisionPanel';

export { PasswordField, PasswordRules, PasswordRulesDisplay, RevealToggle, RuleTone, ruleTone, changedRules, ruleAnnouncement, ruleColorsFrom } from './PasswordField';
export type { PasswordFieldProps, PasswordRulesProps, RevealToggleProps, PasswordFieldLabels, PasswordRuleState, PasswordFieldColors, RuleColors } from './PasswordField';
