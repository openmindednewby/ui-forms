import type { ChipOption, ChipProps } from '../types';

/**
 * The a11y + testID triple a chip needs, resolved once for both variants.
 *
 * Exported for direct unit testing. It has to be tested as a pure function rather than
 * through the DOM because react-native-web DROPS `accessibilityHint` entirely — it reaches
 * native, but no web attribute carries it, so no rendering assertion can tell a correctly
 * threaded hint from one that was never passed. Testing the resolver is the only honest way
 * to pin the behaviour.
 */
export function chipIdentity<T>(
  option: ChipOption<T>,
  selected: boolean,
  config: { prefix: string; hint?: string; multiple: boolean; radio?: boolean },
): Pick<ChipProps<T>, 'testID' | 'accessibilityHint' | 'ariaPressed' | 'accessibilityRole' | 'ariaChecked'> {
  const isRadio = config.radio === true && !config.multiple;
  return {
    testID: `${config.prefix}-${String(option.value)}`,
    // The English default is retained verbatim: erevna/katalogos assert the exact string
    // `Selects Red`. Consumers that localize pass `optionAccessibilityHint`.
    accessibilityHint: config.hint ?? `Selects ${option.label}`,
    ariaPressed: config.multiple ? selected : undefined,
    accessibilityRole: isRadio ? 'radio' : 'button',
    ariaChecked: isRadio ? selected : undefined,
  };
}
