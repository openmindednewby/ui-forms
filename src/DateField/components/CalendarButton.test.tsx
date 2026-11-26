import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { fireEvent, render, screen } from '@testing-library/react';

import { CALENDAR_BUTTON_BOX, CalendarButton, calendarButtonHitSlop } from './CalendarButton';
import { ICON_SLOT } from './DatePickerInput';

const FIELD_LOOK_HEIGHT = 38;
const TEST_ID = 'from-calendar';

function renderButton(disabled: boolean): jest.Mock {
  const onPress = jest.fn();
  render(<CalendarButton disabled={disabled} hint="Opens the calendar" label="Open calendar" testID={TEST_ID} onPress={onPress} />);
  return onPress;
}

describe('CALENDAR_BUTTON_BOX', () => {
  it('in the icon slot that spans the input, fills the full input height instead of a fixed edge', () => {
    const box = CALENDAR_BUTTON_BOX;

    const slotSpansInput = ICON_SLOT.top === 0 && ICON_SLOT.bottom === 0;

    expect({ slotSpansInput, height: box.height, minHeight: box.minHeight }).toEqual({ slotSpansInput: true, height: '100%', minHeight: undefined });
  });
});

describe('calendarButtonHitSlop', () => {
  it('with a 38 px look box, pads the hit box up to the touch-target floor', () => {
    const expected = Math.ceil((MIN_TOUCH_TARGET_PX - FIELD_LOOK_HEIGHT) / 2);

    const slop = calendarButtonHitSlop(FIELD_LOOK_HEIGHT);

    expect(slop).toEqual({ top: expected, bottom: expected, left: 0, right: 0 });
  });

  it('without a look box, adds no slop because the input keeps the touch-target floor', () => {
    const slop = calendarButtonHitSlop(undefined);

    expect(slop).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
  });
});

describe('CalendarButton', () => {
  it('when pressed, calls onPress once', () => {
    const onPress = renderButton(false);

    fireEvent.click(screen.getByTestId(TEST_ID));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('when disabled and pressed, does not call onPress', () => {
    const onPress = renderButton(true);

    fireEvent.click(screen.getByTestId(TEST_ID));

    expect(onPress).not.toHaveBeenCalled();
  });
});
