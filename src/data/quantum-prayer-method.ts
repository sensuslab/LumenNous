import {
  QuantumPrayerMethodSchema,
  type QuantumPrayerMethod,
} from "@/lib/schemas";

/**
 * A faithful, safety-refined implementation of the five-stage protocol in
 * “Quantum Prayers: Coherence, Consciousness & The Art of Aligned Prayer”.
 *
 * “Quantum” is retained as the source methodology's name. The app presents
 * the method's practical contemplative actions without claiming that thought
 * controls quantum events or guarantees external outcomes.
 */
export const quantumPrayerMethod: QuantumPrayerMethod =
  QuantumPrayerMethodSchema.parse({
    id: "quantum-prayer-v1",
    version: "1.0",
    title: "Embodied Coherence Prayer",
    summary:
      "A three-minute sequence that regulates the breath, grounds attention in the body, gently evokes a believable inner quality, speaks one clear intention three times, and releases control of the outcome.",
    stages: [
      {
        id: "regulate",
        title: "Regulate",
        seconds: 60,
        purpose:
          "Lengthen the out-breath to support a steadier, more receptive state before speaking.",
        breathPattern: {
          inhaleCounts: 4,
          holdCounts: 2,
          exhaleCounts: 6,
        },
        optional: false,
      },
      {
        id: "embody",
        title: "Embody",
        seconds: 30,
        purpose:
          "Notice contact, posture, jaw and shoulders so prayer begins from the present body rather than abstraction alone.",
        optional: false,
      },
      {
        id: "evoke",
        title: "Evoke",
        seconds: 30,
        purpose:
          "Invite a small, believable trace of the quality being prayed for without forcing positivity or denying what is difficult.",
        optional: true,
      },
      {
        id: "articulate",
        title: "Articulate",
        seconds: 30,
        purpose:
          "Speak one concise prayer or intention slowly enough to hear and inhabit its meaning.",
        repetitions: 3,
        optional: false,
      },
      {
        id: "release",
        title: "Release",
        seconds: 30,
        purpose:
          "End with gratitude and non-gripping: remain open to wise action while surrendering control of timing and outcome.",
        optional: false,
      },
    ],
    intendedOutcomes: [
      "a calmer starting state",
      "greater body awareness",
      "a clear and personally honest intention",
      "less grasping at a guaranteed result",
      "readiness for one grounded next action",
    ],
    evidenceBoundary:
      "Slow breathing and music-supported relaxation can influence attention and arousal, but the source document's claims about observers collapsing reality, entanglement carrying prayer, or intention changing probability fields are not established scientific mechanisms. In LumenNous, quantum language is contemplative metaphor. This is a spiritual practice, not treatment, prediction, or a promise that an external event will occur.",
    sourceIds: [
      "src-quantum-prayers-coherence",
      "src-slow-breathing-systematic-review",
    ],
  });

export const QUANTUM_PRAYER_CORE_SECONDS = quantumPrayerMethod.stages.reduce(
  (total, stage) => total + stage.seconds,
  0,
);
