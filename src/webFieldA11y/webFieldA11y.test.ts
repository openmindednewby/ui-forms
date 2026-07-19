/**
 * These run under the WEB renderer (`react-native` -> `react-native-web`), so `Platform.OS`
 * is 'web' and the web treatment applies — the same environment every one of the 7 portals
 * actually ships. The native no-op branch is stated in the helper's own contract and is
 * covered by the ChipSelector/ThemedTextInput behaviour, not re-asserted here, because this
 * package has no native Jest project to assert it under honestly.
 */
import { webFieldA11y } from './webFieldA11y';

describe('webFieldA11y', () => {
  it('announces the error state and links the describing element', () => {
    expect(webFieldA11y({ describedById: 'err-1', hasError: true })).toEqual({
      'aria-invalid': true,
      'aria-describedby': 'err-1',
      'aria-required': undefined,
    });
  });

  it('emits nothing for a clean, optional field rather than explicit negatives', () => {
    // `aria-invalid="false"` and `aria-required="false"` are NOT equivalent to saying
    // nothing: they are announced. A pristine optional field must be silent.
    const props = webFieldA11y({});

    expect(props['aria-invalid']).toBeUndefined();
    expect(props['aria-required']).toBeUndefined();
    expect(props['aria-describedby']).toBeUndefined();
  });

  it('marks a required field', () => {
    expect(webFieldA11y({ required: true })['aria-required']).toBe(true);
  });

  it('keeps describedById independent of the error state', () => {
    // The hint line is described even when the field is valid — the id is not an error channel.
    expect(webFieldA11y({ describedById: 'hint-1', hasError: false })['aria-describedby']).toBe('hint-1');
  });

  it('gives ChipSelector and ThemedTextInput the SAME answer for the same input', () => {
    // The regression this dedupe exists to prevent: the two call sites drifting apart.
    // ChipSelector passes no `required`; ThemedTextInput passes it explicitly as false.
    // Those must remain indistinguishable.
    const chipGroup = webFieldA11y({ describedById: 'e', hasError: true });
    const textInput = webFieldA11y({ describedById: 'e', hasError: true, required: false });

    expect(chipGroup).toEqual(textInput);
  });
});
