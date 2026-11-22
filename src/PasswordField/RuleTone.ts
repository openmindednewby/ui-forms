export const enum RuleTone {
  Met = 'met',
  Unmet = 'unmet',
  Refused = 'refused',
}

export function ruleTone(met: boolean, flagUnmet: boolean): RuleTone {
  if (met) return RuleTone.Met;
  return flagUnmet ? RuleTone.Refused : RuleTone.Unmet;
}
