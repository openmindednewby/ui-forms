# Changelog

## 1.5.0

- **Add `Field` — the generic label-over-control wrapper.** `FormField` is hard-wired to a text
  input (`FormFieldProps extends Omit<TextInputProps,'style'>`), so any NON-text control (a
  dropdown, a date picker, a chip selector) had no shared way to get a label — and ended up
  visually misaligned next to its `FormField` siblings: the control's box started ~21px higher
  (no label row) and it missed `FormField`'s `marginBottom: 16`, so wrapped rows lost their
  vertical rhythm. This was hand-rolled in 5 places across zygos-web and aml-v2.
  `Field` takes `{ label, required?, error?, children, containerStyle?, testID? }` and renders the
  same label row / required mark / error line / spacing.
- **`FormField` now composes `Field` internally**, so the two can never drift apart — the metrics
  live in exactly one place. `FormFieldProps` and every rendered attribute (`form-field-input`
  testID, `aria-invalid` / `aria-describedby` / `aria-required`, the `role="alert"` error line)
  are unchanged: fully backward-compatible.
- `Field`'s `children` may be a plain node (the common case) or a render function receiving
  `{ describedById, hasError }`, so a custom control can wire the error line into its own
  `aria-describedby` / invalid state exactly the way `FormField` does.

## 1.4.0

- **Accessibility (WCAG 2.1 AA) hardening — additive + backward-compatible.**
  - `FormField`: the error message is now programmatically tied to the input — the input gets
    `aria-invalid` when errored and `aria-describedby` pointing at the error line (which is a
    `role="alert"` live region), and `aria-required` when `required`. The required `*` is marked
    decorative (`aria-hidden` / `accessibilityElementsHidden`) so a screen reader hears "required"
    (via `aria-required`) instead of "star".
  - `ThemedTextInput`: new optional `describedById` + `requiredField` props forward
    `aria-describedby` / `aria-required`, and it emits `aria-invalid` from `hasError` (web only;
    no-ops on native). Existing callers are unaffected.
  - `FormCheckbox`: now keyboard-operable — the `role="checkbox"` Pressable renders a `<div>`
    (no free Enter/Space), so an explicit web-only Enter/Space handler toggles it (WCAG 2.1.1).
  - `ChipSelector`: chips gain a `hitSlop` so the touch target reaches ~44px WITHOUT changing the
    rendered pill size, and expose `accessibilityState.disabled` when the selector is disabled.
  - `useThemedInput`: the focus/hover CSS transition now collapses to instant when the user
    requests `prefers-reduced-motion: reduce` (WCAG 2.3.3, web only).

## 1.3.0

- `ChipSelector` gains a `variant` prop (`'solid' | 'outline'`, default `'solid'`). `solid` is the
  original filled-pill look (selected = solid brand fill, white ink) — existing consumers
  (erevna / katalogos / kefi) render **identically**, no change. `outline` is the AML v1 console
  look: an outlined pill on a muted fill where the **selected** state is a subtle tinted-outline
  (brand border + brand ink + a low-alpha brand wash), NOT a solid fill; on web, hover lifts the
  border + ink to the brand colour. Fully theme-driven (brand colour + alpha, border/text from the
  theme), so it re-themes per tenant. Additive + backward-compatible.

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
