# Changelog

## 1.2.0

- Add `ThemedTextInput` + `useThemedInput` — the shared "readable + lively" text-input treatment,
  driven entirely by the active theme (re-themes per tenant, no hard-coded hex). At rest: dark
  readable text on a subtle off-white surface with a soft border. On hover (web): the border
  strengthens a touch. On focus: the border becomes the brand primary, the background brightens to
  the plain surface (white), and a soft 3px brand-tinted focus ring fades in. The animation is a
  pure GPU-cheap CSS transition on `border-color`/`background-color`/`box-shadow` (the ring is a
  `box-shadow`, so no layout/reflow) — NO `Animated`/`LayoutAnimation`/JS timers. Web-only style
  keys and the mouse-hover handlers are guarded behind `Platform.OS === 'web'`, so it stays
  native-safe (native applies the state-driven colours instantly).
- `FormField` now renders `ThemedTextInput`, so every field gets the treatment for free; its label
  uses `textSecondary` at 13px/600 for readability. Props/behaviour (label, hint, error, testID,
  a11y, `onFocus`/`onBlur` pass-through) are backward-compatible.

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
