import React from 'react';

import Svg, { Path } from 'react-native-svg';

import { CHEVRON_BOX } from './selectLook';

/** The drawn down / up chevron of the `field` select look. */
export function SelectChevron({ color, open }: { color: string; open: boolean }): React.ReactElement {
  return (
    <Svg aria-hidden fill="none" height={CHEVRON_BOX} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} viewBox="0 0 16 16" width={CHEVRON_BOX}>
      <Path d={open ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} />
    </Svg>
  );
}
