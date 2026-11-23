export interface PasswordRuleState {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordFieldLabels {
  show: string;
  hide: string;
  met: string;
  unmet: string;
}

export interface PasswordFieldColors {
  success: string;
  error: string;
  text: string;
  textSecondary: string;
  border: string;
  background: string;
}
