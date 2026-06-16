# Changelog

## 1.0.0

Initial release. Extracted the proven duplicated form components from erevna-web ↔ katalogos-web
(Capability Wave C1, batch 2).

- `FormField`, `ChipSelector`, `FormSwitch` — share the `@dloizides/ui-feedback` UI context (`useUi`).
- `FormActions` deferred (depends on a not-yet-shared `core/Button`).
