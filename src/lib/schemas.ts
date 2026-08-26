/**
 * LumenNous typed content schemas (Zod).
 *
 * Every content record in `src/data/` is validated against these schemas at
 * module load, so malformed editorial content fails fast at build/test time
 * rather than at runtime in the UI. Engine schemas guard the on-device
 * composition boundary.
 *
 * Duration unit conventions (documented per field):
 *   - Prayer.practiceDuration ....... whole minutes
 *   - Practice.durationOptions ...... whole minutes
 *   - PracticeStep.seconds .......... seconds
 *   - AudioItem.duration ............ seconds
 *   - Playlist.duration ............. whole minutes (approximate total)
 *
 * URL conventions: curated links may be canonical pages or platform search
 * URLs; `""` is allowed wherever a verified URL is not yet available (per
 * editorial policy: never fabricate a precise URL or platform ID).
 */

import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Shared primitives                                                    */
/* ------------------------------------------------------------------ */

const idSchema = z.string().min(1).max(120);

/** ISO calendar date, YYYY-MM-DD (used for `lastVerified` editorial metadata). */
const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

/** ISO datetime used for local composition metadata. */
const isoDateTimeSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "expected an ISO-8601 datetime string",
  });

/** http(s) URL, or "" when no verified URL exists yet. Never fabricate. */
const urlOrEmptySchema = z
  .string()
  .max(2000)
  .refine((value) => value === "" || /^https?:\/\/\S+$/.test(value), {
    message: "must be an http(s) URL or an empty string",
  });

const nonEmpty = (label: string, max = 20000) =>
  z.string().min(1, `${label} must not be empty`).max(max);

/* ------------------------------------------------------------------ */
/* Enums                                                                */
/* ------------------------------------------------------------------ */

/** Suitability windows set by content administrators (daily selection logic). */
export const TimeOfDaySchema = z.enum([
  "morning",
  "evening",
  "any",
  "seasonal-aware",
]);
export type TimeOfDay = z.infer<typeof TimeOfDaySchema>;

/** Editorial lifecycle. Public release requires source, safety and copy review. */
export const EditorialStatusSchema = z.enum(["draft", "review", "published"]);
export type EditorialStatus = z.infer<typeof EditorialStatusSchema>;

export const EditorialReviewStageSchema = z.enum([
  "source",
  "safety",
  "copy",
]);
export type EditorialReviewStage = z.infer<typeof EditorialReviewStageSchema>;

/** How product language relates to a cited passage. */
export const SourceRelationSchema = z.enum([
  "quotation",
  "paraphrase",
  "inspired-by",
  "comparative-context",
]);
export type SourceRelation = z.infer<typeof SourceRelationSchema>;

export const RightsStatusSchema = z.enum([
  "public-domain",
  "licensed",
  "permission-required",
  "reference-only",
  "unknown",
]);
export type RightsStatus = z.infer<typeof RightsStatusSchema>;

export const OcrQualitySchema = z.enum([
  "not-applicable",
  "clean",
  "variable",
  "low",
]);
export type OcrQuality = z.infer<typeof OcrQualitySchema>;

export const SourceDocumentFormatSchema = z.enum([
  "epub",
  "pdf",
  "plain-text",
  "markdown",
  "html",
  "osis",
  "usfm",
  "json-tree",
]);
export type SourceDocumentFormat = z.infer<
  typeof SourceDocumentFormatSchema
>;

export const LocatorSchemeSchema = z.enum([
  "canonical-node",
  "epub-path",
  "scripture-reference",
  "page",
  "line",
  "section",
  "custom",
]);
export type LocatorScheme = z.infer<typeof LocatorSchemeSchema>;

export const SourceVerificationSchema = z.enum([
  "mapped-from-extraction",
  "edition-checked",
  "quotation-checked",
]);
export type SourceVerification = z.infer<typeof SourceVerificationSchema>;

export const WorldviewProfileSchema = z.enum([
  "open-universal",
  "gnostic",
  "esoteric-christian",
  "neutral",
]);
export type WorldviewProfile = z.infer<typeof WorldviewProfileSchema>;

export const ConceptSafetyTagSchema = z.enum([
  "non-oracular",
  "reality-test-inner-knowing",
  "metaphor-only",
  "no-supernormal-practice",
  "ground-after-practice",
  "non-clerical",
  "source-specific",
]);
export type ConceptSafetyTag = z.infer<typeof ConceptSafetyTagSchema>;

/**
 * Claim classification — how a statement/tradition should be framed.
 * Used by sources, teachings and (as evidenceClassification) audio items.
 */
export const ClaimClassificationSchema = z.enum([
  "historical-teaching",
  "modern-interpretation",
  "symbolic",
  "preliminary-research",
  "research-synthesis",
  "no-established-clinical-evidence",
  "experiential-claim",
  "traditional-symbolic-use",
]);
export type ClaimClassification = z.infer<typeof ClaimClassificationSchema>;

/**
 * Evidence classification for audio items — the SAME value set as
 * claimClassification (per brief FREQUENCY CLAIMS section). Frequency-based
 * audio (432 Hz / 528 Hz / Solfeggio / binaural / chakra tones) MUST carry
 * "experiential-claim" or "no-established-clinical-evidence".
 */
export const EvidenceClassificationSchema = ClaimClassificationSchema;
export type EvidenceClassification = z.infer<typeof EvidenceClassificationSchema>;

/** Access labelling for external media (brief: label free/subscription/account-dependent). */
export const AccessTypeSchema = z.enum([
  "free",
  "subscription",
  "account-dependent",
]);
export type AccessType = z.infer<typeof AccessTypeSchema>;

export const AffirmationTypeSchema = z.enum([
  "grounding",
  "devotional",
  "contemplative",
  "releasing",
  "resilience",
  "gratitude",
]);
export type AffirmationType = z.infer<typeof AffirmationTypeSchema>;

export const PracticeTypeSchema = z.enum([
  "meditation",
  "breath",
  "visualisation",
  "contemplation",
  "sequence",
]);
export type PracticeType = z.infer<typeof PracticeTypeSchema>;

/**
 * The five functional stages in the reviewed Quantum Prayer methodology.
 * Names describe contemplative actions rather than making a physics claim.
 */
export const QuantumPrayerStageIdSchema = z.enum([
  "regulate",
  "embody",
  "evoke",
  "articulate",
  "release",
]);
export type QuantumPrayerStageId = z.infer<typeof QuantumPrayerStageIdSchema>;

export const SessionVariantSchema = z.enum([
  "morning-setting",
  "midday-recenter",
  "evening-integration",
  "challenge-reset",
  "before-sleep",
]);
export type SessionVariant = z.infer<typeof SessionVariantSchema>;

export const SourceTypeSchema = z.enum([
  "ancient-text",
  "scripture",
  "translation",
  "academic-book",
  "academic-article",
  "reference-work",
  "health-resource",
  "modern-spiritual",
]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

/**
 * Tradition labels distinguish historical teaching from modern
 * interpretation and original writing (brief principle 8).
 */
export const TraditionLabelSchema = z.enum([
  "historical-teaching",
  "modern-interpretation",
  "symbolic-language",
  "shared-tradition",
  "original-composition",
]);
export type TraditionLabel = z.infer<typeof TraditionLabelSchema>;

/** Category-level flags that trigger extra care in copy and safety handling. */
export const SafetyFlagSchema = z.enum([
  "grief-sensitive",
  "mental-health-adjacent",
  "medical-adjacent",
  "financial-adjacent",
  "relationship-adjacent",
  "abuse-adjacent",
  "none",
]);
export type SafetyFlag = z.infer<typeof SafetyFlagSchema>;

/**
 * Theme accent keys map to design tokens owned by the UI layer
 * (deep midnight base; pearl / gold / violet / luminous blue accents).
 */
export const ThemeAccentSchema = z.enum([
  "pearl",
  "gold",
  "violet",
  "azure",
  "rose",
  "sage",
  "amber",
  "indigo",
  "teal",
  "ember",
  "moonlight",
  "terra",
]);
export type ThemeAccent = z.infer<typeof ThemeAccentSchema>;

/* ------------------------------------------------------------------ */
/* Category                                                             */
/* ------------------------------------------------------------------ */

export const CategorySchema = z.object({
  id: idSchema,
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  name: nonEmpty("name", 120),
  shortDescription: nonEmpty("shortDescription", 240),
  longDescription: nonEmpty("longDescription", 4000),
  /** Lucide icon name (string), resolved by the UI layer. */
  icon: nonEmpty("icon", 60),
  /** Theme accent key (design-token lookup by the UI layer). */
  theme: ThemeAccentSchema,
  intentions: z.array(nonEmpty("intention", 120)).min(1).max(12),
  relatedCategoryIds: z.array(idSchema).max(12),
  safetyFlags: z.array(SafetyFlagSchema).min(1),
  isActive: z.boolean(),
});
export type Category = z.infer<typeof CategorySchema>;

/* ------------------------------------------------------------------ */
/* Prayer                                                               */
/* ------------------------------------------------------------------ */

export const PrayerSchema = z.object({
  id: idSchema,
  title: nonEmpty("title", 160),
  categoryIds: z.array(idSchema).min(1),
  /**
   * Distinguishes historical teaching from modern interpretation and
   * original composition (brief principle 8). Prayers are original writing
   * that may DRAW ON historical traditions — label accordingly.
   */
  traditionLabels: z.array(TraditionLabelSchema).min(1),
  /** Full assembled text (opening + body + closing). */
  content: nonEmpty("content"),
  opening: nonEmpty("opening", 2000),
  body: nonEmpty("body"),
  closing: nonEmpty("closing", 2000),
  /** Short affirmation paired with the prayer. No guaranteed outcomes. */
  affirmation: nonEmpty("affirmation", 400),
  /** Estimated practice length, whole minutes. */
  practiceDuration: z.number().int().min(1).max(120),
  /** 3–6 gentle practice steps. */
  practiceSteps: z.array(nonEmpty("practice step", 600)).min(3).max(6),
  reflectionPromptIds: z.array(idSchema),
  sourceIds: z.array(idSchema),
  sourceUses: z
    .array(
      z.object({
        anchorId: idSchema,
        relation: SourceRelationSchema,
      }),
    )
    .max(24)
    .optional(),
  audioIds: z.array(idSchema),
  tags: z.array(nonEmpty("tag", 60)).max(12),
  timeOfDay: TimeOfDaySchema,
  /**
   * When timeOfDay is "seasonal-aware", the calendar months (1–12) in which
   * this item is in season. Omit for non-seasonal items.
   */
  seasonalMonths: z.array(z.number().int().min(1).max(12)).min(1).max(12).optional(),
  editorialStatus: EditorialStatusSchema,
  /** Free-text care note; "" when none. Never medical advice. */
  safetyNotes: z.string().max(2000),
});
export type Prayer = z.infer<typeof PrayerSchema>;

/* ------------------------------------------------------------------ */
/* Affirmation                                                          */
/* ------------------------------------------------------------------ */

export const AffirmationSchema = z.object({
  id: idSchema,
  text: nonEmpty("text", 400),
  categoryIds: z.array(idSchema).min(1),
  affirmationType: AffirmationTypeSchema,
  sourceIds: z.array(idSchema),
  sourceUses: z
    .array(
      z.object({ anchorId: idSchema, relation: SourceRelationSchema }),
    )
    .max(12)
    .optional(),
  tags: z.array(nonEmpty("tag", 60)).max(12),
  editorialStatus: EditorialStatusSchema,
});
export type Affirmation = z.infer<typeof AffirmationSchema>;

/* ------------------------------------------------------------------ */
/* Practice (guided contemplative practice)                             */
/* ------------------------------------------------------------------ */

export const PracticeStepSchema = z.object({
  title: nonEmpty("step title", 120),
  instruction: nonEmpty("step instruction", 1200),
  /** Suggested time on this step, seconds. */
  seconds: z.number().int().min(5).max(3600),
});
export type PracticeStep = z.infer<typeof PracticeStepSchema>;

export const PracticeSchema = z.object({
  id: idSchema,
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  title: nonEmpty("title", 160),
  practiceType: PracticeTypeSchema,
  categoryIds: z.array(idSchema).min(1),
  /** Selectable durations, whole minutes (e.g. [3, 5, 10]). */
  durationOptions: z.array(z.number().int().min(1).max(120)).min(1).max(6),
  preparation: nonEmpty("preparation", 2000),
  steps: z.array(PracticeStepSchema).min(2).max(10),
  closing: nonEmpty("closing", 2000),
  /** Alternatives to audio-only instruction, posture options, etc. */
  accessibilityNotes: nonEmpty("accessibilityNotes", 2000),
  /** Care note; "" when none. Breath work must note dizziness guidance. */
  safetyNotes: z.string().max(2000),
  sourceIds: z.array(idSchema),
  sourceUses: z
    .array(
      z.object({ anchorId: idSchema, relation: SourceRelationSchema }),
    )
    .max(24)
    .optional(),
  audioIds: z.array(idSchema),
  editorialStatus: EditorialStatusSchema,
});
export type Practice = z.infer<typeof PracticeSchema>;

/* ------------------------------------------------------------------ */
/* Embodied coherence prayer method and sessions                       */
/* ------------------------------------------------------------------ */

export const QuantumPrayerMethodStageSchema = z.object({
  id: QuantumPrayerStageIdSchema,
  title: nonEmpty("method stage title", 120),
  seconds: z.number().int().min(5).max(600),
  purpose: nonEmpty("method stage purpose", 500),
  breathPattern: z
    .object({
      inhaleCounts: z.number().int().min(1).max(20),
      holdCounts: z.number().int().min(0).max(20),
      exhaleCounts: z.number().int().min(1).max(30),
    })
    .optional(),
  repetitions: z.number().int().min(1).max(12).optional(),
  optional: z.boolean().default(false),
});
export type QuantumPrayerMethodStage = z.infer<
  typeof QuantumPrayerMethodStageSchema
>;

const CORE_QUANTUM_STAGE_ORDER = [
  "regulate",
  "embody",
  "evoke",
  "articulate",
  "release",
] as const;
const CORE_QUANTUM_STAGE_SECONDS = [60, 30, 30, 30, 30] as const;

export const QuantumPrayerMethodSchema = z
  .object({
    id: z.literal("quantum-prayer-v1"),
    version: z.literal("1.0"),
    title: nonEmpty("method title", 160),
    summary: nonEmpty("method summary", 1000),
    stages: z.array(QuantumPrayerMethodStageSchema).length(5),
    intendedOutcomes: z.array(nonEmpty("intended outcome", 240)).min(3).max(8),
    evidenceBoundary: nonEmpty("evidence boundary", 2000),
    sourceIds: z.array(idSchema).min(1).max(12),
  })
  .superRefine((method, ctx) => {
    method.stages.forEach((stage, index) => {
      if (stage.id !== CORE_QUANTUM_STAGE_ORDER[index]) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "id"],
          message: `expected ${CORE_QUANTUM_STAGE_ORDER[index]}`,
        });
      }
      if (stage.seconds !== CORE_QUANTUM_STAGE_SECONDS[index]) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "seconds"],
          message: `expected ${CORE_QUANTUM_STAGE_SECONDS[index]} seconds`,
        });
      }
    });
    const regulate = method.stages[0];
    if (
      regulate?.breathPattern?.inhaleCounts !== 4 ||
      regulate.breathPattern.holdCounts !== 2 ||
      regulate.breathPattern.exhaleCounts !== 6
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["stages", 0, "breathPattern"],
        message: "the source protocol uses a 4–2–6 breathing option",
      });
    }
    if (method.stages[3]?.repetitions !== 3) {
      ctx.addIssue({
        code: "custom",
        path: ["stages", 3, "repetitions"],
        message: "the intention statement is repeated three times",
      });
    }
    if (!method.stages[2]?.optional) {
      ctx.addIssue({
        code: "custom",
        path: ["stages", 2, "optional"],
        message: "emotional evocation must remain optional",
      });
    }
  });
export type QuantumPrayerMethod = z.infer<typeof QuantumPrayerMethodSchema>;

export const SessionStageSchema = z.object({
  id: QuantumPrayerStageIdSchema,
  title: nonEmpty("session stage title", 120),
  seconds: z.number().int().min(5).max(600),
  instruction: nonEmpty("session stage instruction", 2000),
  prompt: nonEmpty("session stage prompt", 1000),
  repetitions: z.number().int().min(1).max(12).optional(),
  skippable: z.boolean().default(false),
});
export type SessionStage = z.infer<typeof SessionStageSchema>;

export const SessionTemplateSchema = z
  .object({
    id: idSchema,
    slug: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
    methodologyId: z.literal("quantum-prayer-v1"),
    variant: SessionVariantSchema,
    title: nonEmpty("session title", 160),
    summary: nonEmpty("session summary", 500),
    categoryIds: z.array(idSchema).min(1).max(8),
    opening: nonEmpty("session opening", 2000),
    stages: z.array(SessionStageSchema).length(5),
    closing: nonEmpty("session closing", 2000),
    audioTrackIds: z.array(idSchema).max(4),
    soundPurpose: nonEmpty("sound purpose", 1000),
    soundSetup: nonEmpty("sound setup", 1000),
    sourceIds: z.array(idSchema).min(1).max(12),
    accessibilityNotes: nonEmpty("session accessibility notes", 2000),
    safetyNotes: nonEmpty("session safety notes", 2000),
    editorialStatus: EditorialStatusSchema,
  })
  .superRefine((session, ctx) => {
    session.stages.forEach((stage, index) => {
      if (stage.id !== CORE_QUANTUM_STAGE_ORDER[index]) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "id"],
          message: `expected ${CORE_QUANTUM_STAGE_ORDER[index]}`,
        });
      }
      if (stage.seconds !== CORE_QUANTUM_STAGE_SECONDS[index]) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "seconds"],
          message: `expected ${CORE_QUANTUM_STAGE_SECONDS[index]} seconds`,
        });
      }
    });
    if (session.stages[3]?.repetitions !== 3) {
      ctx.addIssue({
        code: "custom",
        path: ["stages", 3, "repetitions"],
        message: "the intention statement is repeated three times",
      });
    }
    if (!session.stages[2]?.skippable) {
      ctx.addIssue({
        code: "custom",
        path: ["stages", 2, "skippable"],
        message: "emotional evocation must be skippable",
      });
    }
  });
export type SessionTemplate = z.infer<typeof SessionTemplateSchema>;

/* ------------------------------------------------------------------ */
/* Source (references — real, verifiable works only)                    */
/* ------------------------------------------------------------------ */

export const SourceSchema = z.object({
  id: idSchema,
  title: nonEmpty("title", 300),
  /** Author/editor; "" for anonymous or traditional works. */
  author: z.string().max(300),
  /** Publisher, institution or hosting body; "" when not applicable. */
  institution: z.string().max(300),
  /** Publication year of the cited edition; null for ancient/traditional works. */
  year: z.number().int().min(1).max(2100).nullable(),
  sourceType: SourceTypeSchema,
  /** Tradition or field, e.g. "Gnostic traditions", "Public health (NHS)". */
  tradition: nonEmpty("tradition", 200),
  claimClassification: ClaimClassificationSchema,
  /** Canonical reference URL, or "" when unsure. NEVER fabricate. */
  url: urlOrEmptySchema,
  citation: nonEmpty("citation", 1000),
  copyrightNotes: z.string().max(1000),
  lastVerified: isoDateSchema,
});
export type Source = z.infer<typeof SourceSchema>;

/* ------------------------------------------------------------------ */
/* Source editions, passage anchors and contemplative concepts         */
/* ------------------------------------------------------------------ */

export const SourceEditionSchema = z.object({
  id: idSchema,
  sourceId: idSchema,
  /** Individual work source ids contained by a collection edition. */
  includedSourceIds: z.array(idSchema).max(128).default([]),
  label: nonEmpty("edition label", 300),
  editorOrTranslator: z.string().max(300),
  publisher: z.string().max(300),
  publicationYear: z.number().int().min(1).max(2100).nullable(),
  language: nonEmpty("edition language", 80),
  rightsStatus: RightsStatusSchema,
  ocrQuality: OcrQualitySchema,
  contentFormat: SourceDocumentFormatSchema,
  /** SHA-256 of the exact private editorial input; no source text is shipped. */
  contentSha256: z
    .string()
    .regex(/^[a-f0-9]{64}$/, "expected a lowercase SHA-256")
    .nullable(),
  locatorStrategy: nonEmpty("edition locator strategy", 500),
  digitalLocator: urlOrEmptySchema,
  notes: nonEmpty("edition notes", 2000),
  lastVerified: isoDateSchema,
});
export type SourceEdition = z.infer<typeof SourceEditionSchema>;

export const StructuredLocatorSchema = z.object({
  scheme: LocatorSchemeSchema,
  /** Native reference or stable canonical node id at the start of the range. */
  start: nonEmpty("locator start", 500),
  /** Inclusive end reference when the anchor spans more than one unit. */
  end: z.string().max(500).optional(),
  display: nonEmpty("locator display", 500),
});
export type StructuredLocator = z.infer<typeof StructuredLocatorSchema>;

export const PassageAnchorSchema = z.object({
  id: idSchema,
  sourceId: idSchema,
  editionId: idSchema,
  workTitle: nonEmpty("workTitle", 300),
  sectionTitle: nonEmpty("sectionTitle", 300),
  locator: nonEmpty("locator", 500),
  structuredLocator: StructuredLocatorSchema,
  conceptIds: z.array(idSchema).min(1).max(16),
  verification: SourceVerificationSchema,
  notes: nonEmpty("passage anchor notes", 1600),
});
export type PassageAnchor = z.infer<typeof PassageAnchorSchema>;

export const SourcePolicyActivationSchema = z.enum(["any", "all"]);
export type SourcePolicyActivation = z.infer<
  typeof SourcePolicyActivationSchema
>;

export const SourceReviewPolicySchema = z.object({
  id: idSchema,
  label: nonEmpty("source review policy label", 200),
  detail: nonEmpty("source review policy detail", 1200),
  stage: EditorialReviewStageSchema,
  activation: SourcePolicyActivationSchema,
  sourceIds: z.array(idSchema).max(24),
  editionIds: z.array(idSchema).max(24),
});
export type SourceReviewPolicy = z.infer<typeof SourceReviewPolicySchema>;

export const CanonicalDocumentNodeKindSchema = z.enum([
  "collection",
  "work",
  "book",
  "chapter",
  "section",
  "paragraph",
  "verse",
  "page",
  "line",
]);
export type CanonicalDocumentNodeKind = z.infer<
  typeof CanonicalDocumentNodeKindSchema
>;

export const CanonicalDocumentNodeSchema = z.object({
  id: idSchema,
  parentId: idSchema.nullable(),
  kind: CanonicalDocumentNodeKindSchema,
  ordinal: z.number().int().min(0),
  label: z.string().max(500),
  nativeLocator: nonEmpty("native locator", 1000),
  textSha256: z.string().regex(/^[a-f0-9]{64}$/),
  /** Present only in the ignored private workbench, never the app registry. */
  text: z.string().optional(),
});
export type CanonicalDocumentNode = z.infer<
  typeof CanonicalDocumentNodeSchema
>;

export const CanonicalDocumentSchema = z.object({
  schemaVersion: z.literal("1.0"),
  manifestId: idSchema,
  sourceId: idSchema,
  editionId: idSchema,
  format: SourceDocumentFormatSchema,
  inputSha256: z.string().regex(/^[a-f0-9]{64}$/),
  nodes: z.array(CanonicalDocumentNodeSchema).min(1),
  warnings: z.array(z.string().max(1000)),
});
export type CanonicalDocument = z.infer<typeof CanonicalDocumentSchema>;

export const SourceIngestionManifestSchema = z.object({
  schemaVersion: z.literal("1.0"),
  id: idSchema,
  sourceId: idSchema,
  input: z.object({
    format: SourceDocumentFormatSchema,
    fileNameHint: nonEmpty("source file name hint", 500),
    expectedSha256: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .nullable(),
    encoding: nonEmpty("source encoding", 80).default("utf8"),
  }),
  sourceRecords: z.array(SourceSchema).max(128),
  edition: SourceEditionSchema,
  workMappings: z
    .array(
      z.object({
        sourceId: idSchema,
        label: nonEmpty("work mapping label", 300),
        pathIncludes: z.array(nonEmpty("work mapping path fragment", 500)).min(1),
      }),
    )
    .max(128)
    .optional(),
});
export type SourceIngestionManifest = z.infer<
  typeof SourceIngestionManifestSchema
>;

export const ContemplativeApplicationSchema = z.enum([
  "learn",
  "prayer",
  "practice",
  "reflection",
  "pathway",
]);
export type ContemplativeApplication = z.infer<
  typeof ContemplativeApplicationSchema
>;

export const ContemplativeConceptSchema = z.object({
  id: idSchema,
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  name: nonEmpty("concept name", 160),
  summary: nonEmpty("concept summary", 800),
  sourceAnchorIds: z.array(idSchema).min(1).max(24),
  classification: ClaimClassificationSchema,
  traditionLabels: z.array(TraditionLabelSchema).min(1),
  worldviewProfiles: z.array(WorldviewProfileSchema).min(1),
  safetyTags: z.array(ConceptSafetyTagSchema).min(1),
  applications: z.array(ContemplativeApplicationSchema).min(1),
  editorialStatus: EditorialStatusSchema,
});
export type ContemplativeConcept = z.infer<
  typeof ContemplativeConceptSchema
>;

/* ------------------------------------------------------------------ */
/* Source-grounded contemplative pathways                              */
/* ------------------------------------------------------------------ */

export const PathwayActivityTypeSchema = z.enum([
  "orient",
  "contemplate",
  "reflect",
  "integrate",
  "serve",
]);
export type PathwayActivityType = z.infer<
  typeof PathwayActivityTypeSchema
>;

export const PathwaySourceUseSchema = z.object({
  anchorId: idSchema,
  relation: SourceRelationSchema,
});
export type PathwaySourceUse = z.infer<typeof PathwaySourceUseSchema>;

export const PathwayActivitySchema = z.object({
  id: idSchema,
  title: nonEmpty("pathway activity title", 160),
  activityType: PathwayActivityTypeSchema,
  minutes: z.number().int().min(1).max(60),
  purpose: nonEmpty("pathway activity purpose", 500),
  instructions: z
    .array(nonEmpty("pathway activity instruction", 800))
    .min(2)
    .max(8),
  reflectionPrompt: nonEmpty("pathway reflection prompt", 600),
  sourceUses: z.array(PathwaySourceUseSchema).min(1).max(12),
  safetyNotes: nonEmpty("pathway activity safety notes", 1200),
});
export type PathwayActivity = z.infer<typeof PathwayActivitySchema>;

export const PathwayStageSchema = z.object({
  id: idSchema,
  title: nonEmpty("pathway stage title", 160),
  orientation: nonEmpty("pathway stage orientation", 1800),
  conceptIds: z.array(idSchema).min(1).max(8),
  activity: PathwayActivitySchema,
  relatedPracticeSlug: z.string().min(1).max(100).optional(),
});
export type PathwayStage = z.infer<typeof PathwayStageSchema>;

export const ContemplativePathwaySchema = z.object({
  id: idSchema,
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  title: nonEmpty("pathway title", 180),
  subtitle: nonEmpty("pathway subtitle", 240),
  summary: nonEmpty("pathway summary", 1000),
  estimatedMinutes: z.number().int().min(5).max(600),
  conceptIds: z.array(idSchema).min(2).max(16),
  sourceIds: z.array(idSchema).min(1).max(24),
  classification: ClaimClassificationSchema,
  traditionLabels: z.array(TraditionLabelSchema).min(1),
  worldviewProfiles: z.array(WorldviewProfileSchema).min(1),
  stages: z.array(PathwayStageSchema).min(3).max(8),
  accessibilityNotes: nonEmpty("pathway accessibility notes", 1600),
  safetyNotes: nonEmpty("pathway safety notes", 1600),
  editorialStatus: EditorialStatusSchema,
});
export type ContemplativePathway = z.infer<
  typeof ContemplativePathwaySchema
>;

export const EditorialReviewSchema = z
  .object({
    id: idSchema,
    subjectId: idSchema,
    status: EditorialStatusSchema,
    completedStages: z.array(EditorialReviewStageSchema).max(3),
    reviewer: z.string().max(200),
    reviewedAt: isoDateSchema.nullable(),
    notes: z.string().max(2000),
  })
  .superRefine((review, ctx) => {
    if (review.status !== "published") return;
    const required = EditorialReviewStageSchema.options;
    for (const stage of required) {
      if (!review.completedStages.includes(stage)) {
        ctx.addIssue({
          code: "custom",
          path: ["completedStages"],
          message: `published content requires ${stage} review`,
        });
      }
    }
    if (!review.reviewer || !review.reviewedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["reviewer"],
        message: "published content requires a reviewer and review date",
      });
    }
  });
export type EditorialReview = z.infer<typeof EditorialReviewSchema>;

/* ------------------------------------------------------------------ */
/* Audio item (curated external listening)                              */
/* ------------------------------------------------------------------ */

export const AudioPlatformSchema = z.enum([
  "youtube",
  "spotify",
  "apple-music",
  "web",
]);
export type AudioPlatform = z.infer<typeof AudioPlatformSchema>;

export const AudioItemSchema = z.object({
  id: idSchema,
  title: nonEmpty("title", 300),
  creator: nonEmpty("creator", 300),
  platform: AudioPlatformSchema,
  /** Precise platform ID only when verified; "" when unknown (never fabricate). */
  platformId: z.string().max(200),
  url: urlOrEmptySchema,
  /** Consent-gated iframe embed URL where applicable; "" when not available. */
  embedUrl: urlOrEmptySchema,
  /** Approximate duration, seconds; 0 when unknown/varies. */
  duration: z.number().int().min(0).max(86400),
  language: nonEmpty("language", 60),
  genre: nonEmpty("genre", 120),
  intendedUses: z.array(nonEmpty("intended use", 120)).min(1).max(8),
  evidenceClassification: EvidenceClassificationSchema,
  accessType: AccessTypeSchema,
  rightsNotes: z.string().max(1000),
  lastVerified: isoDateSchema,
});
export type AudioItem = z.infer<typeof AudioItemSchema>;

/* ------------------------------------------------------------------ */
/* Playlist (listening grouping)                                        */
/* ------------------------------------------------------------------ */

export const ExternalLinkSchema = z.object({
  label: nonEmpty("label", 160),
  url: urlOrEmptySchema,
});
export type ExternalLink = z.infer<typeof ExternalLinkSchema>;

export const PlaylistSchema = z.object({
  id: idSchema,
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  title: nonEmpty("title", 160),
  description: nonEmpty("description", 2000),
  intendedUse: nonEmpty("intendedUse", 240),
  /** Approximate total duration, whole minutes. */
  duration: z.number().int().min(1).max(1440),
  itemIds: z.array(idSchema).min(1),
  externalLinks: z.array(ExternalLinkSchema).max(12),
  /** Cover image path/URL; "" until artwork is commissioned. */
  coverImage: z.string().max(500),
  editorialStatus: EditorialStatusSchema,
});
export type Playlist = z.infer<typeof PlaylistSchema>;

/* ------------------------------------------------------------------ */
/* Teaching (learn guide)                                               */
/* ------------------------------------------------------------------ */

export const FurtherReadingSchema = z.object({
  title: nonEmpty("title", 300),
  author: z.string().max(300),
  url: urlOrEmptySchema,
});
export type FurtherReading = z.infer<typeof FurtherReadingSchema>;

export const TeachingSchema = z.object({
  id: idSchema,
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  title: nonEmpty("title", 200),
  /** One-sentence overview for cards and listings. */
  summary: nonEmpty("summary", 400),
  /** Guide body, markdown, 250–450 words (checked editorially, not by regex). */
  body: nonEmpty("body"),
  /** Tradition / evidence classification shown with the guide. */
  classification: ClaimClassificationSchema,
  relatedCategoryIds: z.array(idSchema).min(1),
  sourceIds: z.array(idSchema).min(1),
  sourceUses: z
    .array(
      z.object({ anchorId: idSchema, relation: SourceRelationSchema }),
    )
    .max(24)
    .optional(),
  furtherReading: z.array(FurtherReadingSchema).max(10),
  tags: z.array(nonEmpty("tag", 60)).max(12),
  editorialStatus: EditorialStatusSchema,
});
export type Teaching = z.infer<typeof TeachingSchema>;

/* ------------------------------------------------------------------ */
/* Reflection prompt                                                    */
/* ------------------------------------------------------------------ */

export const ReflectionPromptSchema = z.object({
  id: idSchema,
  text: nonEmpty("text", 600),
  categoryIds: z.array(idSchema).min(1),
  sourceUses: z
    .array(
      z.object({ anchorId: idSchema, relation: SourceRelationSchema }),
    )
    .max(12)
    .optional(),
  tags: z.array(nonEmpty("tag", 60)).max(12),
  editorialStatus: EditorialStatusSchema,
});
export type ReflectionPrompt = z.infer<typeof ReflectionPromptSchema>;

/* ------------------------------------------------------------------ */
/* Concept lenses for transparent Engine composition                   */
/* ------------------------------------------------------------------ */

export const ConceptEngineFrameSchema = z.object({
  id: idSchema,
  conceptId: idSchema,
  title: nonEmpty("concept frame title", 160),
  description: nonEmpty("concept frame description", 600),
  compatibleWorldviews: z.array(WorldviewProfileSchema).min(1),
  classification: ClaimClassificationSchema,
  traditionLabels: z.array(TraditionLabelSchema).min(1),
  sourceIds: z.array(idSchema).min(1).max(12),
  sourceUses: z
    .array(z.object({ anchorId: idSchema, relation: SourceRelationSchema }))
    .min(1)
    .max(12),
  prayerLine: nonEmpty("concept frame prayer line", 1200),
  affirmation: nonEmpty("concept frame affirmation", 400),
  practiceStep: nonEmpty("concept frame practice step", 600),
  reflectionPrompt: nonEmpty("concept frame reflection prompt", 600),
  safetyNote: nonEmpty("concept frame safety note", 1200),
  editorialStatus: EditorialStatusSchema,
});
export type ConceptEngineFrame = z.infer<typeof ConceptEngineFrameSchema>;

/* ------------------------------------------------------------------ */
/* On-device Engine request / result                                    */
/* ------------------------------------------------------------------ */

export const EngineOutputTypeSchema = z.enum([
  "prayer",
  "affirmation",
  "meditation",
  "combined-practice",
]);
export type EngineOutputType = z.infer<typeof EngineOutputTypeSchema>;

export const EngineDurationSchema = z.enum([
  "brief",
  "five-minutes",
  "ten-minutes",
  "extended",
]);
export type EngineDuration = z.infer<typeof EngineDurationSchema>;

export const EngineToneSchema = z.enum([
  "gentle",
  "direct",
  "contemplative",
  "devotional",
  "grounding",
]);
export type EngineTone = z.infer<typeof EngineToneSchema>;

export const EngineLanguagePreferenceSchema = z.enum([
  "creator",
  "source",
  "divine",
  "gnostic-terminology",
  "neutral",
]);
export type EngineLanguagePreference = z.infer<typeof EngineLanguagePreferenceSchema>;

/**
 * A composition request stays in the browser. `userNeed` may be empty when
 * the user explicitly chooses a category; it is never included in history.
 */
export const EngineRequestSchema = z.object({
  userNeed: z.string().max(600).default(""),
  categoryId: idSchema,
  outputType: EngineOutputTypeSchema,
  duration: EngineDurationSchema,
  tone: EngineToneSchema,
  languagePreference: EngineLanguagePreferenceSchema,
  worldviewProfile: WorldviewProfileSchema.default("open-universal"),
  /** Empty means no source-grounded concept lens. */
  conceptId: z.string().max(120).default(""),
  avoidances: z.array(nonEmpty("avoidance", 120)).max(20).default([]),
});
export type EngineRequest = z.infer<typeof EngineRequestSchema>;

export const EngineRecipeSchema = z.object({
  prayerId: idSchema.optional(),
  affirmationId: idSchema.optional(),
  practiceId: idSchema.optional(),
  promptIds: z.array(idSchema).max(4),
  cycle: z.number().int().min(1),
});
export type EngineRecipe = z.infer<typeof EngineRecipeSchema>;

export const EngineResultSchema = z.object({
  title: nonEmpty("title", 160),
  categoryId: idSchema,
  category: nonEmpty("category", 120),
  outputType: EngineOutputTypeSchema,
  opening: z.string().max(2000),
  prayer: z.string().max(20000),
  affirmation: z.string().max(400),
  practiceDuration: z.number().int().min(0).max(120),
  practiceSteps: z.array(nonEmpty("practice step", 600)).max(12),
  reflectionPrompts: z.array(nonEmpty("reflection prompt", 600)).max(6),
  closing: z.string().max(2000),
  sourceIds: z.array(idSchema).max(12),
  sourceUses: z
    .array(
      z.object({ anchorId: idSchema, relation: SourceRelationSchema }),
    )
    .max(24)
    .default([]),
  conceptIds: z.array(idSchema).max(6).default([]),
  worldviewProfile: WorldviewProfileSchema.default("open-universal"),
  traditionLabels: z.array(TraditionLabelSchema),
  audioRecommendationIds: z.array(idSchema).max(6),
  safetyNote: z.string().max(2000),
  safetyLevel: z.enum(["none", "distress", "escalation-risk", "crisis"]),
  assembledAt: isoDateTimeSchema,
  fingerprint: idSchema,
  recipe: EngineRecipeSchema,
});
export type EngineResult = z.infer<typeof EngineResultSchema>;
