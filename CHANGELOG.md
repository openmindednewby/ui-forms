# Changelog

## 1.9.0

**Campaign F3 — `Field`'s spacing model, and the layout primitives.** `Field` hard-coded a 16px
bottom margin on its container. That is the pre-flexbox model — the CHILD owns the space after
itself — and in a `gap`-laid-out parent, which is how every modern form row in this fleet is
written, the margin STACKS on the parent's gap. So consumers cancelled it by hand: **16
`containerStyle={{ marginBottom: 0 }}` sites across the fleet**, 13 of them in aml-v2, each with an
apologetic comment. AML v1 got this right in CSS years ago (`.ui-field { display: flex;
flex-direction: column; gap: 6px; }`) and wrote the contract down in `shared/FORMS.md`.

**This release moves NO pixels for any existing consumer.** The fix is opt-in, not a 2.0.0 — see
"Why not a major bump" below.

- **Add `FormGrid` + `FormCell`** — the wrapping form row, extracted from the copy the fleet
  re-declares verbatim (`{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }` +
  `{ minWidth: 220, flexGrow: 1, flexBasis: 260 }`), with the min-width/basis parameterised. Cell
  metrics live on the GRID, so the common call site is a bare `<FormCell>` and only the genuine
  one-offs (`<FormCell basis={160} grow={false} minWidth={140}>`) carry props.
- **Add `FormSection`** — the fieldset/legend grouping only v1 had. react-native-web has no
  `fieldset` mapping, so this is the ARIA equivalent: `role="group"` + `aria-labelledby` pointing
  at the legend. The legend reuses `resolveLabelVariantStyle` — the SAME function `Field` uses — so
  a section heading cannot drift into a third label voice.
- **Add `Field.spacing` (`'stack' | 'gap'`)** — the two spacing models. `stack` is the historical
  16px margin + 4px child margins, byte-identical to 1.8.0, and remains the default. `gap` is the
  FORMS.md contract: no bottom margin, one uniform 6px internal gap, parent owns the rhythm.
- **`Field` inside a `FormGrid` or `FormSection` resolves to `gap` automatically.** Adopting the
  shared grid IS the opt-in: a consumer deletes its hand-rolled `grid`/`field` styles AND its
  `marginBottom: 0` cancel in the same edit. An explicit `spacing` prop beats the context in both
  directions.
- **`ChipSelector`**: the chip row now spaces with `gap: 8` instead of per-chip margins plus a
  compensating `marginBottom: -8`. Rendered box is byte-identical. Also gains a `spacing`
  passthrough, and `containerStyle` widens to `StyleProp<ViewStyle>` to match `Field`'s.

### Why not a major bump

The brief for this work allowed a breaking 2.0.0. It was rejected. Switching every `Field` to the
gap model in one publish moves pixels on every form in seven portals simultaneously — which is
precisely the change you cannot visually QA, because no app remains on the old behaviour to compare
against, and a regression surfaces as "some form somewhere looks slightly wrong" with seven
suspects. The context-aware opt-in gives the identical end state via a per-app rollout, each step
behind visual QA, with `git revert` scoped to one app. The cost is that both models live in the
code until the fleet has migrated; that is a smaller price than an un-QA-able fleet-wide pixel
change.

### Correction to the campaign premise

`ChipSelector`'s `marginBottom: -CHIP_GUTTER` was documented — and briefed — as compensation for
`Field`'s 16px margin, load-bearing enough that changing one without the other would break chip
spacing in 7+ sites. **That was wrong.** The -8 cancelled the chips' OWN bottom gutter hanging off
the last wrapped row; it behaved identically whatever `Field` contributed. It has been replaced with
`gap` regardless, because a margin/negative-margin pair is fragile and leaks a negative margin onto
the block's box. `fieldSpacing.test.tsx` now pins `Field` and `ChipSelector` to the same box in both
models, so the relationship is checkable rather than folkloric.


## 1.8.0

**Campaign F2 — the dense CONTROLS arrive.** `@dloizides/ui-tables` shipped a complete, themed,
a11y-wired set of form controls inside its `Filters` bar and exported NONE of them: its
`src/index.ts` exposed only `Filters`, `useFilterDraft`, `suggestOptions`, `isUnmatched` and
types. Six portals could SEE those controls working and none could import them, so the fleet
reimplemented them — **6 independent select implementations, 5 date fields, 2 typeaheads**. Same
shape as `MultiTenancy.EntityFrameworkCore` shipping no EF Core. This release makes them public.

Nothing here moves a pixel for an existing consumer: the metrics are the promoted originals,
unchanged. `CONTAINER_MARGIN_BOTTOM` and `ChipSelector`'s compensating `marginBottom:
-CHIP_GUTTER` remain deliberately untouched.

- **Add `SelectControl`** — single-select enum/status dropdown. Bordered trigger + chevron opening
  the shared `AnchoredMenu`.
- **Add `TypeaheadControl`** — search-as-you-type combobox (aml-v2's CountryPicker, generalized).
  Free typing is preserved (the value is raw text the caller normalises at query time); picking a
  suggestion fills the canonical LABEL, not the value.
- **Add `DateRangeControl`** — inclusive from/to pair. Editing one side patches ONLY that side.
- **Add `AnchoredMenu`** — the floating option list both of the above compose. Kept in-tree with
  NO `ui-layout` dependency; that was a considered choice in `ui-tables` and it still holds, since
  depending on the higher-level `ModalDropdown` would invert the graph for every consumer.
- **Add `controlStyles`** — the tuned metrics, promoted verbatim. `ui-tables`' `Filters/styles.ts`
  said the quiet part out loud in its own header: it "reconcile[d] the per-field styles that were
  copy-pasted across aml-v2's filter files into one shared source" — and then locked the
  reconciliation inside one bar where no other surface could reach it.
- **Add `suggestOptions` / `isUnmatched`** — the ranked substring matcher behind the typeahead.
- **Add `ControlOption` / `DateRangeValue`** types. `ui-tables` now ALIASES its long-standing
  public `FilterOption` / `DateRangeValue` onto these, so there is one definition rather than two
  structurally-compatible twins free to drift.

### The controls are LABEL-FREE, on purpose

They render the control only. Compose them inside `Field` — with `labelVariant="control"` on a
dense surface — to get the label, hint and error slots. That is what retires `ui-tables`' private
`FieldShell` fork (see `@dloizides/ui-tables` 1.14.0) and leaves ONE label implementation for
every control instead of one per control.

### i18n: this package still never calls `t`

Every string — `accessibilityLabel`, `placeholder`, `optionHint`, `error`, `fromLabel`/`toLabel`
— is a PRE-LOCALIZED prop. This is load-bearing, not stylistic: aml-v2 localizes through
`@dloizides/i18n` with positional `{0}` while the other six portals use i18next `{{p1}}`, so a
component that localized internally could not serve both. `SelectControl`'s `accessibilityLabel`
is therefore composed BY THE CALLER — it must carry the selection ("Status: Active", not
"Status"), and building that string needs a `t` call this package must not make.

### Fixed — a WCAG defect carried in by the promoted code

`AnchoredMenu` marked the current option with `accessibilityState={{ selected }}` alone.
**react-native-web does not read `accessibilityState` at all** (verified against
`react-native-web@0.21`'s `createDOMProps`, which enumerates `aria-selected` /
`accessibilitySelected` and never `accessibilityState`), so on web the selected option was
distinguished by colour and font-weight ONLY — no screen reader could tell which option was
current (WCAG 1.4.1, use of colour). `aria-selected` is now passed alongside, so each platform
gets the channel it honours. The trigger already paired `aria-expanded` with `accessibilityState`;
the option row was simply missed when that was done. A test asserts it, and that test FAILED
before the fix.

## 1.7.0

Additive wave implementing the shared cross-stack forms contract now written down at
`PROOViD/AMLService/AMLService/wwwroot/shared/FORMS.md`. **Nothing in this release moves a pixel
for an existing consumer**: every addition is opt-in and every default is the previous behaviour.
`CONTAINER_MARGIN_BOTTOM` and `ChipSelector`'s compensating `marginBottom: -CHIP_GUTTER` are
deliberately untouched — they are load-bearing and move together in a later, visual-QA-gated wave.

- **Add `FormActions` — the submit/cancel row.** Promoted from the BYTE-IDENTICAL
  `erevna-web/src/components/Forms/FormActions.tsx` and `katalogos-web/.../FormActions.tsx`
  (68 lines each; `diff` returns nothing). All seven portals hand-roll this row; aml-v2, agora,
  kefi, ichnos and zygos each inline their own variant. The primary action is LAST in DOM order so
  tab reaches Cancel before Save, and `saving` drives the primary button's spinner rather than
  disabling-and-relabelling it. `saveDisabled` blocks Save WITHOUT blocking Cancel — an invalid
  form stays escapable. testIDs default to the twins' `save-button` / `cancel-button`, so existing
  Playwright selectors keep matching.
- **`Field` gains `hint`.** ~21 hand-rolled copies of `{fontSize:12, marginTop:4, color:
  textSecondary}` exist across the fleet; aml-v2 alone declares a local `hint` style in 8 files.
  Because `Field` had no hint slot, consumers rendered the hint as a SIBLING, where it lands past
  the container's 16px bottom margin and detaches from the control it explains (see the apologetic
  comment in `aml-v2/src/screens/screening/CoverageSelector.tsx`). The hint renders UNDER the
  control and ABOVE the error, and hint and error COEXIST — both are reachable from the control via
  a composed `aria-describedby` (hint id then error id, in reading order). Only the error is a
  `role="alert"` live region; a hint that announced itself would interrupt on every focus.
- **`Field` gains `optional` + `optionalLabel`.** Mutually exclusive with `required`; when a caller
  sets both, `required` WINS — the safe direction, since an under-marked required field sends the
  user into a failed submit. Enforced at runtime in `resolveFieldMarker` rather than in the type
  system, so a caller spreading a computed props object still gets a defined single-marker result
  instead of a compile error it cannot act on. Like the asterisk, the optional text is decorative
  (`aria-hidden`) — "optional" is the ABSENCE of `aria-required`, which assistive tech already
  conveys.
- **`Field` gains `labelVariant` (+ `labelStyle` as the escape hatch).** `Field` hard-coded
  13/600/sentence-case, which is exactly why kefi-web refused it and why `@dloizides/ui-tables`'
  private `FieldShell` forked to 11/700/uppercase. `labelVariant` makes the contract's TWO
  legitimate voices first-class and named: `field` (13/600 sentence case — a label that is READ)
  and `control` (11/700 UPPERCASE + letter-spacing — a label that is SCANNED, for dense filter bars
  and toolbars). An absent variant resolves to `field`, so every existing consumer renders
  byte-identically. `labelStyle` applies AFTER the variant for the genuine one-off.
- **`Field`'s `containerStyle` widens `ViewStyle` -> `StyleProp<ViewStyle>`.** The narrow type was a
  documented pain: `aml-v2/src/screens/leaders/CountryPicker.tsx` has to build a COMPLETE style per
  variant because it cannot compose an array.
- **`useThemedInput`: a focused errored field now keeps a RED focus ring.** It previously computed
  `isFocused && !hasError`, so an errored field got NO focus ring at all — removing the focus
  indicator (WCAG 2.4.7) from precisely the field the user was sent back to fix, at the moment they
  are most likely navigating by keyboard. It now always rings on focus and only changes the ring's
  COLOUR, matching v1's `input.invalid:focus { box-shadow: 0 0 0 3px var(--danger-tint) }`.
  One pre-existing test necessarily changed: it asserted `boxShadow === 'none'` for this state,
  i.e. it encoded the defect as intended behaviour.
- **New peer dependency `@dloizides/ui-buttons >= 1.4.0`**, required by `FormActions` so the estate
  keeps exactly one button implementation rather than forking one here.
- No i18n runtime is introduced: all user-visible copy (`saveLabel`, `cancelLabel`, `optionalLabel`,
  `hint`, `error`) arrives pre-localized. aml-v2 localizes via `@dloizides/i18n` with positional
  `{0}` params while the other six apps use i18next `{{p1}}`, and nothing bridges them, so a
  component that localized internally could not serve both.
- Also shipping in this tarball, from a CONCURRENT workstream (commit `13bd281`, not part of this
  wave): `ChipSelector` gains `chipTestIDPrefix`, `optionAccessibilityHint` and `multiple`
  toggle semantics, and reads its on-primary ink from the theme's `onBrand` scale instead of a
  hardcoded `#fff`. All opt-in; the `chip-selector-chip-<value>` testID default is frozen.

## 1.6.0

- **`ChipSelector` now composes `Field` internally — its label was drifting.** It rendered its OWN
  `<Text>` label whose metrics differed from `Field`'s on three of four axes: `marginBottom: 8`
  (vs 4), NO `fontSize` at all so it fell back to RN's ~14 (vs 13), and `colors.text`
  (vs `textSecondary`). A `ChipSelector` next to a `FormField` in a row/grid therefore started a
  different distance down the column and read as a different weight of text. Found at 4 sites in
  aml-v2 (`TenantWatchlistsEditor`, `CoverageSelector`, `CustomCoverageFields`,
  `AdvancedMatching`); fixing it in the package fixes every consumer with zero app churn.
  The local label styles are deleted — there is now exactly one label implementation in the kit.
- **`ChipSelectorProps` is unchanged and fully backward-compatible** — every existing prop keeps
  its name, type and default, and `label` stays OPTIONAL. With no label (or an empty one) NO label
  row is rendered, so composing `Field` cannot introduce a phantom gap above the chips.
- **`ChipSelector` gains `required`, `error` and `testID`** (all optional, all additive) now that
  `Field` provides them for free. `error` renders the same `role="alert"` line as `FormField` and
  is tied to the chip group via `aria-describedby` + `aria-invalid` (web only; no-op on native).
- **Spacing:** a `ChipSelector` now carries `Field`'s `marginBottom: 16` like every other field
  (it previously had none). The chips' own 8px trailing gutter is cancelled on the group so the
  block's total bottom spacing is exactly 16 — the same as a `FormField`, not 24. Pass
  `containerStyle` to override, as before.
- **`Field`'s `label` is now optional** (widened from `label: string`, so existing callers are
  unaffected). An absent or empty label renders no label row, letting a control whose label lives
  elsewhere still use the shared shell for its error line and spacing.
- `FormSwitch` / `FormCheckbox` are deliberately NOT changed — see `src/labelRoles.test.tsx`.
  Their labels are INLINE control labels (beside the control in a row, the row's primary text),
  not field headers stacked above a control, so they have no alignment defect to fix and `Field`'s
  smaller/dimmer header treatment would be a regression. They were already identical to each
  other; a new test now enforces that they stay so.

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
