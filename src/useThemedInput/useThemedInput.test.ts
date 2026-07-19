import { renderHook, act } from '@testing-library/react';

import { useThemedInput } from './useThemedInput';

// No FeedbackUiProvider is mounted, so the hook reads @dloizides/ui-feedback's neutral default
// theme (primary '500' = #2563eb, surface = #f7f7f7, surfaceElevated = #ffffff). `react-native`
// resolves to `react-native-web` in tests, so Platform.OS === 'web' and the web treatment applies.

type FocusHandler = { onFocus: (e: unknown) => void; onBlur: (e: unknown) => void };
type Hoverable = { onMouseEnter?: () => void; onMouseLeave?: () => void };

describe('useThemedInput', () => {
  it('starts unfocused/unhovered with the rest background', () => {
    const { result } = renderHook(() => useThemedInput());
    expect(result.current.isFocused).toBe(false);
    expect(result.current.isHovered).toBe(false);
    // Rest background is the subtle off-white surfaceElevated, NOT the plain surface.
    expect(result.current.style.backgroundColor).toBe('#ffffff');
    expect(result.current.placeholderTextColor).toBe('#666666');
  });

  it('applies the brand focus treatment on focus (border, brighter bg, ring) and reverts on blur', () => {
    const { result } = renderHook(() => useThemedInput());
    const restBg = result.current.style.backgroundColor;
    const restBorder = result.current.style.borderColor;

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));

    expect(result.current.isFocused).toBe(true);
    expect(result.current.style.borderColor).toBe('#2563eb'); // primary 500
    expect(result.current.style.backgroundColor).not.toBe(restBg); // brightened to surface
    // The soft ring is a box-shadow (compositor-only, no reflow), present only while focused.
    const focusedShadow = (result.current.style as { boxShadow?: string }).boxShadow;
    expect(focusedShadow).toContain('rgba(37, 99, 235, 0.16)');

    act(() => (result.current.focusBind as FocusHandler).onBlur({}));

    expect(result.current.isFocused).toBe(false);
    expect(result.current.style.borderColor).toBe(restBorder);
    expect((result.current.style as { boxShadow?: string }).boxShadow).toBe('none');
  });

  it('composes a caller-supplied onFocus/onBlur with the internal focus toggle', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { result } = renderHook(() => useThemedInput({ onFocus, onBlur }));

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));
    act(() => (result.current.focusBind as FocusHandler).onBlur({}));

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('strengthens the border on hover (web)', () => {
    const { result } = renderHook(() => useThemedInput());
    const restBorder = result.current.style.borderColor;

    act(() => (result.current.hoverBind as Hoverable).onMouseEnter?.());

    expect(result.current.isHovered).toBe(true);
    expect(result.current.style.borderColor).not.toBe(restBorder);

    act(() => (result.current.hoverBind as Hoverable).onMouseLeave?.());
    expect(result.current.isHovered).toBe(false);
  });

  it('keeps the error border on focus instead of the brand border', () => {
    const { result } = renderHook(() => useThemedInput({ hasError: true }));
    expect(result.current.style.borderColor).toBe('#dc2626'); // error 500

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));

    expect(result.current.style.borderColor).toBe('#dc2626');
  });

  /**
   * This assertion previously read `boxShadow === 'none'` — it encoded an ACCESSIBILITY
   * REGRESSION as intended behaviour. An errored field that is focused kept no focus indicator
   * at all (WCAG 2.4.7), on precisely the field the user was sent back to fix. The v1 contract
   * (`input.invalid:focus { box-shadow: 0 0 0 3px var(--danger-tint) }`) keeps the ring and only
   * changes its colour. See `…/wwwroot/shared/FORMS.md` → "the distinct invalid-focus ring".
   */
  it('gives a focused errored field a RED ring, never no ring', () => {
    const { result } = renderHook(() => useThemedInput({ hasError: true }));
    expect((result.current.style as { boxShadow?: string }).boxShadow).toBe('none');

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));

    const ring = (result.current.style as { boxShadow?: string }).boxShadow;
    expect(ring).not.toBe('none');
    // The error colour (#dc2626 → 220,38,38), NOT the brand primary.
    expect(ring).toBe('0 0 0 3px rgba(220, 38, 38, 0.16)');
  });

  it('gives a focused valid field the BRAND ring, so the two states stay distinguishable', () => {
    const { result } = renderHook(() => useThemedInput({ hasError: false }));

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));

    const ring = (result.current.style as { boxShadow?: string }).boxShadow;
    expect(ring).not.toBe('none');
    expect(ring).not.toBe('0 0 0 3px rgba(220, 38, 38, 0.16)');
  });

  it('clears the ring on blur in both error states', () => {
    const { result, rerender } = renderHook((props: { hasError: boolean }) => useThemedInput(props), {
      initialProps: { hasError: true },
    });
    act(() => (result.current.focusBind as FocusHandler).onFocus({}));
    act(() => (result.current.focusBind as FocusHandler).onBlur({}));
    expect((result.current.style as { boxShadow?: string }).boxShadow).toBe('none');

    rerender({ hasError: false });
    expect((result.current.style as { boxShadow?: string }).boxShadow).toBe('none');
  });
});
