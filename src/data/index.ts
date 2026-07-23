/**
 * LumenNous content library — barrel export and integrity validator.
 *
 * Every module validates its own records against the Zod schemas at import
 * time (fail fast on malformed editorial data). `validateContent()` goes
 * further: it re-parses the whole library and enforces CROSS-RECORD rules —
 * referential integrity, per-category minimums, unique ids/slugs, frequency
 * evidence labels, teaching length, and the all-draft seed policy.
 *
 * Call it at app boot (and in tests); it throws with a complete error list
 * rather than failing on the first problem.
 */

import {
  AffirmationSchema,
  AudioItemSchema,
  CategorySchema,
  PlaylistSchema,
  PracticeSchema,
  PrayerSchema,
  QuantumPrayerMethodSchema,
  ReflectionPromptSchema,
  SessionTemplateSchema,
  SourceSchema,
  TeachingSchema,
  type Affirmation,
  type AudioItem,
  type Category,
  type Playlist,
  type Practice,
  type Prayer,
  type QuantumPrayerMethod,
  type ReflectionPrompt,
  type SessionTemplate,
  type Source,
  type Teaching,
} from "../lib/schemas";

import { categories } from "./categories";
import { prayers } from "./prayers";
import { affirmations } from "./affirmations";
import { practices } from "./practices";
import { reflectionPrompts } from "./prompts";
import { sources } from "./sources";
import { audioItems } from "./audio";
import { playlists } from "./playlists";
import { teachings } from "./teachings";
import { quantumPrayerMethod } from "./quantum-prayer-method";
import { sessionTemplates } from "./session-templates";

export { categories } from "./categories";
export { prayers, prayerById } from "./prayers";
export { affirmations, affirmationById } from "./affirmations";
export { practices, practiceById, practiceBySlug } from "./practices";
export { reflectionPrompts, reflectionPromptById } from "./prompts";
export { sources, sourceById } from "./sources";
export { audioItems, audioItemById } from "./audio";
export { playlists, playlistById, playlistBySlug } from "./playlists";
export { teachings, teachingById, teachingBySlug } from "./teachings";
export { categoryById, categoryBySlug } from "./categories";
export {
  quantumPrayerMethod,
  QUANTUM_PRAYER_CORE_SECONDS,
} from "./quantum-prayer-method";
export {
  sessionTemplates,
  sessionBySlug,
  sessionByVariant,
} from "./session-templates";

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export interface ContentValidationReport {
  ok: boolean;
  errors: string[];
  counts: {
    categories: number;
    prayers: number;
    affirmations: number;
    practices: number;
    reflectionPrompts: number;
    sources: number;
    audioItems: number;
    playlists: number;
    teachings: number;
    sessions: number;
  };
}

const MIN_PER_CATEGORY = {
  prayers: 3,
  affirmations: 4,
  practices: 2,
  reflectionPrompts: 4,
} as const;

/** Items whose titles/genres indicate frequency-based audio. */
const FREQUENCY_PATTERN = /(hz\b|solfeggio|binaural|chakra)/i;
const FREQUENCY_ALLOWED_LABELS = new Set([
  "experiential-claim",
  "no-established-clinical-evidence",
]);

function wordCount(markdown: string): number {
  return markdown
    .replace(/[#*_`>\-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

function checkUnique(
  errors: string[],
  label: string,
  ids: string[],
): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      errors.push(`${label}: duplicate id "${id}"`);
    }
    seen.add(id);
  }
}

function checkRefs(
  errors: string[],
  ownerLabel: string,
  ownerId: string,
  field: string,
  refs: string[],
  known: Set<string>,
): void {
  for (const ref of refs) {
    if (!known.has(ref)) {
      errors.push(`${ownerLabel} "${ownerId}": unknown ${field} reference "${ref}"`);
    }
  }
}

/**
 * Re-parse the entire library and enforce cross-record editorial rules.
 * Throws an Error listing every problem found; returns a report on success.
 */
export function validateContent(): ContentValidationReport {
  const errors: string[] = [];

  // 1. Schema re-parse of every record (schemas also run at module load).
  const parsedCategories = CategorySchema.array().parse(categories) as Category[];
  const parsedPrayers = PrayerSchema.array().parse(prayers) as Prayer[];
  const parsedAffirmations = AffirmationSchema.array().parse(affirmations) as Affirmation[];
  const parsedPractices = PracticeSchema.array().parse(practices) as Practice[];
  const parsedPrompts = ReflectionPromptSchema.array().parse(reflectionPrompts) as ReflectionPrompt[];
  const parsedSources = SourceSchema.array().parse(sources) as Source[];
  const parsedAudio = AudioItemSchema.array().parse(audioItems) as AudioItem[];
  const parsedPlaylists = PlaylistSchema.array().parse(playlists) as Playlist[];
  const parsedTeachings = TeachingSchema.array().parse(teachings) as Teaching[];
  const parsedMethod = QuantumPrayerMethodSchema.parse(
    quantumPrayerMethod,
  ) as QuantumPrayerMethod;
  const parsedSessions = SessionTemplateSchema.array().parse(
    sessionTemplates,
  ) as SessionTemplate[];

  const categoryIds = new Set(parsedCategories.map((c) => c.id));
  const prayerIds = new Set(parsedPrayers.map((p) => p.id));
  const promptIds = new Set(parsedPrompts.map((p) => p.id));
  const sourceIds = new Set(parsedSources.map((s) => s.id));
  const audioIds = new Set(parsedAudio.map((a) => a.id));
  const practiceSlugs = parsedPractices.map((p) => p.slug);
  const playlistSlugs = parsedPlaylists.map((p) => p.slug);
  const teachingSlugs = parsedTeachings.map((t) => t.slug);
  const sessionSlugs = parsedSessions.map((session) => session.slug);

  // 2. Unique ids and slugs.
  checkUnique(errors, "categories", parsedCategories.map((c) => c.id));
  checkUnique(errors, "category slugs", parsedCategories.map((c) => c.slug));
  checkUnique(errors, "prayers", [...prayerIds]);
  checkUnique(errors, "affirmations", parsedAffirmations.map((a) => a.id));
  checkUnique(errors, "practices", parsedPractices.map((p) => p.id));
  checkUnique(errors, "practice slugs", practiceSlugs);
  checkUnique(errors, "reflection prompts", parsedPrompts.map((p) => p.id));
  checkUnique(errors, "sources", parsedSources.map((s) => s.id));
  checkUnique(errors, "audio items", parsedAudio.map((a) => a.id));
  checkUnique(errors, "playlists", parsedPlaylists.map((p) => p.id));
  checkUnique(errors, "playlist slugs", playlistSlugs);
  checkUnique(errors, "teachings", parsedTeachings.map((t) => t.id));
  checkUnique(errors, "teaching slugs", teachingSlugs);
  checkUnique(errors, "sessions", parsedSessions.map((session) => session.id));
  checkUnique(errors, "session slugs", sessionSlugs);

  // 3. Referential integrity.
  for (const category of parsedCategories) {
    checkRefs(errors, "category", category.id, "relatedCategoryIds", category.relatedCategoryIds, categoryIds);
  }
  for (const prayer of parsedPrayers) {
    checkRefs(errors, "prayer", prayer.id, "categoryIds", prayer.categoryIds, categoryIds);
    checkRefs(errors, "prayer", prayer.id, "sourceIds", prayer.sourceIds, sourceIds);
    checkRefs(errors, "prayer", prayer.id, "audioIds", prayer.audioIds, audioIds);
    checkRefs(errors, "prayer", prayer.id, "reflectionPromptIds", prayer.reflectionPromptIds, promptIds);
  }
  for (const affirmation of parsedAffirmations) {
    checkRefs(errors, "affirmation", affirmation.id, "categoryIds", affirmation.categoryIds, categoryIds);
    checkRefs(errors, "affirmation", affirmation.id, "sourceIds", affirmation.sourceIds, sourceIds);
  }
  for (const practice of parsedPractices) {
    checkRefs(errors, "practice", practice.id, "categoryIds", practice.categoryIds, categoryIds);
    checkRefs(errors, "practice", practice.id, "sourceIds", practice.sourceIds, sourceIds);
    checkRefs(errors, "practice", practice.id, "audioIds", practice.audioIds, audioIds);
  }
  for (const prompt of parsedPrompts) {
    checkRefs(errors, "reflection prompt", prompt.id, "categoryIds", prompt.categoryIds, categoryIds);
  }
  for (const playlist of parsedPlaylists) {
    checkRefs(errors, "playlist", playlist.id, "itemIds", playlist.itemIds, audioIds);
  }
  for (const teaching of parsedTeachings) {
    checkRefs(errors, "teaching", teaching.id, "relatedCategoryIds", teaching.relatedCategoryIds, categoryIds);
    checkRefs(errors, "teaching", teaching.id, "sourceIds", teaching.sourceIds, sourceIds);
  }
  checkRefs(
    errors,
    "quantum prayer method",
    parsedMethod.id,
    "sourceIds",
    parsedMethod.sourceIds,
    sourceIds,
  );
  for (const session of parsedSessions) {
    checkRefs(
      errors,
      "session",
      session.id,
      "categoryIds",
      session.categoryIds,
      categoryIds,
    );
    checkRefs(
      errors,
      "session",
      session.id,
      "sourceIds",
      session.sourceIds,
      sourceIds,
    );
  }

  // 4. Per-category minimums (seed library standard).
  for (const category of parsedCategories) {
    if (!category.isActive) continue;
    const count = {
      prayers: parsedPrayers.filter((p) => p.categoryIds.includes(category.id)).length,
      affirmations: parsedAffirmations.filter((a) => a.categoryIds.includes(category.id)).length,
      practices: parsedPractices.filter((p) => p.categoryIds.includes(category.id)).length,
      reflectionPrompts: parsedPrompts.filter((p) => p.categoryIds.includes(category.id)).length,
    };
    for (const [kind, minimum] of Object.entries(MIN_PER_CATEGORY)) {
      const actual = count[kind as keyof typeof count];
      if (actual < minimum) {
        errors.push(
          `category "${category.id}": only ${actual} ${kind} (minimum ${minimum})`,
        );
      }
    }
  }

  // 5. Frequency-based audio MUST carry an evidence label (brief rule).
  for (const item of parsedAudio) {
    if (FREQUENCY_PATTERN.test(`${item.title} ${item.genre}`)) {
      if (!FREQUENCY_ALLOWED_LABELS.has(item.evidenceClassification)) {
        errors.push(
          `audio "${item.id}": frequency-based content must be labelled experiential-claim or no-established-clinical-evidence (got "${item.evidenceClassification}")`,
        );
      }
    }
  }

  // 6. Teaching length (250–450 words) and all-draft seed policy.
  for (const teaching of parsedTeachings) {
    const words = wordCount(teaching.body);
    if (words < 250 || words > 450) {
      errors.push(`teaching "${teaching.id}": body is ${words} words (expected 250–450)`);
    }
  }

  const allRecords = [
    ...parsedPrayers.map((r) => ({ kind: "prayer", id: r.id, status: r.editorialStatus })),
    ...parsedAffirmations.map((r) => ({ kind: "affirmation", id: r.id, status: r.editorialStatus })),
    ...parsedPractices.map((r) => ({ kind: "practice", id: r.id, status: r.editorialStatus })),
    ...parsedPrompts.map((r) => ({ kind: "reflection prompt", id: r.id, status: r.editorialStatus })),
    ...parsedPlaylists.map((r) => ({ kind: "playlist", id: r.id, status: r.editorialStatus })),
    ...parsedTeachings.map((r) => ({ kind: "teaching", id: r.id, status: r.editorialStatus })),
    ...parsedSessions.map((r) => ({ kind: "session", id: r.id, status: r.editorialStatus })),
  ];
  for (const record of allRecords) {
    if (record.status !== "draft") {
      errors.push(
        `${record.kind} "${record.id}": seed content must be editorialStatus "draft" pending review (got "${record.status}")`,
      );
    }
  }

  const report: ContentValidationReport = {
    ok: errors.length === 0,
    errors,
    counts: {
      categories: parsedCategories.length,
      prayers: parsedPrayers.length,
      affirmations: parsedAffirmations.length,
      practices: parsedPractices.length,
      reflectionPrompts: parsedPrompts.length,
      sources: parsedSources.length,
      audioItems: parsedAudio.length,
      playlists: parsedPlaylists.length,
      teachings: parsedTeachings.length,
      sessions: parsedSessions.length,
    },
  };

  if (!report.ok) {
    throw new Error(
      `LumenNous content validation failed with ${errors.length} problem(s):\n - ${errors.join("\n - ")}`,
    );
  }
  return report;
}
