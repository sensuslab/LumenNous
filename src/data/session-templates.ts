import {
  SessionTemplateSchema,
  type SessionTemplate,
  type SessionVariant,
} from "@/lib/schemas";

const SHARED_SOURCES = [
  "src-quantum-prayers-coherence",
  "src-slow-breathing-systematic-review",
  "src-music-listening-anxiety-meta-analysis",
];

const SHARED_ACCESSIBILITY =
  "Every instruction is visible as text. Sit, stand or lie down; keep eyes open if that feels safer. The 4–2–6 count is an option, never a requirement: skip the hold or breathe naturally. Sound and emotional evocation are optional.";

const SHARED_SAFETY =
  "Stop or return to ordinary breathing if you feel dizzy, air-hungry, numb, panicky or unwell. This practice does not replace medical or mental-health care. It does not guarantee healing, another person's response, or any external outcome.";

const templates = [
  {
    id: "session-morning-setting",
    slug: "morning-setting",
    methodologyId: "quantum-prayer-v1",
    variant: "morning-setting",
    title: "Morning Coherence",
    summary:
      "Set the quality of your participation in the day before plans and notifications take over.",
    categoryIds: [
      "morning-orientation",
      "purpose-and-calling",
      "gratitude-and-provision",
    ],
    opening:
      "Before the day asks anything of you, arrive in the life already here.",
    stages: [
      {
        id: "regulate",
        title: "Regulate",
        seconds: 60,
        instruction:
          "Breathe in gently for four, pause for two, and breathe out for six. Keep the breath easy. If the pause is uncomfortable, omit it; ordinary breathing is fully welcome.",
        prompt: "Let the long exhale make a little more room.",
      },
      {
        id: "embody",
        title: "Embody",
        seconds: 30,
        instruction:
          "Feel your feet or the support beneath you. Let your shoulders lower and your jaw soften. Notice that this day begins in a body, here.",
        prompt: "Supported. Present. Not yet hurried.",
      },
      {
        id: "evoke",
        title: "Evoke",
        seconds: 30,
        instruction:
          "Invite one honest quality for today — perhaps steadiness, courage, patience or care. A faint trace is enough. If nothing comes, simply name the quality.",
        prompt: "What quality would help you meet this day well?",
        skippable: true,
      },
      {
        id: "articulate",
        title: "Articulate",
        seconds: 30,
        instruction:
          "Say slowly: Creator, let me meet this day with a clear mind, a grounded body and a generous heart. Show me the next faithful step.",
        prompt: "Repeat the prayer three times, leaving a breath between each.",
        repetitions: 3,
      },
      {
        id: "release",
        title: "Release",
        seconds: 30,
        instruction:
          "Give thanks for this beginning. Release the demand to control the whole day. Keep the quality you named and choose one small action that can embody it.",
        prompt: "Grateful for the beginning; open about the outcome.",
      },
    ],
    closing:
      "Go gently. Coherence is not perfection; it is returning to what matters.",
    audioTrackIds: ["NATURE-015", "CHANT-016"],
    soundPurpose:
      "A dawn soundscape can support orientation; sacred chant can deepen meaning when it belongs in your tradition. Silence remains the default equal option.",
    soundSetup:
      "Start optional sound before the timer. Keep it at the lowest comfortable level and pause vocal music before the spoken intention if the words compete.",
    sourceIds: SHARED_SOURCES,
    accessibilityNotes: SHARED_ACCESSIBILITY,
    safetyNotes: SHARED_SAFETY,
    editorialStatus: "draft",
  },
  {
    id: "session-midday-recenter",
    slug: "midday-recenter",
    methodologyId: "quantum-prayer-v1",
    variant: "midday-recenter",
    title: "Midday Recenter",
    summary:
      "Interrupt accumulated urgency and return to a clear, humane way of meeting the next part of the day.",
    categoryIds: [
      "grounding-and-stillness",
      "clarity-and-discernment",
      "anxiety-and-overwhelm",
    ],
    opening:
      "The day can be in motion while you become still for three minutes.",
    stages: [
      {
        id: "regulate",
        title: "Regulate",
        seconds: 60,
        instruction:
          "Let the exhale be a little longer than the inhale. Use four in, two pause, six out only if it feels comfortable; otherwise breathe naturally and follow the out-breath.",
        prompt: "Nothing to solve during this minute.",
      },
      {
        id: "embody",
        title: "Embody",
        seconds: 30,
        instruction:
          "Feel the chair, floor or wall supporting you. Unclench hands and jaw. Name three neutral sensations without interpreting them.",
        prompt: "What is actually present in the body?",
      },
      {
        id: "evoke",
        title: "Evoke",
        seconds: 30,
        instruction:
          "Recall one moment of enoughness, steadiness or kind attention. Do not manufacture calm; let even one percent of the quality be sufficient.",
        prompt: "A trace is enough, and this step may be skipped.",
        skippable: true,
      },
      {
        id: "articulate",
        title: "Articulate",
        seconds: 30,
        instruction:
          "Say slowly: May I meet the next hour without abandoning myself. Let what matters become clear, and let the next step be enough.",
        prompt: "Repeat the prayer three times, hearing each word.",
        repetitions: 3,
      },
      {
        id: "release",
        title: "Release",
        seconds: 30,
        instruction:
          "Release the fantasy of finishing everything at once. Give thanks for one thing holding you now, then choose the single next action that deserves your attention.",
        prompt: "One next action; no promise about the result.",
      },
    ],
    closing: "Return to the day at a human pace.",
    audioTrackIds: ["AMBIENT-006", "NATURE-017"],
    soundPurpose:
      "Predictable instrumental or nature sound may soften distraction for some people. For language-heavy work or sensory sensitivity, silence may work better.",
    soundSetup:
      "Listen quietly through speakers if possible. Stop the track if it competes with the prayer or increases agitation.",
    sourceIds: SHARED_SOURCES,
    accessibilityNotes: SHARED_ACCESSIBILITY,
    safetyNotes: SHARED_SAFETY,
    editorialStatus: "draft",
  },
  {
    id: "session-evening-integration",
    slug: "evening-integration",
    methodologyId: "quantum-prayer-v1",
    variant: "evening-integration",
    title: "Evening Integration",
    summary:
      "Notice what the day carried, receive what was good, and lay down what does not need to cross into the night.",
    categoryIds: [
      "cleansing-and-release",
      "gratitude-and-provision",
      "sleep-and-rest",
    ],
    opening:
      "This day does not need to be rewritten before it can be released.",
    stages: [
      {
        id: "regulate",
        title: "Regulate",
        seconds: 60,
        instruction:
          "Breathe gently, allowing the out-breath to lengthen without strain. Try four in, two pause, six out, or let the breath choose its own unhurried rhythm.",
        prompt: "Let the pace of the day leave the breath.",
      },
      {
        id: "embody",
        title: "Embody",
        seconds: 30,
        instruction:
          "Notice where the day still lives in the body. Soften what can soften. Let what cannot soften be met without argument.",
        prompt: "No fixing — only honest contact.",
      },
      {
        id: "evoke",
        title: "Evoke",
        seconds: 30,
        instruction:
          "Bring to mind one ordinary moment of care, beauty or enoughness from today. If gratitude is unavailable, choose simple acknowledgment instead.",
        prompt: "What can be received without denying what hurt?",
        skippable: true,
      },
      {
        id: "articulate",
        title: "Articulate",
        seconds: 30,
        instruction:
          "Say slowly: I receive what was life-giving today. I release what is unfinished. Grant me rest, perspective and mercy for tomorrow.",
        prompt: "Repeat the prayer three times, more softly each time.",
        repetitions: 3,
      },
      {
        id: "release",
        title: "Release",
        seconds: 30,
        instruction:
          "Place the unfinished day beyond your grip. Give thanks for having reached this hour. Nothing more must be achieved inside this practice.",
        prompt: "The day is complete enough to lay down.",
      },
    ],
    closing: "Rest is not a reward for perfect completion. Let it come as a gift.",
    audioTrackIds: ["NATURE-014", "SINGING-007"],
    soundPurpose:
      "A steady rainforest soundscape or sparse bowl recording may mark the transition out of activity. Evidence supports relaxation as a possible response, not guaranteed sleep.",
    soundSetup:
      "Use speakers at the lowest comfortable level. The in-page player is unloaded when the three-minute session ends. For listening outside the session, set a timer in YouTube or on your device; this app does not control external playback. Do not sleep in earbuds.",
    sourceIds: SHARED_SOURCES,
    accessibilityNotes: SHARED_ACCESSIBILITY,
    safetyNotes: SHARED_SAFETY,
    editorialStatus: "draft",
  },
  {
    id: "session-challenge-reset",
    slug: "challenge-reset",
    methodologyId: "quantum-prayer-v1",
    variant: "challenge-reset",
    title: "Challenge Reset",
    summary:
      "Create a small pause inside difficulty, then ask for the quality and action the moment genuinely needs.",
    categoryIds: [
      "courage-and-resilience",
      "protection-and-boundaries",
      "change-and-transition",
    ],
    opening:
      "Difficulty is here. You do not have to deny it in order to meet it with steadiness.",
    stages: [
      {
        id: "regulate",
        title: "Regulate",
        seconds: 60,
        instruction:
          "Keep your eyes open if that feels safer. Follow a gentle four-in, two-pause, six-out rhythm only while it remains easy. Otherwise breathe normally and look around the room.",
        prompt: "Orient first; decide second.",
      },
      {
        id: "embody",
        title: "Embody",
        seconds: 30,
        instruction:
          "Press your feet into the floor or feel the support beneath you. Name where you are and one thing you can see. Let your boundary become physical and present.",
        prompt: "Here, now, supported by something real.",
      },
      {
        id: "evoke",
        title: "Evoke",
        seconds: 30,
        instruction:
          "Invite the smallest believable amount of courage, protection or clarity. You need not feel fearless, grateful or positive.",
        prompt: "Which quality would help without erasing the truth?",
        skippable: true,
      },
      {
        id: "articulate",
        title: "Articulate",
        seconds: 30,
        instruction:
          "Say slowly: Keep me grounded in truth. Give me courage for what is mine to do, a clear boundary around what is not, and wisdom to seek help when I need it.",
        prompt: "Repeat the prayer three times without demanding certainty.",
        repetitions: 3,
      },
      {
        id: "release",
        title: "Release",
        seconds: 30,
        instruction:
          "Release what is not yours to control. Give thanks for one available support, then identify one safe action: pause, speak, leave, ask, document or wait.",
        prompt: "Prayer can accompany practical help; it does not replace it.",
      },
    ],
    closing: "Take the safest honest next step. You are allowed to ask for help.",
    audioTrackIds: ["NATURE-017", "AMBIENT-006"],
    soundPurpose:
      "Sound is secondary during acute stress. A quiet, predictable nature or instrumental bed may help some people; others will regulate better without it.",
    soundSetup:
      "Keep sound off if you need to assess danger, communicate, drive or act. Never use this practice while driving.",
    sourceIds: SHARED_SOURCES,
    accessibilityNotes: SHARED_ACCESSIBILITY,
    safetyNotes:
      `${SHARED_SAFETY} If you may be in danger, prioritise leaving, contacting a trusted person or emergency support over completing the timer.`,
    editorialStatus: "draft",
  },
  {
    id: "session-before-sleep",
    slug: "before-sleep",
    methodologyId: "quantum-prayer-v1",
    variant: "before-sleep",
    title: "Before Sleep",
    summary:
      "Let the body know that striving is finished for now and entrust the night without turning sleep into another task.",
    categoryIds: ["sleep-and-rest", "grounding-and-stillness"],
    opening:
      "Sleep cannot be commanded. This is only an invitation to stop working at the day.",
    stages: [
      {
        id: "regulate",
        title: "Regulate",
        seconds: 60,
        instruction:
          "Let breathing become quiet and easy. If it is comfortable, breathe in for four, pause for two, and out for six. If counting keeps you alert, drop the count completely.",
        prompt: "Ease matters more than the pattern.",
      },
      {
        id: "embody",
        title: "Embody",
        seconds: 30,
        instruction:
          "Feel the weight of your head, back, hands and legs being carried. Unclench the tongue and let the bed do the holding.",
        prompt: "Nothing to hold up for these thirty seconds.",
      },
      {
        id: "evoke",
        title: "Evoke",
        seconds: 30,
        instruction:
          "Invite a memory of safety or quiet — real or imagined — without forcing it. If that is difficult, notice one neutral point of contact instead.",
        prompt: "A neutral sensation is enough; this step may be skipped.",
        skippable: true,
      },
      {
        id: "articulate",
        title: "Articulate",
        seconds: 30,
        instruction:
          "Say slowly: I release this day and all I could not finish. Hold what I cannot solve tonight. Let rest come in its own time.",
        prompt: "Repeat the prayer three times, then let words end.",
        repetitions: 3,
      },
      {
        id: "release",
        title: "Release",
        seconds: 30,
        instruction:
          "Give thanks for the support beneath you. Release the effort to make sleep happen. Resting wakefully still counts as rest.",
        prompt: "No performance, no guarantee, nothing more to do.",
      },
    ],
    closing:
      "The practice is complete. Put the screen away and let the night be quiet.",
    audioTrackIds: ["NATURE-011", "NATURE-014"],
    soundPurpose:
      "Ocean or rainforest sound can mask an inconsistent environment for some listeners. Continuous-noise sleep evidence is limited, so use it for comfort rather than treatment.",
    soundSetup:
      "Use speakers at the lowest comfortable level. The in-page player is unloaded when the three-minute session ends. For listening outside the session, set a timer in YouTube or on your device; this app does not control external playback. Avoid overnight earbuds. Silence is always a complete choice.",
    sourceIds: SHARED_SOURCES,
    accessibilityNotes: SHARED_ACCESSIBILITY,
    safetyNotes: SHARED_SAFETY,
    editorialStatus: "draft",
  },
];

export const sessionTemplates: readonly SessionTemplate[] = templates.map(
  (template) => SessionTemplateSchema.parse(template),
);

export const sessionBySlug = new Map(
  sessionTemplates.map((session) => [session.slug, session]),
);

export const sessionByVariant = new Map<SessionVariant, SessionTemplate>(
  sessionTemplates.map((session) => [session.variant, session]),
);

const SESSION_VARIANT_BY_CATEGORY_ID: Readonly<
  Record<string, SessionVariant>
> = {
  "morning-orientation": "morning-setting",
  "purpose-and-calling": "morning-setting",
  "creativity": "morning-setting",
  "gratitude-and-provision": "morning-setting",
  "celebration-and-thanksgiving": "morning-setting",
  "cleansing-and-release": "evening-integration",
  "root-work-and-restoration": "evening-integration",
  "healing-and-renewal": "evening-integration",
  "grief-and-lament": "evening-integration",
  forgiveness: "evening-integration",
  "shadow-reflection": "evening-integration",
  "ancestral-remembrance": "evening-integration",
  "protection-and-boundaries": "challenge-reset",
  "courage-and-resilience": "challenge-reset",
  "change-and-transition": "challenge-reset",
  "justice-and-ethical-action": "challenge-reset",
  "confidence-and-self-worth": "challenge-reset",
  "sleep-and-rest": "before-sleep",
};

/**
 * Resolve deliberately rather than relying on array order. Some categories
 * belong to more than one template; sleep must always reach Before Sleep.
 */
export function getCoherenceSessionForCategory(
  categoryId: string,
): SessionTemplate {
  const variant =
    SESSION_VARIANT_BY_CATEGORY_ID[categoryId] ?? "midday-recenter";
  const session = sessionByVariant.get(variant);
  if (!session) {
    throw new Error(`Missing coherence session for variant "${variant}".`);
  }
  return session;
}
