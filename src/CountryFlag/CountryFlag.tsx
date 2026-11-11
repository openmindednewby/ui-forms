import React from 'react';

import Svg, { Circle, Polygon, Rect } from 'react-native-svg';

import { FLAG_EDGE } from './data/flagPalette';
import { FlagShapeKind } from './FlagShapeKind';
import { FLAG_HEIGHT, FLAG_WIDTH, flagShapes, type FlagShape } from './utils/flagShapes';

const EDGE_WIDTH = 0.5;
const EDGE_INSET = 0.25;
const HALF = 2;
const VIEW_BOX = `0 0 ${FLAG_WIDTH} ${FLAG_HEIGHT}`;

function drawShape(shape: FlagShape, key: number): React.ReactElement {
  if (shape.kind === FlagShapeKind.Circle) return <Circle key={key} cx={shape.x} cy={shape.y} fill={shape.fill} r={shape.width / HALF} />;
  if (shape.kind === FlagShapeKind.Polygon) return <Polygon key={key} fill={shape.fill} points={shape.points} />;
  return <Rect key={key} fill={shape.fill} height={shape.height} width={shape.width} x={shape.x} y={shape.y} />;
}

export interface CountryFlagProps {
  code: string;
  testID?: string;
}

/** A 20x14 drawn flag for a 2-letter country code; decorative, the country name carries the meaning. */
export function CountryFlag({ code, testID }: CountryFlagProps): React.ReactElement {
  return (
    <Svg accessibilityElementsHidden aria-hidden height={FLAG_HEIGHT} importantForAccessibility="no-hide-descendants" testID={testID} viewBox={VIEW_BOX} width={FLAG_WIDTH}>
      {flagShapes(code).map((shape, index) => drawShape(shape, index))}
      <Rect fill="none" height={FLAG_HEIGHT - EDGE_WIDTH} stroke={FLAG_EDGE} strokeWidth={EDGE_WIDTH} width={FLAG_WIDTH - EDGE_WIDTH} x={EDGE_INSET} y={EDGE_INSET} />
    </Svg>
  );
}
