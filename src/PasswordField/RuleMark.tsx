import React, { useEffect, useRef } from 'react';

import { Animated, Easing, StyleSheet, View } from 'react-native';

import { SvgIcon } from '@dloizides/ui-icons';

import { useReducedMotion } from '../SearchSelect/hooks/useReducedMotion';
import { RuleTone } from './RuleTone';
import type { RuleColors } from './useRuleColors';

const MARK_SIZE = 16;
const CHECK_SIZE = 12;
const RING_WIDTH = 1.5;
const POP_FROM = 0.6;
const POP_PEAK = 1.12;
const POP_UP_MS = 160;
const POP_SETTLE_MS = 100;

const styles = StyleSheet.create({
  mark: { width: MARK_SIZE, height: MARK_SIZE, borderRadius: MARK_SIZE / 2, alignItems: 'center', justifyContent: 'center' },
  ring: { borderWidth: RING_WIDTH },
});

export interface RuleMarkProps {
  tone: RuleTone;
  colors: RuleColors;
}

export function RuleMark({ tone, colors }: RuleMarkProps): React.ReactElement {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const wasMet = useRef(tone === RuleTone.Met);
  const met = tone === RuleTone.Met;
  useEffect(() => {
    const turnedMet = met && !wasMet.current;
    wasMet.current = met;
    if (!turnedMet || reduced) return;
    scale.setValue(POP_FROM);
    Animated.sequence([
      Animated.timing(scale, { toValue: POP_PEAK, duration: POP_UP_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(scale, { toValue: 1, duration: POP_SETTLE_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, [met, reduced, scale]);
  const color = colors.mark[tone];
  const shape = met ? { backgroundColor: color } : [styles.ring, { borderColor: color }];
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View style={[styles.mark, shape]}>
        {met ? <SvgIcon color={colors.onMark} name="check" size={CHECK_SIZE} /> : null}
      </View>
    </Animated.View>
  );
}
