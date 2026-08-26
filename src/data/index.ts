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
  ConceptEngineFrameSchema,
  ContemplativePathwaySchema,
  ContemplativeConceptSchema,
  EditorialReviewSchema,
  PassageAnchorSchema,
  PlaylistSchema,
  PracticeSchema,
  PrayerSchema,
  QuantumPrayerMethodSchema,
  ReflectionPromptSchema,
  SessionTemplateSchema,
  SourceEditionSchema,
  SourceReviewPolicySchema,
  SourceSchema,
  TeachingSchema,
  type Affirmation,
  type AudioItem,
  type Category,
  type ConceptEngineFrame,
  type ContemplativePathway,
  type ContemplativeConcept,
  type EditorialReview,
  type PassageAnchor,
  type Playlist,
  type Practice,
  type Prayer,
  type QuantumPrayerMethod,
  type ReflectionPrompt,
  type SessionTemplate,
  type Source,
  type SourceEdition,
  type SourceReviewPolicy,
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
import { contemplativePathways } from "./pathways";
import { conceptEngineFrames } from "./concept-engine-frames";
import {
  contemplativeConcepts,
  editorialReviews,
  passageAnchors,
  sourceReviewPolicies,
  sourceEditions,
} from "./source-foundation";

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
export {
  contemplativeConcepts,
  contemplativeConceptById,
  contemplativeConceptBySlug,
  editorialReviews,
  passageAnchors,
  passageAnchorById,
  sourceEditions,
  sourceEditionById,
  sourceReviewPolicies,
  sourceReviewPolicyById,
} from "./source-foundation";
export {
  contemplativePathways,
  contemplativePathwayById,
  contemplativePathwayBySlug,
} from "./pathways";
export {
  conceptEngineFrames,
  conceptEngineFrameByConceptId,
} from "./concept-engine-frames";

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
    sourceEditions: number;
    sourceReviewPolicies: number;
    passageAnchors: number;
    contemplativeConcepts: number;
    editorialReviews: number;
    contemplativePathways: number;
    conceptEngineFrames: number;
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
  const parsedEditions = SourceEditionSchema.array().parse(
    sourceEditions,
  ) as SourceEdition[];
  const parsedSourceReviewPolicies = SourceReviewPolicySchema.array().parse(
    sourceReviewPolicies,
  ) as SourceReviewPolicy[];
  const parsedAnchors = PassageAnchorSchema.array().parse(
    passageAnchors,
  ) as PassageAnchor[];
  const parsedConcepts = ContemplativeConceptSchema.array().parse(
    contemplativeConcepts,
  ) as ContemplativeConcept[];
  const parsedReviews = EditorialReviewSchema.array().parse(
    editorialReviews,
  ) as EditorialReview[];
  const parsedPathways = ContemplativePathwaySchema.array().parse(
    contemplativePathways,
  ) as ContemplativePathway[];
  const parsedConceptFrames = ConceptEngineFrameSchema.array().parse(
    conceptEngineFrames,
  ) as ConceptEngineFrame[];

  const categoryIds = new Set(parsedCategories.map((c) => c.id));
  const prayerIds = new Set(parsedPrayers.map((p) => p.id));
  const promptIds = new Set(parsedPrompts.map((p) => p.id));
  const sourceIds = new Set(parsedSources.map((s) => s.id));
  const sourceEditionIds = new Set(parsedEditions.map((edition) => edition.id));
  const passageAnchorIds = new Set(parsedAnchors.map((anchor) => anchor.id));
  const conceptIds = new Set(parsedConcepts.map((concept) => concept.id));
  const audioIds = new Set(parsedAudio.map((a) => a.id));
  const practiceSlugs = parsedPractices.map((p) => p.slug);
  const playlistSlugs = parsedPlaylists.map((p) => p.slug);
  const teachingSlugs = parsedTeachings.map((t) => t.slug);
  const sessionSlugs = parsedSessions.map((session) => session.slug);
  const pathwaySlugs = parsedPathways.map((pathway) => pathway.slug);

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
  checkUnique(errors, "source editions", parsedEditions.map((edition) => edition.id));
  checkUnique(
    errors,
    "source review policies",
    parsedSourceReviewPolicies.map((policy) => policy.id),
  );
  checkUnique(errors, "passage anchors", parsedAnchors.map((anchor) => anchor.id));
  checkUnique(errors, "contemplative concepts", parsedConcepts.map((concept) => concept.id));
  checkUnique(errors, "concept slugs", parsedConcepts.map((concept) => concept.slug));
  checkUnique(errors, "editorial reviews", parsedReviews.map((review) => review.id));
  checkUnique(errors, "contemplative pathways", parsedPathways.map((pathway) => pathway.id));
  checkUnique(errors, "pathway slugs", pathwaySlugs);
  checkUnique(errors, "concept engine frames", parsedConceptFrames.map((frame) => frame.id));
  checkUnique(errors, "concept engine frame conceptIds", parsedConceptFrames.map((frame) => frame.conceptId));
  checkUnique(
    errors,
    "pathway stages",
    parsedPathways.flatMap((pathway) => pathway.stages.map((stage) => stage.id)),
  );
  checkUnique(
    errors,
    "pathway activities",
    parsedPathways.flatMap((pathway) => pathway.stages.map((stage) => stage.activity.id)),
  );

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
  for (const edition of parsedEditions) {
    checkRefs(errors, "source edition", edition.id, "sourceId", [edition.sourceId], sourceIds);
    checkRefs(
      errors,
      "source edition",
      edition.id,
      "includedSourceIds",
      edition.includedSourceIds,
      sourceIds,
    );
  }
  for (const policy of parsedSourceReviewPolicies) {
    if (policy.sourceIds.length === 0 && policy.editionIds.length === 0) {
      errors.push(
        `source review policy "${policy.id}": must scope at least one source or edition`,
      );
    }
    checkRefs(
      errors,
      "source review policy",
      policy.id,
      "sourceIds",
      policy.sourceIds,
      sourceIds,
    );
    checkRefs(
      errors,
      "source review policy",
      policy.id,
      "editionIds",
      policy.editionIds,
      sourceEditionIds,
    );
  }
  for (const anchor of parsedAnchors) {
    checkRefs(errors, "passage anchor", anchor.id, "sourceId", [anchor.sourceId], sourceIds);
    checkRefs(
      errors,
      "passage anchor",
      anchor.id,
      "editionId",
      [anchor.editionId],
      sourceEditionIds,
    );
    checkRefs(errors, "passage anchor", anchor.id, "conceptIds", anchor.conceptIds, conceptIds);
    const edition = parsedEditions.find((item) => item.id === anchor.editionId);
    if (
      edition &&
      edition.sourceId !== anchor.sourceId &&
      !edition.includedSourceIds.includes(anchor.sourceId)
    ) {
      errors.push(
        `passage anchor "${anchor.id}": sourceId does not match edition "${edition.id}"`,
      );
    }
  }
  for (const concept of parsedConcepts) {
    checkRefs(
      errors,
      "contemplative concept",
      concept.id,
      "sourceAnchorIds",
      concept.sourceAnchorIds,
      passageAnchorIds,
    );
  }
  for (const pathway of parsedPathways) {
    checkRefs(
      errors,
      "contemplative pathway",
      pathway.id,
      "conceptIds",
      pathway.conceptIds,
      conceptIds,
    );
    checkRefs(
      errors,
      "contemplative pathway",
      pathway.id,
      "sourceIds",
      pathway.sourceIds,
      sourceIds,
    );
    for (const stage of pathway.stages) {
      checkRefs(
        errors,
        "pathway stage",
        stage.id,
        "conceptIds",
        stage.conceptIds,
        conceptIds,
      );
      for (const conceptId of stage.conceptIds) {
        if (!pathway.conceptIds.includes(conceptId)) {
          errors.push(
            `pathway stage "${stage.id}": conceptId "${conceptId}" is not declared by pathway "${pathway.id}"`,
          );
        }
      }
      if (
        stage.relatedPracticeSlug &&
        !practiceSlugs.includes(stage.relatedPracticeSlug)
      ) {
        errors.push(
          `pathway stage "${stage.id}": unknown relatedPracticeSlug "${stage.relatedPracticeSlug}"`,
        );
      }
      checkRefs(
        errors,
        "pathway activity",
        stage.activity.id,
        "sourceUses.anchorId",
        stage.activity.sourceUses.map((use) => use.anchorId),
        passageAnchorIds,
      );
      for (const use of stage.activity.sourceUses) {
        const anchor = parsedAnchors.find((item) => item.id === use.anchorId);
        if (anchor && !pathway.sourceIds.includes(anchor.sourceId)) {
          errors.push(
            `contemplative pathway "${pathway.id}": activity anchor "${anchor.id}" requires sourceId "${anchor.sourceId}"`,
          );
        }
      }
    }
    const activityMinutes = pathway.stages.reduce(
      (total, stage) => total + stage.activity.minutes,
      0,
    );
    if (activityMinutes !== pathway.estimatedMinutes) {
      errors.push(
        `contemplative pathway "${pathway.id}": estimatedMinutes is ${pathway.estimatedMinutes}, but activities total ${activityMinutes}`,
      );
    }
  }
  for (const frame of parsedConceptFrames) {
    checkRefs(
      errors,
      "concept engine frame",
      frame.id,
      "conceptId",
      [frame.conceptId],
      conceptIds,
    );
    checkRefs(
      errors,
      "concept engine frame",
      frame.id,
      "sourceIds",
      frame.sourceIds,
      sourceIds,
    );
    checkRefs(
      errors,
      "concept engine frame",
      frame.id,
      "sourceUses.anchorId",
      frame.sourceUses.map((use) => use.anchorId),
      passageAnchorIds,
    );
    for (const use of frame.sourceUses) {
      const anchor = parsedAnchors.find((item) => item.id === use.anchorId);
      if (anchor && !frame.sourceIds.includes(anchor.sourceId)) {
        errors.push(
          `concept engine frame "${frame.id}": anchor "${anchor.id}" requires sourceId "${anchor.sourceId}"`,
        );
      }
      if (
        anchor &&
        use.relation !== "comparative-context" &&
        !anchor.conceptIds.includes(frame.conceptId)
      ) {
        errors.push(
          `concept engine frame "${frame.id}": anchor "${anchor.id}" is not mapped to conceptId "${frame.conceptId}"`,
        );
      }
    }
  }

  const sourceUses: Array<{
    kind: string;
    id: string;
    uses: Array<{ anchorId: string }>;
    sourceIds: readonly string[] | null;
  }> = [
    ...parsedPrayers.map((record) => ({ kind: "prayer", id: record.id, uses: record.sourceUses ?? [], sourceIds: record.sourceIds })),
    ...parsedAffirmations.map((record) => ({ kind: "affirmation", id: record.id, uses: record.sourceUses ?? [], sourceIds: record.sourceIds })),
    ...parsedPractices.map((record) => ({ kind: "practice", id: record.id, uses: record.sourceUses ?? [], sourceIds: record.sourceIds })),
    ...parsedPrompts.map((record) => ({ kind: "reflection prompt", id: record.id, uses: record.sourceUses ?? [], sourceIds: null })),
    ...parsedTeachings.map((record) => ({ kind: "teaching", id: record.id, uses: record.sourceUses ?? [], sourceIds: record.sourceIds })),
  ];
  for (const record of sourceUses) {
    checkRefs(
      errors,
      record.kind,
      record.id,
      "sourceUses.anchorId",
      record.uses.map((use) => use.anchorId),
      passageAnchorIds,
    );
    if (record.sourceIds) {
      for (const use of record.uses) {
        const anchor = parsedAnchors.find((item) => item.id === use.anchorId);
        if (anchor && !record.sourceIds.includes(anchor.sourceId)) {
          errors.push(
            `${record.kind} "${record.id}": sourceUses anchor "${anchor.id}" requires sourceId "${anchor.sourceId}"`,
          );
        }
      }
    }
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

  // 6. Teaching length (250–450 words) and publication-review policy.
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
    ...parsedPathways.map((r) => ({ kind: "contemplative pathway", id: r.id, status: r.editorialStatus })),
    ...parsedConceptFrames.map((r) => ({ kind: "concept engine frame", id: r.id, status: r.editorialStatus })),
  ];
  const reviewsBySubject = new Map(
    parsedReviews.map((review) => [review.subjectId, review]),
  );
  const reviewableSubjectIds = new Set([
    ...allRecords.map((record) => record.id),
    ...parsedConcepts.map((record) => record.id),
  ]);
  for (const review of parsedReviews) {
    if (!reviewableSubjectIds.has(review.subjectId)) {
      errors.push(
        `editorial review "${review.id}": unknown subjectId "${review.subjectId}"`,
      );
    }
  }
  for (const record of [
    ...allRecords,
    ...parsedConcepts.map((record) => ({
      kind: "contemplative concept",
      id: record.id,
      status: record.editorialStatus,
    })),
  ]) {
    if (record.status !== "published") continue;
    const review = reviewsBySubject.get(record.id);
    if (!review || review.status !== "published") {
      errors.push(
        `${record.kind} "${record.id}": published content requires a completed editorial review record`,
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
      sourceEditions: parsedEditions.length,
      sourceReviewPolicies: parsedSourceReviewPolicies.length,
      passageAnchors: parsedAnchors.length,
      contemplativeConcepts: parsedConcepts.length,
      editorialReviews: parsedReviews.length,
      contemplativePathways: parsedPathways.length,
      conceptEngineFrames: parsedConceptFrames.length,
    },
  };

  if (!report.ok) {
    throw new Error(
      `LumenNous content validation failed with ${errors.length} problem(s):\n - ${errors.join("\n - ")}`,
    );
  }
  return report;
}
