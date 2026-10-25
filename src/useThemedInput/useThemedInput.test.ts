import { renderHook, act } from '@testing-library/react';

import { useThemedInput } from './useThemedInput';

// No FeedbackUiProvider is mounted, so the hook reads @dloizides/ui-feedback's neutral default
// theme (primary '500' = #2563eb, surface = #f7f7f7, surfaceElevated = #ffffff). `react-native`
// resolves to `react-native-web` in tests, so Platform.OS === 'web' and the web treatment applies.

type FocusHandler = { onFocus: (e: unknown) => void; onBlur: (e: unknown) => void };
type Hoverable = { onMouseEnter?: () => void; onMouseLeave?: () => void };

describe('useThemedInput', () => {
  it('gives a read-only field the recessed ground fill and the secondary ink', () => {
    const { result } = renderHook(() => useThemedInput({ editable: false }));
    expect(result.current.style.backgroundColor).toBe('#ffffff');
    expect(result.current.style.color).toBe('#666666');
  });

  it('keeps an editable field on the elevated fill and the primary ink', () => {
    const { result } = renderHook(() => useThemedInput({ editable: true }));
    expect(result.current.style.color).not.toBe('#666666');
  });

  it('starts unfocused/unhovered with the rest background', () => {
    const { result } = renderHook(() => useThemedInput());
    expect(result.current.isFocused).toBe(false);
    expect(result.current.isHovered).toBe(false);
    // Rest background is the subtle off-white surfaceElevated, NOT the plain surface.
    expect(result.current.style.backgroundColor).toBe('#ffffff');
    // The placeholder is the theme's textSecondary (#666666) composited toward the field
    // background at 0.6 alpha, so a hint reads clearly lighter than solid entered text.
    expect(result.current.placeholderTextColor).toBe('rgba(102, 102, 102, 0.6)');
  });

  it('applies the brand focus treatment on focus (border, brighter bg, ring) and reverts on blur', () => {
    const { result } = renderHook(() => useThemedInput());
    const restBg = result.current.style.backgroundColor;
    const restBorder = result.current.style.borderColor;

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));

    expect(result.current.isFocused).toBe(true);
    expect(result.current.style.borderColor).toBe('#2563eb'); // primary 500
    expect(result.current.style.backgroundColor).not.toBe(restBg); // brightened to surface
    expect(result.current.style).toMatchObject({ outlineColor: '#2563eb', outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' });

    act(() => (result.current.focusBind as FocusHandler).onBlur({}));

    expect(result.current.isFocused).toBe(false);
    expect(result.current.style.borderColor).toBe(restBorder);
    expect((result.current.style as { outlineColor?: string; outlineWidth?: number }).outlineWidth).toBe(0);
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
    expect((result.current.style as { outlineColor?: string; outlineWidth?: number }).outlineWidth).toBe(0);

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));

    expect((result.current.style as { outlineColor?: string; outlineWidth?: number }).outlineWidth).toBe(2);
    expect((result.current.style as { outlineColor?: string; outlineWidth?: number }).outlineColor).toBe('#dc2626');
  });

  it('gives a focused valid field the BRAND ring, so the two states stay distinguishable', () => {
    const { result } = renderHook(() => useThemedInput({ hasError: false }));

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));

    expect((result.current.style as { outlineColor?: string; outlineWidth?: number }).outlineWidth).toBe(2);
    expect((result.current.style as { outlineColor?: string; outlineWidth?: number }).outlineColor).toBe('#2563eb');
  });

  it('clears the ring on blur in both error states', () => {
    const { result, rerender } = renderHook((props: { hasError: boolean }) => useThemedInput(props), {
      initialProps: { hasError: true },
    });
    act(() => (result.current.focusBind as FocusHandler).onFocus({}));
    act(() => (result.current.focusBind as FocusHandler).onBlur({}));
    expect((result.current.style as { outlineColor?: string; outlineWidth?: number }).outlineWidth).toBe(0);

    rerender({ hasError: false });
    expect((result.current.style as { outlineColor?: string; outlineWidth?: number }).outlineWidth).toBe(0);
  });
});
