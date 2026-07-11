# Changelog

## 1.1.0

- Add `FormCheckbox` — a native-safe (`Pressable`-based, RN-web + native) themed checkbox: a rounded
  square that fills with the brand colour and shows a check glyph when on, with a label and optional
  hint. Mirrors `FormSwitch`'s prop shape (`value`, `onValueChange`/`onChange`, `label`, `hint`,
  `disabled`, `testID`, a11y) so it is a drop-in for boolean toggles that should read as checkboxes.
  Exposes `role="checkbox"` + `aria-checked` / `accessibilityState={{ checked }}`.

## 1.0.0

Initial release. Extracted the proven duplicated form components from erevna-web ↔ katalogos-web
(Capability Wave C1, batch 2).

- `FormField`, `ChipSelector`, `FormSwitch` — share the `@dloizides/ui-feedback` UI context (`useUi`).
- `FormActions` deferred (depends on a not-yet-shared `core/Button`).
