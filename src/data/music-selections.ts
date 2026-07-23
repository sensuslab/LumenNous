import {
  isConservativePublicMusicItem,
  musicRegisterById,
  type MusicRegisterItem,
} from "@/data/music-register";

/**
 * Human-reviewed public allowlist. The complete imported register remains an
 * audit source; only these IDs may reach consumer listening surfaces.
 */
export const publicMusicRegisterIds = [
  "NATURE-017",
  "AMBIENT-006",
  "AMBIENT-001",
  "SINGING-007",
  "NATURE-011",
  "NATURE-014",
  "NATURE-015",
  "CHANT-016",
] as const;

export type PublicMusicRegisterId = (typeof publicMusicRegisterIds)[number];

function resolvePublicMusicRegister(): readonly MusicRegisterItem[] {
  if (new Set(publicMusicRegisterIds).size !== publicMusicRegisterIds.length) {
    throw new Error("The public music allowlist contains a duplicate id.");
  }

  return Object.freeze(
    publicMusicRegisterIds.map((id) => {
      const item = musicRegisterById.get(id);
      if (!item) throw new Error(`Public music selection "${id}" is missing from the register.`);
      if (!isConservativePublicMusicItem(item)) {
        throw new Error(`Public music selection "${id}" does not meet the conservative release policy.`);
      }
      return item;
    }),
  );
}

export const publicMusicRegister = resolvePublicMusicRegister();

export const sessionMusicVariantIds = [
  "morning-setting",
  "midday-recenter",
  "evening-integration",
  "challenge-reset",
  "before-sleep",
] as const;

export type SessionMusicVariant = (typeof sessionMusicVariantIds)[number];

export interface SessionMusicSelection {
  registerIds: readonly PublicMusicRegisterId[];
  rationale: string;
  setup: string;
}

export const sessionMusicSelections = {
  "morning-setting": {
    registerIds: ["NATURE-015", "CHANT-016"],
    rationale:
      "A documented dawn chorus offers a light sensory anchor; the official Taizé recording is an optional devotional alternative.",
    setup:
      "Choose one track before beginning. Keep it quiet enough that spoken or silent prayer remains primary.",
  },
  "midday-recenter": {
    registerIds: ["NATURE-017", "AMBIENT-006"],
    rationale:
      "A named field recording or sparse instrumental texture can mark a short pause without adding frequency-based claims.",
    setup:
      "Start one selection after checking the volume, then return attention to the practice whenever the sound becomes distracting.",
  },
  "evening-integration": {
    registerIds: ["NATURE-014", "SINGING-007"],
    rationale:
      "Rainforest ambience and a short bowl-based meditation timer provide two quiet, non-verbal options for an unhurried close.",
    setup:
      "Choose one option at a comfortable level. Let the sound recede behind the review and closing prayer.",
  },
  "challenge-reset": {
    registerIds: ["NATURE-017", "AMBIENT-006"],
    rationale:
      "A named field recording or sparse instrumental texture can provide a concrete listening anchor during a pressured moment.",
    setup:
      "Pick the less stimulating option. Stop the audio and continue in silence if it increases tension or sensory load.",
  },
  "before-sleep": {
    registerIds: ["NATURE-011", "NATURE-014"],
    rationale:
      "Continuous ocean or rainforest recordings avoid spoken guidance and advertised frequency mechanisms.",
    setup:
      "Set a comfortable low volume. The in-page player stops with the three-minute session; for separate listening, use YouTube's or the device's own timer. Audio is optional and is not presented as treatment for insomnia.",
  },
} as const satisfies Record<SessionMusicVariant, SessionMusicSelection>;

const publicIds = new Set<string>(publicMusicRegisterIds);
const actualVariantIds = Object.keys(sessionMusicSelections).sort();
const expectedVariantIds = [...sessionMusicVariantIds].sort();
if (actualVariantIds.join("|") !== expectedVariantIds.join("|")) {
  throw new Error("Session music selections must define exactly the five supported variants.");
}

for (const variant of sessionMusicVariantIds) {
  const selection = sessionMusicSelections[variant];
  if (selection.registerIds.length < 1 || selection.registerIds.length > 2) {
    throw new Error(`${variant} must contain one or two public music selections.`);
  }
  if (new Set(selection.registerIds).size !== selection.registerIds.length) {
    throw new Error(`${variant} contains a duplicate music selection.`);
  }
  for (const id of selection.registerIds) {
    if (!publicIds.has(id)) {
      throw new Error(`${variant} references non-public music selection "${id}".`);
    }
  }
}
