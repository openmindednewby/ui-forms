/**
 * `SelectControl` — a single-select enum/status dropdown. A bordered trigger shows the selected
 * option's label (or the placeholder when unset) plus a chevron; pressing it opens the shared
 * {@link AnchoredMenu}. Selecting fires `onChange` and closes.
 *
 * Promoted out of `@dloizides/ui-tables`' private `Filters/fields/SelectField`, where six portals
 * could see it working and none could import it — which is why the fleet grew SIX independent
 * select implementations.
 *
 * The control is LABEL-FREE by design: wrap it in a `Field` (with `labelVariant="control"` on a
 * dense surface) to get the label, hint and error slots. That keeps one label implementation for
 * every control instead of one per control.
 *
 * i18n: this package never calls `t`. `accessibilityLabel`, `placeholder`, `accessibilityHint`
 * and `optionHint` are PRE-LOCALIZED strings supplied by the caller — the only shape that can
 * serve both aml-v2's positional `{0}` `@dloizides/i18n` and the other six portals' i18next
 * `{{p1}}` from one component.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { AnchoredMenu } from '../AnchoredMenu/AnchoredMenu';
import { listboxDomId, optionDomId } from '../AnchoredMenu/components/OptionRow';
import { controlStyles as s } from '../controls/controlStyles';
import type { ControlOption } from '../controls/controlTypes';
import { useSelectListbox } from './useSelectListbox';

const CHEVRON_DOWN = '▾';
const CHEVRON_UP = '▴';

/** Opts in to a menu that stays on screen with focus on the trigger, for screen edges and focus-trapped sheets. */
export interface SelectMenuAnchor {
  listboxLabel: string;
  anchorRef?: React.RefObject<View | null>;
}

export interface SelectControlProps {
  options: readonly ControlOption[];
  /** The selected option's `value`. `''` (or any unmatched value) renders the placeholder. */
  value: string;
  onChange: (value: string) => void;
  /** PRE-LOCALIZED text shown when the value matches no option. */
  placeholder?: string;
  /**
   * PRE-LOCALIZED accessible NAME of the trigger. It REPLACES the trigger's visible text for a
   * screen reader, so it must carry the SELECTION too — "Status: Active", not just "Status",
   * which announces the control but silently hides its value.
   */
  accessibilityLabel: string;
  accessibilityHint?: string;
  /**
   * `id` of the `Field` label naming this control — take it from the render-child context's
   * `labelId`. The trigger is a `<div role="button">`, which `<label for>` cannot address (that
   * only works for native form elements), so the association runs the other way: the trigger
   * points AT the label.
   *
   * `accessibilityLabel` still wins for the accessible NAME, deliberately — it is the only one of
   * the two that carries the current selection ("Status: Active"). This adds the structural link
   * without changing a single announcement.
   */
  labelledById?: string;
  /** PRE-LOCALIZED accessibility hint applied to every option in the menu. */
  optionHint?: string;
  menuAnchor?: SelectMenuAnchor;
  /** Merged LAST onto the anchor wrapper — the consumer always wins over the shared style. */
  style?: StyleProp<ViewStyle>;
  /** Trigger is `${testID}-trigger`, menu `${testID}-menu`, options `${testID}-option-${value}`. */
  testID: string;
}

function listboxTriggerAria(testID: string, hasList: boolean, highlighted: ControlOption | undefined): Record<string, string | undefined> {
  return {
    role: 'combobox',
    'aria-controls': hasList ? listboxDomId(testID) : undefined,
    'aria-activedescendant': highlighted !== undefined ? optionDomId(testID, highlighted.value) : undefined,
  };
}

export function SelectControl({
  options,
  value,
  onChange,
  placeholder = '',
  accessibilityLabel,
  accessibilityHint,
  labelledById,
  optionHint = '',
  menuAnchor,
  style,
  testID,
}: SelectControlProps): React.ReactElement {
  const { theme } = useUi();
  const { colors, palette } = theme;
  const anchorRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label ?? placeholder;
  }, [options, placeholder, value]);

  const close = useCallback(() => { setIsOpen(false); }, []);
  const open = useCallback(() => { setIsOpen(true); }, []);
  const toggle = useCallback(() => { setIsOpen((prev) => !prev); }, []);
  const select = useCallback(
    (next: string) => {
      onChange(next);
      setIsOpen(false);
    },
    [onChange],
  );
  const listbox = useSelectListbox({ options, isOpen, open, toggle, select });
  const isListbox = menuAnchor !== undefined;
  const captureKeys: Record<string, unknown> = isListbox ? { onKeyDownCapture: listbox.onKeyDown } : {};
  const triggerAria = isListbox ? listboxTriggerAria(testID, isOpen && options.length > 0, listbox.highlighted) : {};

  return (
    <View ref={anchorRef} style={[s.anchor, style]} {...captureKeys}>
      <Pressable
        {...triggerAria}
        accessibilityRole={isListbox ? undefined : 'button'}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ expanded: isOpen }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={labelledById}
        onBlur={isListbox ? close : undefined}
        onPress={toggle}
        style={[s.selectTrigger, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}
        testID={`${testID}-trigger`}
      >
        <Text numberOfLines={1} style={[s.selectTriggerText, { color: value === '' ? colors.textSecondary : colors.text }]}>
          {selectedLabel}
        </Text>
        <Text aria-hidden style={[s.chevron, { color: colors.textSecondary }]}>{isOpen ? CHEVRON_UP : CHEVRON_DOWN}</Text>
      </Pressable>
      {isOpen ? (
        <AnchoredMenu
          options={options}
          selectedValue={value}
          onSelect={select}
          onDismiss={close}
          colors={{ text: colors.text, ...(isListbox ? { textSecondary: colors.textSecondary } : null), border: colors.border, surface: colors.surface, brand: palette.primary['500'] }}
          optionHint={optionHint}
          testID={testID}
          anchorRef={anchorRef}
          accessibilityLabel={menuAnchor?.listboxLabel}
          listbox={isListbox ? { highlightedValue: listbox.highlighted?.value } : undefined}
          placement={isListbox ? { positionRef: menuAnchor.anchorRef } : undefined}
        />
      ) : null}
    </View>
  );
}

export default SelectControl;
