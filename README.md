# @dloizides/ui-forms

Themable, brand-agnostic React Native (RN-web) **form** components for the dloizides.com
portfolio: `FormField`, `ChipSelector`, `FormSwitch`. They read theme colours from the shared
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

The injected theme needs `colors.{surface,text,textSecondary,border}`, `palette.primary['500']`
and `semantic.error['500']` — supplied via `@dloizides/ui-feedback`'s provider. Without a provider
the components fall back to a neutral default theme.

## testIDs

`form-field-input`, `chip-selector-chip-<value>`, `form-switch` (overridable on FormSwitch).

## License

MIT
