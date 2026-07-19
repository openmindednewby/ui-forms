# @dloizides/ui-forms

Themable, brand-agnostic React Native (RN-web) **form** components for the dloizides.com
portfolio: `Field`, `FormField`, `ChipSelector`, `FormSwitch`. They read theme colours from the shared
`@dloizides/ui-feedback` UI context (`useUi`) — mount one `UiProvider` / `FeedbackUiProvider`
at your app root and these components pick up your theme automatically.

## Install

```bash
npm install @dloizides/ui-forms @dloizides/ui-feedback
```

Peer dependencies: `@dloizides/ui-feedback >= 1.1.0`, `react >= 18`, `react-native >= 0.74`
(use `react-native-web` on web).

## Usage

```tsx
import { FormField, ChipSelector, FormSwitch } from '@dloizides/ui-forms';

<FormField label="Email" required error={errors.email} value={email} onChangeText={setEmail} />
<ChipSelector label="Plan" options={plans} value={plan} onChange={setPlan} />
<FormSwitch label="Email notifications" value={notify} onValueChange={setNotify} />
```

## `Field` — label any control, not just a text input

`FormField` is hard-wired to a text input. For **any other control** — a dropdown, a date picker,
a chip selector — wrap it in `Field` to get the identical label row, required mark, error line and
bottom spacing. This is what keeps a dropdown aligned with the `FormField` next to it: without it
the dropdown's box starts a label-row higher and the row loses its vertical rhythm.

```tsx
import { Field } from '@dloizides/ui-forms';

<Field label="Currency" required error={errors.currency}>
  <ModalDropdown options={currencies} value={currency} onChange={setCurrency} />
</Field>
```

`FormField` **and** `ChipSelector` compose `Field` internally, so the label row can never drift
out of alignment between them — there is exactly one label implementation in the kit.

To wire the error line into a custom control's own `aria-describedby` / invalid state, pass a
**function** child — it receives `{ describedById, hasError }` (`describedById` is `undefined`
when there is no error):

```tsx
<Field label="Country" error={errors.country}>
  {({ describedById, hasError }) => (
    <CountryPicker aria-describedby={describedById} hasError={hasError} value={country} onChange={setCountry} />
  )}
</Field>
```

| Prop | Type | Notes |
|------|------|-------|
| `label` | `string` | optional — an absent or empty label renders NO label row |
| `children` | `ReactNode \| (ctx) => ReactNode` | the control |
| `required` | `boolean` | renders a decorative `*` (hidden from assistive tech) |
| `error` | `string` | renders a `role="alert"` line, linked via the child's `describedById` |
| `containerStyle` | `ViewStyle` | merged over the container |
| `testID` | `string` | on the container |

The injected theme needs `colors.{surface,text,textSecondary,border}`, `palette.primary['500']`
and `semantic.error['500']` — supplied via `@dloizides/ui-feedback`'s provider. Without a provider
the components fall back to a neutral default theme.

## `ChipSelector`

```tsx
<ChipSelector
  label="Plan"
  required
  error={errors.plan}
  options={plans}
  value={plan}
  onChange={setPlan}
  variant="outline"
/>
```

Its label, required mark, error line and bottom spacing come from `Field`. `label` is optional:
with no label no label row is rendered, so it drops into a toolbar or filter bar cleanly.

| Prop | Type | Notes |
|------|------|-------|
| `label` | `string` | optional — no label means no label row |
| `options` | `Array<{ value, label }>` | `value` is a `string` or `number` |
| `value` | `T \| T[]` | array when `multiple` |
| `onChange` | `(value: T) => void` | fires the pressed value; the parent owns toggle logic |
| `multiple` | `boolean` | selection is an array |
| `disabled` | `boolean` | disables every chip |
| `variant` | `'solid' \| 'outline'` | `solid` (default) = filled pill; `outline` = tinted outline |
| `required` | `boolean` | renders `Field`'s decorative `*` |
| `error` | `string` | `role="alert"` line, tied to the chip group via `aria-describedby` |
| `containerStyle` | `ViewStyle` | merged over the container |
| `testID` | `string` | on the container |

## Dense controls — `SelectControl` / `TypeaheadControl` / `DateRangeControl`

Promoted in 1.8.0 out of `@dloizides/ui-tables`' private filter bar, where they worked correctly
for six portals and were exported to none — which is why the fleet grew 6 selects, 5 date fields
and 2 typeaheads.

They are **label-free by design**. Compose them inside `Field` so there is ONE label
implementation for every control rather than one per control:

```tsx
<Field label="Status" labelVariant="control" containerStyle={{ marginBottom: 0 }}>
  <SelectControl
    accessibilityLabel={t('filters.statusName', 'Status', selectedLabel)}
    options={options}
    testID="filters-status"
    value={value}
    onChange={setValue}
  />
</Field>
```

`labelVariant="control"` is the 11/700/uppercase voice from
[`FORMS.md`](../../../PROOViD/AMLService/AMLService/wwwroot/shared/FORMS.md) — the voice for
labels that are SCANNED (filter bars, toolbars) rather than READ.

### Every string is pre-localized

This package never calls `t`. In particular `SelectControl`'s `accessibilityLabel` must be
composed by YOU and must carry the **selection** — "Status: Active", not "Status". The accessible
name REPLACES the trigger's visible text for a screen reader, so naming it with the field alone
silently hides what is selected.

| Control | Key props | testIDs |
|---|---|---|
| `SelectControl` | `options`, `value`, `onChange`, `placeholder`, `accessibilityLabel`, `optionHint` | `<testID>-trigger`, `-menu`, `-option-<value>` |
| `TypeaheadControl` | `options`, `value`, `onChange`, `onSubmit`, `error`, `minChars`, `maxSuggestions` | `<testID>-input`, `-menu`, `-error` |
| `DateRangeControl` | `value` (`{from,to}`), `onChange`, `onSubmit`, `fromLabel`, `toLabel` | `<testID>-range`, `-from`, `-to` |
| `AnchoredMenu` | the floating list the first two compose | `<testID>-menu` |

Also exported: `controlStyles` (the tuned metrics), `suggestOptions` / `isUnmatched` (the
typeahead's ranker), and the `ControlOption` / `DateRangeValue` types.

## testIDs

`form-field-input`, `chip-selector-chip-<value>`, `form-switch` (overridable on FormSwitch).

## License

MIT
