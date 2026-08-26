export const GROUNDING_REGULATION_INSTRUCTION =
  "Keep your eyes open. Feel the support beneath you, then slowly name three neutral things you can see, two sounds you can hear and one point of contact. There is no count to follow.";

export const GROUNDING_REGULATION_PROMPT =
  "Let attention settle on what is concrete and present.";

export function isBreathFocusAvoidance(value: string): boolean {
  return /\b(?:breath|breathing|breathwork)\b/i.test(value);
}

export function avoidsBreathFocus(avoidances: readonly string[]): boolean {
  return avoidances.some(isBreathFocusAvoidance);
}
