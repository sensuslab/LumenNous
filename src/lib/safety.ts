/**
 * Safety layer (brief: SAFETY EXPERIENCE).
 *
 * classifySafety() scans free-text input supplied to the local Engine for
 * crisis, distress and metaphysical-escalation signals. The result tells the
 * Engine when to stop normal composition and answer
 * with a fixed, human, safety-oriented response instead.
 *
 * Design commitments:
 * - Proportionate: ordinary spiritual requests ("a prayer for courage before
 *   my exam") must NOT be flagged; mild sadness is not a crisis.
 * - Never escalate metaphysically: "possessed" / "under attack" language is
 *   met with calm grounding and an explicit refusal to confirm supernatural
 *   harm — never with deliverance framing.
 * - Dignity-preserving: responses keep the user's spiritual framing intact
 *   while pointing to trusted people and professional care.
 * - Privacy: `matchedPhrases` is for in-process debugging only — NEVER log
 *   it (log `level` and `concerns` at most; never the request text).
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SafetyConcern =
  | "self-harm"
  | "suicide"
  | "abuse"
  | "psychosis"
  | "medical-emergency"
  | "metaphysical-escalation"
  | "emotional-distress";

/** Ordered from most to least severe; "none" means no concern detected. */
export type SafetyLevel = "crisis" | "escalation-risk" | "distress" | "none";

export interface SafetyClassification {
  level: SafetyLevel;
  concerns: SafetyConcern[];
  /** In-process debugging only. Never log or persist. */
  matchedPhrases: string[];
}

const CONCERN_SEVERITY: Record<SafetyConcern, SafetyLevel> = {
  "self-harm": "crisis",
  suicide: "crisis",
  abuse: "crisis",
  psychosis: "crisis",
  "medical-emergency": "crisis",
  "metaphysical-escalation": "escalation-risk",
  "emotional-distress": "distress",
};

const LEVEL_RANK: Record<SafetyLevel, number> = {
  crisis: 3,
  "escalation-risk": 2,
  distress: 1,
  none: 0,
};

/* ------------------------------------------------------------------ */
/* Phrase sets (kept deliberately conservative to avoid over-flagging) */
/* ------------------------------------------------------------------ */

const PHRASES: Record<SafetyConcern, string[]> = {
  "self-harm": [
    "self-harm",
    "self harm",
    "hurt myself",
    "hurting myself",
    "cut myself",
    "cutting myself",
    "harm myself",
  ],
  suicide: [
    "suicide",
    "suicidal",
    "kill myself",
    "killing myself",
    "end my life",
    "ending my life",
    "take my own life",
    "end it all",
    "want to die",
    "wanna die",
    "wish i were dead",
    "wish i was dead",
    "better off dead",
    "no reason to live",
    "don't want to be here anymore",
    "do not want to be here anymore",
  ],
  abuse: [
    "being abused",
    "he abuses me",
    "she abuses me",
    "hits me",
    "beats me",
    "beat me",
    "choked me",
    "strangles me",
    "afraid of my partner",
    "scared of my partner",
    "scared of my husband",
    "scared of my wife",
    "afraid of my husband",
    "afraid of my wife",
    "sexual assault",
    "sexually assaulted",
    "was raped",
    "been raped",
    "forces me to have sex",
    "threatens to hurt me",
    "threatened to kill me",
    "domestic violence",
    "child abuse",
    "hurts my child",
    "hurting my child",
  ],
  psychosis: [
    "voices are telling me",
    "voices telling me",
    "voices command me",
    "voices tell me to",
    "hearing voices",
    "the tv is talking to me",
    "tv is sending me messages",
    "messages hidden for me",
    "everyone is watching me",
    "they are poisoning me",
    "being poisoned by",
    "tracking my thoughts",
    "microchip in my brain",
    "thoughts are being controlled",
    "they control my mind",
  ],
  "medical-emergency": [
    "chest pain",
    "crushing chest",
    "can't breathe",
    "cant breathe",
    "cannot breathe",
    "trouble breathing",
    "overdose",
    "took too many pills",
    "taken too many pills",
    "heart attack",
    "think i'm having a stroke",
    "think im having a stroke",
    "bleeding heavily",
    "won't stop bleeding",
    "wont stop bleeding",
    "someone is unconscious",
    "severe allergic reaction",
  ],
  "metaphysical-escalation": [
    "possessed",
    "demon in me",
    "demons are attacking",
    "demon is attacking",
    "demon attacking",
    "attacked by demons",
    "under spiritual attack",
    "spiritual attack",
    "curse on me",
    "curse on my family",
    "put a curse on",
    "i am cursed",
    "i'm cursed",
    "been hexed",
    "hex on me",
    "entity attached",
    "entity attachment",
    "evil spirit in me",
    "evil spirits are in",
    "witchcraft against me",
    "dark entity",
    "negative entity",
  ],
  "emotional-distress": [
    "i feel hopeless",
    "feel completely hopeless",
    "can't cope anymore",
    "cant cope anymore",
    "cannot cope anymore",
    "i'm falling apart",
    "i am falling apart",
    "i'm breaking down",
    "i am breaking down",
    "i hate myself",
    "feel worthless",
    "i am worthless",
    "i'm worthless",
    "no one cares about me",
    "completely alone in this",
    "want to disappear",
    "want everything to stop",
  ],
};

/* ------------------------------------------------------------------ */
/* Matching engine                                                     */
/* ------------------------------------------------------------------ */

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Word-boundary phrase regex: \b where the phrase edge is a word char. */
function phraseRegex(phrase: string): RegExp {
  const escaped = escapeRegExp(phrase);
  const prefix = /^\w/.test(phrase) ? "\\b" : "";
  const suffix = /\w$/.test(phrase) ? "\\b" : "";
  return new RegExp(`${prefix}${escaped}${suffix}`, "i");
}

interface CompiledConcern {
  concern: SafetyConcern;
  patterns: { phrase: string; regex: RegExp }[];
}

const COMPILED: CompiledConcern[] = (
  Object.entries(PHRASES) as [SafetyConcern, string[]][]
).map(([concern, phrases]) => ({
  concern,
  patterns: phrases.map((phrase) => ({ phrase, regex: phraseRegex(phrase) })),
}));

/** Normalise for matching: curly quotes, case, whitespace, punctuation-lite. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Classify free text for safety concerns. Returns level "none" when nothing
 * is detected. Detection is phrase-based and conservative; it is a routing
 * aid for the endpoint, not a clinical judgement.
 */
export function classifySafety(text: string): SafetyClassification {
  const normalized = normalize(text);
  const concerns: SafetyConcern[] = [];
  const matchedPhrases: string[] = [];

  for (const { concern, patterns } of COMPILED) {
    for (const { phrase, regex } of patterns) {
      if (regex.test(normalized)) {
        if (!concerns.includes(concern)) concerns.push(concern);
        matchedPhrases.push(phrase);
        break; // one hit per concern is enough
      }
    }
  }

  let level: SafetyLevel = "none";
  for (const concern of concerns) {
    const severity = CONCERN_SEVERITY[concern];
    if (LEVEL_RANK[severity] > LEVEL_RANK[level]) {
      level = severity;
    }
  }

  return { level, concerns, matchedPhrases };
}

/** True when the Engine must bypass composition and use a safety response. */
export function shouldBypassGeneration(classification: SafetyClassification): boolean {
  return classification.level !== "none";
}

/* ------------------------------------------------------------------ */
/* Standard safety responses (fixed text — never generated)            */
/* ------------------------------------------------------------------ */

/**
 * Crisis response: immediate danger, self-harm, suicide, abuse, psychosis,
 * medical emergency. Calm, grounding, dignity-preserving; points to human
 * and professional help; contains NO spiritual diagnosis and NO generated
 * prayer. Line references are signposts, not endorsements of one country.
 */
export const SAFETY_RESPONSE_CRISIS = [
  "Thank you for trusting this space with something so heavy. What you are carrying right now matters more than any prayer we could offer, and you deserve real, human support — today, not someday.",
  "",
  "If you are in immediate danger or might hurt yourself, please contact emergency services now, or go to your nearest emergency department. If you can, tell someone you trust what is happening and ask them to stay with you.",
  "",
  "You can also reach trained listeners any time, day or night: Samaritans (UK & Ireland) on 116 123; the 988 Suicide & Crisis Lifeline (US) by call or text to 988; or a crisis line where you live. If someone is hurting you, a local domestic-abuse service can help you plan safety at your own pace.",
  "",
  "If it helps right now: put both feet on the floor, name five things you can see, and take one slow breath at a time. You are not alone, this moment is survivable, and reaching out is the strongest thing you can do.",
].join("\n");

/**
 * Distress response: heavy emotional weight without crisis signals. Gentle
 * grounding plus encouragement toward trusted and professional support.
 */
export const SAFETY_RESPONSE_DISTRESS = [
  "That sounds genuinely hard, and it is okay to say so out loud. You do not have to carry this alone.",
  "",
  "For this moment, try something small: unclench your jaw, drop your shoulders, and breathe out longer than you breathe in, a few times. One moment at a time is enough.",
  "",
  "If this weight keeps returning, please consider telling someone — a trusted friend, a family member, or your doctor. Persistent heaviness deserves the same care as any other health matter, and asking for it is strength, not failure.",
  "",
  "When you feel steadier, the library's grounding prayers and practices are here for you.",
].join("\n");

/**
 * Escalation-risk response: fears of possession, curses, spiritual attack.
 * NEVER confirms a supernatural threat; gently reframes toward ordinary,
 * trustworthy support while preserving the user's dignity and framing.
 */
export const SAFETY_RESPONSE_ESCALATION = [
  "I hear how frightening this feels, and I want you to know: we cannot and will not confirm that you are possessed, cursed or under spiritual attack. Fear like this is real and deserves care — and in our experience it grows when fed and settles when grounded.",
  "",
  "Try this now: feel your feet on the floor, look around and name five ordinary things you can see, and take three slow breaths. Your body is here, in this room, and this moment is safe enough to breathe through.",
  "",
  "Please also consider talking with someone you trust — a friend, a faith leader you respect, or a healthcare professional — especially if these fears are loud or persistent. Feeling watched or attacked can have many ordinary causes, and a good listener can help you untangle them without judgement.",
  "",
  "The grounding and protection prayers in the library speak of shelter and steadiness, never of enemies — you are welcome there whenever you feel ready.",
].join("\n");

/** Pick the standard response for a classification ("" for level "none"). */
export function safetyResponseFor(classification: SafetyClassification): string {
  switch (classification.level) {
    case "crisis":
      return SAFETY_RESPONSE_CRISIS;
    case "escalation-risk":
      return SAFETY_RESPONSE_ESCALATION;
    case "distress":
      return SAFETY_RESPONSE_DISTRESS;
    case "none":
      return "";
  }
}
