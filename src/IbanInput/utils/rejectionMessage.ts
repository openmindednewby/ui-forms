/** The pre-localized message for a refusal, or null when there is no verdict, it passed, or no labels were given. */
export function rejectionMessage<R extends string, N extends R>(rejection: R | null, none: N, labels: Readonly<Record<Exclude<R, N>, string>> | undefined): string | null {
  if (labels === undefined || rejection === null || rejection === none) return null;
  return labels[rejection as Exclude<R, N>];
}
