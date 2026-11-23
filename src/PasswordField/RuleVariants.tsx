import React from 'react';

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { RuleMark } from './RuleMark';
import { ruleTone } from './RuleTone';
import type { PasswordRuleState } from './types';
import type { RuleColors } from './useRuleColors';

const GAP = 6;
const ROW_GAP = 8;
const FONT = 14;
const LINE = 20;
const METER_HEIGHT = 4;
const RADIUS = 999;
const CHIP_PAD_V = 4;
const CHIP_PAD_H = 10;
const CHIP_BORDER = 1;
const HALF = '50%';

const styles = StyleSheet.create({
  column: { gap: GAP },
  row: { flexDirection: 'row', alignItems: 'center', gap: ROW_GAP },
  text: { fontSize: FONT, lineHeight: LINE, flexShrink: 1 },
  meter: { flexDirection: 'row', gap: GAP },
  segment: { flex: 1, height: METER_HEIGHT, borderRadius: RADIUS },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: GAP },
  cell: { flexBasis: HALF, maxWidth: HALF, paddingRight: GAP },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  chip: { borderRadius: RADIUS, borderWidth: CHIP_BORDER, paddingVertical: CHIP_PAD_V, paddingHorizontal: CHIP_PAD_H },
  metPhrase: { fontWeight: '700', textDecorationLine: 'underline' },
});

export interface RuleVariantProps {
  rules: readonly PasswordRuleState[];
  flagUnmet: boolean;
  colors: RuleColors;
  testID: string;
}

interface RuleListProps extends RuleVariantProps {
  listStyle: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  outlined?: boolean;
}

function RuleList({ rules, flagUnmet, colors, testID, listStyle, itemStyle, outlined = false }: RuleListProps): React.ReactElement {
  return (
    <View role="list" style={listStyle} testID={testID}>
      {rules.map((rule) => {
        const tone = ruleTone(rule.met, flagUnmet);
        const outline = outlined ? { borderColor: colors.mark[tone] } : null;
        return (
          <View key={rule.id} role="listitem" style={[styles.row, itemStyle, outline]} testID={`${testID}-${rule.id}`} {...{ dataSet: { tone } }}>
            <RuleMark colors={colors} tone={tone} />
            <Text style={[styles.text, { color: colors.text[tone] }]}>{rule.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

export function RulesChecklist(props: RuleVariantProps): React.ReactElement {
  return <RuleList {...props} listStyle={styles.column} />;
}

export function RulesChips(props: RuleVariantProps): React.ReactElement {
  return <RuleList {...props} outlined itemStyle={styles.chip} listStyle={styles.chips} />;
}

export function RulesMeterGrid(props: RuleVariantProps): React.ReactElement {
  const { rules, flagUnmet, colors, testID } = props;
  const metCount = rules.filter((rule) => rule.met).length;
  const unfilled = flagUnmet ? colors.mark.refused : colors.track;
  return (
    <View style={styles.column}>
      <View style={styles.meter} testID={`${testID}-meter`}>
        {rules.map((rule, index) => (
          <View key={rule.id} style={[styles.segment, { backgroundColor: index < metCount ? colors.mark.met : unfilled }]} />
        ))}
      </View>
      <RuleList {...props} itemStyle={styles.cell} listStyle={styles.grid} />
    </View>
  );
}

export function RulesSentence({ rules, flagUnmet, colors, testID }: RuleVariantProps): React.ReactElement {
  return (
    <Text style={[styles.text, { color: colors.text.unmet }]} testID={testID}>
      {rules.map((rule, index) => {
        const tone = ruleTone(rule.met, flagUnmet);
        return (
          <Text key={rule.id} style={[{ color: colors.text[tone] }, rule.met ? styles.metPhrase : null]} testID={`${testID}-${rule.id}`} {...{ dataSet: { tone } }}>
            {index > 0 ? ', ' : ''}
            {rule.label}
          </Text>
        );
      })}
    </Text>
  );
}
